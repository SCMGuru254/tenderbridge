
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { ConfigEnv, UserConfig } from "vite";
// @ts-ignore
const viteCommonjs = require('@originjs/vite-plugin-commonjs');

// https://vitejs.dev/config/
export default defineConfig(({ mode }: ConfigEnv): UserConfig => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
    viteCommonjs()
  ].filter(Boolean),
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    },
    mainFields: ['main', 'module']
  },
  optimizeDeps: {
    include: [
      'react', 
      'react-dom',
      '@supabase/supabase-js',
      '@supabase/postgrest-js',
      '@supabase/realtime-js'
    ],
    esbuildOptions: {
      target: 'esnext',
      platform: 'browser',
      supported: {
        'import-meta': true
      }
    }
  },
  build: {
    target: "esnext",
    sourcemap: true,
    commonjsOptions: {
      transformMixedEsModules: true,
      include: [/@supabase\/.*/, /node_modules/],
      requireReturnsDefault: 'preferred'
    },
    rollupOptions: {
      external: [],
      output: {
        format: 'es'
      }
    }
  }
}));
