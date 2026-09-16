import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite-plus';

export default defineConfig({
  plugins: [tailwindcss(), react()],
  server: { host: true, port: 3000, strictPort: true },
  preview: { host: true, port: 3000, strictPort: true },
  build: { sourcemap: true },
});
