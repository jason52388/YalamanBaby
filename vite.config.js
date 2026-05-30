import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base: './' keeps asset paths relative so the built site works on
// GitHub Pages / Netlify / Vercel / opening the file directly.
export default defineConfig({
  plugins: [react()],
  base: './',
});
