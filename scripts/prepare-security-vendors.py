"""Create reviewed local derivatives from the exact original npm installation.

Run only after npm ci against the pre-remediation lock. This is a reproducible
one-time source transformation, not a postinstall hook or an advisory ignore list.
"""
from __future__ import annotations
import difflib
import hashlib
import json
from pathlib import Path

ROOT = Path.cwd()
SPECS = {
    'braces': ('3.0.3', 'GHSA-vfj7-8cjw-p6xm', {
        'index.js':'332ea07c7b006361aad12aa994ca75dc1db8e8382b884909e2f38f10b85c88a4',
        'lib/compile.js':'dc98f22eee3d511785d92a00758d5f0d48efed5f5813bdecc2de430c529b5c9f',
        'lib/constants.js':'c18ac5adb57308f1ce42a28552da3a31f5d83709743ebd9a636336813a744d4b',
        'lib/expand.js':'41ccc196ebfa7b7781a634e721eb744e4e7bcb54cba427a7e3d6806a1b9e58f7',
        'lib/parse.js':'e572166565f15fa6ad9865ae49d678218e32aabfd1b3720f6d0d43d39800d310',
        'lib/stringify.js':'379f22d77bfa1478341ccd49c5e4267464aabcbba03558bab332aac23fc6f23a',
        'lib/utils.js':'b5a7596aa67730412b3c029ef09e84e6b67b8e445cffd35d1d295549c89066c7',
    }),
    'sprintf-js': ('1.0.3', 'GHSA-hp3w-g68c-fv3c', {
        'src/sprintf.js':'9904b0d448280bfdfcb0329bdac995883033597727404f9c058d051d9174b7c7',
    }),
}
GUARD = r"""'use strict';

// Structural limits are mandatory: caller options cannot disable them.
const MAX_DEPTH = 128;
const MAX_NODES = 65536;
const invalid = () => {
  const error = new SyntaxError('Brace AST exceeds safe structural limits');
  error.code = 'ERR_BRACES_DEPTH';
  return error;
};
function assertAst(ast) {
  const pending = [[ast, 0]];
  const seen = new WeakSet();
  let count = 0;
  while (pending.length) {
    const [node, depth] = pending.pop();
    if (!node || typeof node !== 'object' || depth > MAX_DEPTH || ++count > MAX_NODES || seen.has(node)) throw invalid();
    seen.add(node);
    // The upstream expand walker also follows parent pointers. Check these
    // iteratively so a hand-built cyclic parent chain cannot loop forever.
    const ancestors = new WeakSet();
    let parent = node.parent, distance = 0;
    while (parent) {
      if (typeof parent !== 'object' || ancestors.has(parent) || ++distance > MAX_DEPTH) throw invalid();
      ancestors.add(parent);
      parent = parent.parent;
    }
    if (node.nodes !== undefined) {
      if (!Array.isArray(node.nodes) || node.nodes.length + pending.length + count > MAX_NODES) throw invalid();
      for (let i = node.nodes.length - 1; i >= 0; i--) pending.push([node.nodes[i], depth + 1]);
    }
  }
}
module.exports = { MAX_DEPTH, assertAst, invalid };
"""

def sha(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def replace_once(text: str, old: str, new: str) -> str:
    if text.count(old) != 1:
        raise RuntimeError(f'Unexpected source anchor: {old!r}')
    return text.replace(old, new, 1)


def main() -> None:
    lock = json.loads((ROOT/'package-lock.json').read_text())
    package = json.loads((ROOT/'package.json').read_text())
    names = ['braces'] + (['sprintf-js'] if '@tinacms/cli' in package.get('devDependencies', {}) else [])
    manifest = {'schema': 1, 'notice': 'Local source patches are not upstream releases. Registry audit alone cannot validate these derivatives; security:vendor must also pass.', 'packages': {}}
    for name in names:
        version, advisory, expected = SPECS[name]
        installed = ROOT/'node_modules'/name
        original = json.loads((installed/'package.json').read_text())
        locked = lock['packages']['node_modules/'+name]
        if original['name'] != name or original['version'] != version or locked['version'] != version or not locked.get('integrity'):
            raise RuntimeError(f'Unexpected original package: {name}; refusing to regenerate')
        dest = ROOT/'vendor'/name
        if dest.exists():
            raise RuntimeError(f'{dest} already exists; regenerate in a clean original checkout')
        contents = {}
        for filename, digest in expected.items():
            data = (installed/filename).read_bytes()
            if sha(data) != digest:
                raise RuntimeError(f'Original source fingerprint mismatch: {name}/{filename}')
            contents[filename] = data.decode('utf-8')
        contents['LICENSE'] = (installed/'LICENSE').read_text()
        patched = dict(contents)
        if name == 'braces':
            patched['lib/guard.js'] = GUARD
            for filename, anchor in [('lib/compile.js', 'const compile = (ast, options = {}) => {'), ('lib/expand.js', 'const expand = (ast, options = {}) => {'), ('lib/stringify.js', 'module.exports = (ast, options = {}) => {')]:
                patched[filename] = replace_once(patched[filename], anchor, anchor + "\n  require('./guard').assertAst(ast);")
            for token in ['CHAR_LEFT_PARENTHESES', 'CHAR_LEFT_CURLY_BRACE']:
                anchor = f'    if (value === {token}) {{'
                patched['lib/parse.js'] = replace_once(patched['lib/parse.js'], anchor, anchor + "\n      if (stack.length >= require('./guard').MAX_DEPTH) throw require('./guard').invalid();")
            description = 'Bound parser nesting before allocating blocks; validate all recursive walker ASTs iteratively, including direct lib imports, excessive node counts and cyclic parent/child links. Ordinary grammar is unchanged. Over-limit inputs produce a controlled SyntaxError with ERR_BRACES_DEPTH, not stack exhaustion; callers must handle invalid-pattern errors.'
        else:
            for method, minimum in [('toExponential',0), ('toFixed',0), ('toPrecision',1)]:
                old = f'.{method}(match[7])'
                new = f'.{method}(Math.max({minimum}, Math.min(100, Number(match[7]))))'
                patched['src/sprintf.js'] = replace_once(patched['src/sprintf.js'], old, new)
            description = 'Clamp explicit floating-point precision to ECMAScript limits (0..100 for e/f; 1..100 for g), including numeric overflow to Infinity. Valid-format output and the legacy parse/format API remain unchanged. Out-of-range formats return bounded output rather than RangeError. Unused unpatched minified/Angular entrypoints are not shipped.'
        derivative = {k:original[k] for k in ['description','author','license','main','engines','dependencies'] if k in original}
        derivative.update({'name':'@jasperjlou/'+name+'-security-patch', 'version':version+'-project.1', 'private':True, 'files':sorted(patched), 'upstream':{'name':name,'version':version,'resolved':locked['resolved'],'integrity':locked['integrity'],'advisory':'https://github.com/advisories/'+advisory}})
        patched['package.json'] = json.dumps(derivative,indent=2)+'\n'
        for filename, text in patched.items():
            p=dest/filename; p.parent.mkdir(parents=True,exist_ok=True);p.write_text(text,encoding='utf-8')
        diff=''.join(''.join(difflib.unified_diff(contents.get(f,'').splitlines(True),patched[f].splitlines(True),fromfile='upstream/'+name+'/'+f,tofile='vendor/'+name+'/'+f)) for f in patched if f!='package.json' and contents.get(f)!=patched[f])
        (dest/'security.patch').write_text(diff)
        (dest/'SECURITY-PATCH.md').write_text(f'# Local security derivative of {name} {version}\n\n{description}\n\nAdvisory: https://github.com/advisories/{advisory}\n\nThis is NOT a new upstream release. The source and license come from the exact npm archive recorded in package.json. security.patch contains the complete code diff. Regenerate with scripts/prepare-security-vendors.py from the original lock, never from an already patched tree.\n\nRegistry audit alone does not cover this fork. Run npm run security:vendor after npm ci. Review this patch when upstream code or advisories change; remove the fork only after a fixed compatible upstream version passes the same tests.\n')
        manifest['packages'][name] = {'path':'vendor/'+name,'packageName':derivative['name'],'version':derivative['version'],'upstream':derivative['upstream'],'originalSourceSha256':expected,'files':{f:sha(t.encode()) for f,t in patched.items()}}
        package.setdefault('devDependencies',{})[name]='file:vendor/'+name
        package.setdefault('overrides',{})[name]='$'+name
    package.setdefault('scripts',{})['security:vendor']='node scripts/verify-security-vendors.cjs'
    package.setdefault('overrides',{})['postcss-selector-parser']='7.1.6'
    if 'sprintf-js' in names:
        package['overrides'].update({'@graphql-tools/utils':'12.1.0','katex':'0.18.2','react-router':'7.18.4','react-router-dom':'7.18.4'})
    (ROOT/'package.json').write_text(json.dumps(package,indent=2)+'\n')
    (ROOT/'vendor/security-patches.json').write_text(json.dumps(manifest,indent=2)+'\n')
    print(json.dumps({'created':names,'status':'source-patched; installation and regression checks still required'}))

if __name__ == '__main__':
    main()
