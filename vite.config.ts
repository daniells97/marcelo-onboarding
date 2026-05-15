import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { existsSync, readFileSync, writeFileSync, unlinkSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

// After build, rename dist/index-vite.html → dist/index.html so
// the Vercel rewrite ("destination": "/index.html") resolves correctly.
function renameHtmlPlugin() {
  return {
    name: 'rename-html-output',
    apply: 'build' as const,
    closeBundle() {
      const src = resolve(__dirname, 'dist/index-vite.html');
      const dest = resolve(__dirname, 'dist/index.html');
      if (existsSync(src)) {
        writeFileSync(dest, readFileSync(src, 'utf-8'));
        unlinkSync(src);
      }
    },
  };
}

export default defineConfig({
  plugins: [react(), renameHtmlPlugin()],
  root: '.',
  build: {
    rollupOptions: {
      input: 'index-vite.html',
    },
  },
});
