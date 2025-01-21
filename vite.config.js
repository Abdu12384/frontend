// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'), // Adjust this if your components folder is elsewhere
    },
  },
  optimizeDeps: {
    include: ['lottie-react'],  
  },
});
