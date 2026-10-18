# Local security derivative of sprintf-js 1.0.3

Clamp explicit floating-point precision to ECMAScript limits (0..100 for e/f; 1..100 for g), including numeric overflow to Infinity. Valid-format output and the legacy parse/format API remain unchanged. Out-of-range formats return bounded output rather than RangeError. Unused unpatched minified/Angular entrypoints are not shipped.

Advisory: https://github.com/advisories/GHSA-hp3w-g68c-fv3c

This is NOT a new upstream release. The source and license come from the exact npm archive recorded in package.json. security.patch contains the complete code diff. Regenerate with scripts/prepare-security-vendors.py from the original lock, never from an already patched tree.

Registry audit alone does not cover this fork. Run npm run security:vendor after npm ci. Review this patch when upstream code or advisories change; remove the fork only after a fixed compatible upstream version passes the same tests.
