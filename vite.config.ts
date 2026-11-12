import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Fejlesztés közben az /api hívásokat a Laravel szerverre (php artisan serve) továbbítjuk
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': { target: 'http://localhost:8000', changeOrigin: true },
    },
  },
});
