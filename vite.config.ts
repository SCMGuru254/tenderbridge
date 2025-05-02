
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { ConfigEnv } from "vite";

// https://vitejs.dev/config/
export default defineConfig(({ mode }: ConfigEnv) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  optimizeDeps: {
    esbuildOptions: {
      // Ensure tsconfig is simplified
      tsconfigRaw: '{"compilerOptions":{"preserveSymlinks":true,"composite":false,"skipLibCheck":true}}',
      // Exclude Node modules
      external: ['events']
    },
    exclude: ['events']
  },
  build: {
    target: "esnext",
    sourcemap: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    // Completely skip TypeScript checking during build
    skipTypeCheck: true,
    rollupOptions: {
      // Explicitly handle Node.js built-in modules
      external: ['events']
    }
  }
}));
