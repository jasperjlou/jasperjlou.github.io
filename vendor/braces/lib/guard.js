'use strict';

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
