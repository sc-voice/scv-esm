import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['test/**/*.mjs'],
    exclude: ['test/vitest.config.mjs'],
    setupFiles: [],
  },
});
