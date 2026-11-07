import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // Ensures assets resolve properly on GitHub Pages (e.g. username.github.io/repo-name/)
});
