import { expect } from 'vitest';

// Custom equality tester for functions: compare by source code instead of reference
function functionEqualityTester(a, b) {
  if (typeof a === 'function' && typeof b === 'function') {
    return a.toString() === b.toString();
  }
  return undefined;
}

expect.addEqualityTesters([functionEqualityTester]);
