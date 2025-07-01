import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite'
import laravel from 'laravel-vite-plugin';
import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import { ejsFormioPlugin } from './vite-plugin-ejs-formio';

export default defineConfig({
  plugins: [
    laravel({
      input: ['resources/css/app.css', 'resources/js/app.tsx'],
      ssr: 'resources/js/ssr.tsx',
      refresh: true,
    }),
    react(),
    tailwindcss(),
    ejsFormioPlugin({
      templateDir: 'resources/js/lib/tailwind-formio/src/templates',
      templateExtension: '.ejs',
      watch: true
    }),
  ],
  esbuild: {
    jsx: 'automatic',
  },
  resolve: {
    alias: {
      'ziggy-js': resolve(__dirname, 'vendor/tightenco/ziggy'),
    },
  },
});
