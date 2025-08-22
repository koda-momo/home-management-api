import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'dist/',
        '**/*.d.ts',
        'vitest.config.mjs',
        'eslint.config.js',
        'src/app.ts',
        'src/server.ts',
        'src/config/**',
        'src/middlewares/**',
        'src/routes/**',
        'src/types/**',
        'src/__tests__/__mocks__/**',
      ],
    },
  },
});
