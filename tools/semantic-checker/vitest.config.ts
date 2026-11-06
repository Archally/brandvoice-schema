import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: {
      '@archally/brandvoice-schema/model': new URL('../model-builder/src/index.ts', import.meta.url).pathname,
    },
  },
  test: {
    globals: true,
    include: ['*.test.ts'],
    root: __dirname,
  },
});
