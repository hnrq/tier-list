/// <reference types="vitest" />
/// <reference types="vite/client" />

import { defineConfig, UserConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';
import tsConfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [solidPlugin(), tsConfigPaths()],
  test: {
    environment: 'jsdom',
    globals: true,
    transformMode: {
      web: [/\.[jt]sx?$/],
    },
    setupFiles: './setupTests.ts',
    // solid needs to be inline to work around
    // a resolution issue in vitest:
    deps: {
      inline: [/solid-js/, /solid-testing-library/],
    },
    // if you have few tests, try commenting one
    // or both out to improve performance:
    threads: false,
    isolate: false,
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://products-scraper-api.herokuapp.com',
        changeOrigin: true,
      },
    },
  },
  build: {
    target: 'esnext',
    polyfillDynamicImport: false,
  },
  resolve: {
    conditions: ['development', 'browser'],
  },
} as UserConfig);
