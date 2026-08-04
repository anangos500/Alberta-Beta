import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(() => {
  return {
    plugins: [
      react(), 
      tailwindcss(),
      VitePWA({
        registerType: 'autoUpdate',
        injectRegister: 'auto',
        includeAssets: [],
        manifest: {
          name: 'Bimbel Alberta',
          short_name: 'Alberta',
          description: 'Portal Belajar Bimbel Alberta Bondowoso',
          theme_color: '#8e2de2',
          background_color: '#ffffff',
          display: 'standalone',
          icons: [
            {
              src: 'https://exyrlwugzdvqfiafvfcv.supabase.co/storage/v1/object/public/images/Icon%20193X193.png',
              sizes: '192x192',
              type: 'image/png',
              purpose: 'any maskable'
            },
            {
              src: 'https://exyrlwugzdvqfiafvfcv.supabase.co/storage/v1/object/public/images/Icon%20513X513.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any maskable'
            }
          ]
        }
      })
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      host: '0.0.0.0',
      port: 3000,
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
