import { defineConfig } from 'vite';

export default defineConfig({
  base: '/Space-Invaders/',
  root: 'src',
  publicDir: '../public',
  build: {
    outDir: '../dist',
    emptyOutDir: true
  }
});
