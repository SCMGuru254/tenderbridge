
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  base: './',
  server: {
    host: "0.0.0.0",
    port: 8080,
    allowedHosts: true,
    watch: {
      usePolling: true,
      interval: 1000,
      ignored: ['**/node_modules/**', '**/.cache/**'],
    },
    hmr: {
      clientPort: 443,
    },
  },
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
    // VitePWA({
    //   registerType: 'autoUpdate',
    //   includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'logo.png', 'logo192.png', 'logo512.png'],
    //   manifest: {
    //     name: 'Supply Chain KE',
    //     short_name: 'SC-KE',
    //     description: 'Supply Chain Management Platform for Kenya',
    //     theme_color: '#ffffff',
    //     background_color: '#ffffff',
    //     display: 'standalone',
    //     icons: [
    //       {
    //         src: '/logo192.png',
    //         sizes: '192x192',
    //         type: 'image/png',
    //         purpose: 'any',
    //       },
    //       {
    //         src: '/logo192.png',
    //         sizes: '192x192',
    //         type: 'image/png',
    //         purpose: 'maskable',
    //       },
    //       {
    //         src: '/logo512.png',
    //         sizes: '512x512',
    //         type: 'image/png',
    //         purpose: 'any',
    //       },
    //       {
    //         src: '/logo512.png',
    //         sizes: '512x512',
    //         type: 'image/png',
    //         purpose: 'maskable',
    //       },
    //       {
    //         src: '/apple-touch-icon.png',
    //         sizes: '180x180',
    //         type: 'image/png',
    //       },
    //     ],
    //   },
    //   workbox: {
    //     maximumFileSizeToCacheInBytes: 50 * 1024 * 1024, // 50 MB
    //     globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
    //     runtimeCaching: [
    //       {
    //         urlPattern: /^https:\/\/api\.supabase\.co\/.*/i,
    //         handler: 'NetworkFirst',
    //         options: {
    //           cacheName: 'api-cache',
    //           networkTimeoutSeconds: 5,
    //           expiration: {
    //             maxEntries: 100,
    //             maxAgeSeconds: 72 * 60 * 60, // 72 hours
    //           },
    //           cacheableResponse: {
    //             statuses: [0, 200],
    //           },
    //         },
    //       },
    //       {
    //         urlPattern: /^https:\/\/[a-z0-9-]+\.supabase\.co\/storage\/v1\/object\/public\/.*/i,
    //         handler: 'StaleWhileRevalidate',
    //         options: {
    //           cacheName: 'storage-cache',
    //           expiration: {
    //             maxEntries: 100,
    //             maxAgeSeconds: 24 * 60 * 60, // 24 hours
    //           },
    //           cacheableResponse: {
    //             statuses: [0, 200],
    //           },
    //         },
    //       },
    //     ],
    //   },
    // }),
  ].filter(Boolean),
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  optimizeDeps: {
    include: ['react', 'react-dom'],
  },
  build: {
    target: "es2020",
    sourcemap: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    chunkSizeWarningLimit: 2000,
    rollupOptions: {
      output: {
        // manualChunks removed to fix circular dependency issues
        inlineDynamicImports: false,
      },
    },
  },
}));
