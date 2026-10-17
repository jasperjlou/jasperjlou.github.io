# Local security derivative of braces 3.0.3

Bound parser nesting before allocating blocks; validate all recursive walker ASTs iteratively, including direct lib imports, excessive node counts and cyclic parent/child links. Ordinary grammar is unchanged. Over-limit inputs produce a controlled SyntaxError with ERR_BRACES_DEPTH, not stack exhaustion; callers must handle invalid-pattern errors.

Advisory: https://github.com/advisories/GHSA-vfj7-8cjw-p6xm

This is NOT a new upstream release. The source and license come from the exact npm archive recorded in package.json. security.patch contains the complete code diff. Regenerate with scripts/prepare-security-vendors.py from the original lock, never from an already patched tree.

Registry audit alone does not cover this fork. Run npm run security:vendor after npm ci. Review this patch when upstream code or advisories change; remove the fork only after a fixed compatible upstream version passes the same tests.
