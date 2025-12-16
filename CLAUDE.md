# scv-esm CLAUDE.md

## Objective

Make scv-esm compatible with Node 24.x to support OIDC npm publishing in dependent projects (scv-bilara, etc).

## Context

- Current: mocha 11.0.1, no explicit Node version constraints
- Goal: Ensure scv-esm works with Node 24.x (npm 11.6.2+)
- Reason: scv-bilara workflows need Node 24 for OIDC token generation with npmjs.org
- scv-esm is a dependency of scv-bilara and other modules

## Backlog

1. ✓ Test scv-esm against Node 24.x locally (DONE - all 81 tests pass)
2. ✓ Update devDependencies if needed (DONE - found not needed)
3. ✓ Add Node version constraint to package.json (DONE - found not needed)
4. ✓ Run full test suite on Node 24.x (DONE)
5. [ ] Publish updated scv-esm to npm
