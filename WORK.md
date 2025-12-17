# WORK.md

**Build**: v1.123.0
**Status**: In Progress
**Started**: 2025-12-16

## Objective

Remove esm package dependency and convert to native ESM to support Node v24 compatibility

## Plan

1. [ ] Rename index.js to index.mjs
2. [ ] Remove esm loader line from index.mjs
3. [ ] Convert module.exports to ESM export statement
4. [ ] Update package.json "main" field to point to index.mjs
5. [ ] Remove "esm" from dependencies in package.json
6. [ ] Test on Node v20 - npm run test
7. [ ] Test on Node v24 - npm run test
8. [ ] Run make rebuild to update build version

## Current Step

Ready to begin conversion

## Blockers

None

## Notes

- main.mjs already uses pure ESM syntax, no changes needed
- Both Node v20 and v24 support native ESM with .mjs files
- scv-bilara depends on scv-esm and needs this fix for Node v24 compatibility
