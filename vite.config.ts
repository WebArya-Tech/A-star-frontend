// import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react';

// // https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react()],
//   // Include uppercase asset extensions so Vite's import-analysis accepts them
//   assetsInclude: ['**/*.PNG', '**/*.JPG', '**/*.JPEG'],
//   optimizeDeps: {
//     exclude: ['lucide-react'],
//   },
// });
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  assetsInclude: ['**/*.PNG', '**/*.JPG', '**/*.JPEG'],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  // Dev-time proxy to avoid CORS when calling the real backend
  server: {
    proxy: {
      // Proxy /api/* and /admin/api/* to the real API server
      '/api': {
        target: 'https://api.astarclasses.com',
        changeOrigin: true,
        secure: false,
      },
      '/admin': {
        target: 'https://api.astarclasses.com',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
