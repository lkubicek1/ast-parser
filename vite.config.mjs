import { readFileSync } from 'node:fs';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

function getBasePath() {
  const packageJson = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf8'));
  const homepage = packageJson.homepage;

  if (!homepage) {
    return '/';
  }

  try {
    const { pathname } = new URL(homepage);
    return pathname.endsWith('/') ? pathname : `${pathname}/`;
  } catch {
    return '/';
  }
}

export default defineConfig(({ command }) => ({
  base: command === 'build' ? getBasePath() : '/',
  plugins: [react()],
  test: {
    css: true,
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/setupTests.js',
  },
}));
