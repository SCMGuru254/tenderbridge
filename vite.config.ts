
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
      // Using a string literal to ensure proper parsing
      tsconfigRaw: JSON.stringify({
        compilerOptions: {
          preserveSymlinks: true,
          composite: false
        }
      })
    }
  },
  // Skip loading tsconfig.node.json to avoid the emit error
  build: {
    target: "esnext",
    sourcemap: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  }
}));
