import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  base: './', // Configurado para despliegue transparente en GitHub Pages
  plugins: [vue()],
  server: {
    port: 3000,
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
});
