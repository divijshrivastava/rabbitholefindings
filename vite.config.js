import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'esbuild',
    rollupOptions: {
      input: {
        main: './index.html'
      }
    },
    // Ensure proper handling of static assets
    assetsInlineLimit: 4096
  },
  server: {
    port: 3000,
    open: true
  },
  // Resolve configuration for Vercel
  resolve: {
    alias: {
      '@': '/',
      '~': '/'
    }
  }
});

