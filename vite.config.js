import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        home: 'react-pages/home.html',
        privacidad: 'react-pages/politica-de-privacidad.html'
      }
    }
  }
});
