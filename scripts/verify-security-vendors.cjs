'use strict';

// Registry audit does not inspect local derivatives. This independent gate
// validates exact source/installed fingerprints AND exercises the patched APIs.
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const assert = require('node:assert/strict');
const {spawnSync} = require('node:child_process');
const root = process.cwd();
let tests = 0;
const results = [];
function check(label, fn) { fn(); tests++; results.push(label); }
const hash = buffer => crypto.createHash('sha256').update(buffer).digest('hex');
const baseline = process.argv.includes('--baseline');
const upstreamFailure = (name, expression) => {
  const code = `const p=require(${JSON.stringify(path.join(root,'node_modules',name))});try{${expression};process.exit(10)}catch(e){if(!(e instanceof RangeError))throw e;console.log(e.name)}`;
  const result = spawnSync(process.execPath, ['-e', code], {encoding:'utf8', timeout:5000, maxBuffer:4096});
  assert.equal(result.error,undefined,`baseline child failed: ${result.error}`);
  assert.equal(result.status,0,result.stderr || result.stdout);
  assert.match(result.stdout,/RangeError/);
};
if (baseline) {
  for (const method of ['compile','expand','stringify']) check(`original braces.${method} reproduces deep-AST stack exhaustion`,()=>upstreamFailure('braces',`let ast={type:'root',nodes:[]};for(let i=0;i<12000;i++)ast={type:'root',nodes:[ast]};p.${method}(ast)`));
  if (fs.existsSync('node_modules/sprintf-js')) for (const spec of ['e','f','g']) check(`original sprintf ${spec} reproduces unbounded precision`,()=>upstreamFailure('sprintf-js',`p.sprintf('%.100000${spec}',1.2345)`));
} else {
  const manifest=JSON.parse(fs.readFileSync('vendor/security-patches.json','utf8'));
  const lock=JSON.parse(fs.readFileSync('package-lock.json','utf8'));
  const project=JSON.parse(fs.readFileSync('package.json','utf8'));
  for(const [name, entry] of Object.entries(manifest.packages)) {
    check(`${name}: pinned direct alias and override`,()=>{
      assert.equal(project.devDependencies[name],`file:${entry.path}`);
      assert.equal(project.overrides[name],`$${name}`);
      assert.match(entry.upstream.integrity,/^sha512-/);
      assert.ok(Object.keys(entry.originalSourceSha256).length>0);
    });
    const installations=Object.keys(lock.packages).filter(p=>p.endsWith(`/node_modules/${name}`)||p===`node_modules/${name}`);
    assert.ok(installations.length>0,`${name}: no installed entry`);
    for(const location of [entry.path,...installations]) check(`${name}: exact fingerprints at ${location}`,()=>{
      const pkg=JSON.parse(fs.readFileSync(path.join(location,'package.json'),'utf8'));
      assert.equal(pkg.name,entry.packageName);assert.equal(pkg.version,entry.version);
      assert.deepEqual(pkg.upstream,entry.upstream);
      for(const [file,digest] of Object.entries(entry.files)) assert.equal(hash(fs.readFileSync(path.join(location,file))),digest,`${location}/${file} changed`);
    });
  }
  const b=require(path.join(root,'node_modules/braces'));
  const safeError=e=>e instanceof SyntaxError && e.code==='ERR_BRACES_DEPTH' && !(e instanceof RangeError);
  const nesting=[['{','}'],['(',')']];
  for(const [left,right] of nesting) for(const method of ['parse','compile','expand','stringify']) {
    check(`braces.${method}: reject 4500 nested ${left}`,()=>assert.throws(()=>b[method](left.repeat(4500)+'a,b'+right.repeat(4500)),safeError));
  }
  check('braces: options cannot disable depth protection',()=>assert.throws(()=>b.compile('{'.repeat(500)+'a'+'}'.repeat(500),{maxDepth:Infinity}),safeError));
  check('braces: ordinary lists and ranges retain expected expansion',()=>assert.deepEqual(b.expand('x/{a,b}/{1..3}'),['x/a/1','x/a/2','x/a/3','x/b/1','x/b/2','x/b/3']));
  check('braces: ordinary compile/stringify APIs remain compatible',()=>{assert.equal(b.compile('x/{a,b}'),'x/(a|b)');assert.equal(b.stringify(b.parse('x/{a,b}')),'x/{a,b}');});
  check('braces: nested normal grammar',()=>assert.deepEqual(b.expand('{a,{b,c}}'),['a','b','c']));
  check('braces: escaped brace text does not consume nesting budget',()=>assert.doesNotThrow(()=>b.parse('\\{'.repeat(500))));
  check('braces: quoted brace text does not consume nesting budget',()=>assert.doesNotThrow(()=>b.parse('"'+'{'.repeat(500)+'"')));
  check('braces: bracket literals do not consume nesting budget',()=>assert.doesNotThrow(()=>b.parse('['+'{'.repeat(500)+']')));
  check('braces: array API and de-duplication',()=>assert.deepEqual(b(['{a,b}','{b,c}'],{expand:true,nodupes:true}),['a','b','c']));
  for(const method of ['compile','expand','stringify']) {
    check(`braces.${method}: reject cyclic child AST`,()=>{const ast={type:'root',nodes:[]};ast.nodes.push(ast);assert.throws(()=>b[method](ast),safeError);});
    check(`braces.${method}: reject cyclic parent AST`,()=>{const ast={type:'root',nodes:[]};ast.parent=ast;assert.throws(()=>b[method](ast),safeError);});
    check(`braces.${method}: reject deep hand-built AST`,()=>{let ast={type:'root',nodes:[]},n=ast;for(let i=0;i<500;i++){const next={type:'brace',nodes:[]};n.nodes.push(next);n=next;}assert.throws(()=>b[method](ast),safeError);});
    check(`braces/${method}: direct lib import also enforces guard`,()=>{const ast={type:'root',nodes:[]};ast.nodes.push(ast);assert.throws(()=>require(path.join(root,'node_modules/braces/lib',method+'.js'))(ast),safeError);});
  }
  check('braces: excessive AST width is rejected before queuing children',()=>assert.throws(()=>b.compile({type:'root',nodes:Array(65537).fill({type:'text',value:'x'})}),safeError));
  if(manifest.packages['sprintf-js']) {
    const s=require(path.join(root,'node_modules/sprintf-js'));
    for(const [spec,min] of [['e',0],['f',0],['g',1]]) {
      for(const precision of ['101','100000','9'.repeat(400)]) check(`sprintf ${spec}: precision ${precision.length>10?'overflow':precision} stays bounded`,()=>{const out=s.sprintf(`%.${precision}${spec}`,1.2345);assert.equal(typeof out,'string');assert.ok(out.length<120);});
      check(`sprintf ${spec}: valid precision output unchanged`,()=>{
        const method={e:'toExponential',f:'toFixed',g:'toPrecision'}[spec];
        for(const n of [min,1,2,20,100]) assert.equal(s.sprintf(`%.${n}${spec}`,1.2345),(1.2345)[method](n));
      });
    }
    check('sprintf: zero significant digits is safely clamped',()=>assert.equal(s.sprintf('%.0g',1.2345),'1'));
    check('sprintf: positional and named normal formats',()=>{assert.equal(s.sprintf('%s %04d','item',7),'item 0007');assert.equal(s.sprintf('%(x)s',{x:'ok'}),'ok');assert.equal(s.vsprintf('%s=%d',['a',2]),'a=2');});
    check('sprintf: legacy parse/format API is preserved',()=>assert.equal(s.sprintf.format(s.sprintf.parse('%.2f'),['unused',1.2345]),'1.23'));
  }
}
console.log(JSON.stringify({mode:baseline?'original-vulnerability-reproduction':'patched-source-and-regressions',tests,passed:tests,results},null,2));
