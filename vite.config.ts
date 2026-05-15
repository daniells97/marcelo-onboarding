import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Use index-vite.html as the entry point (index.html is the original CDN app preserved intact)
  root: '.',
  build: {
    rollupOptions: {
      input: 'index-vite.html',
    },
  },
});
