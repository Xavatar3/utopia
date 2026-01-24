import path from "path";
import { fileURLToPath } from "url";
import { defineConfig } from "vite";
import wasm from 'vite-plugin-wasm';
import topLevelAwait from 'vite-plugin-top-level-await';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  root: "src",
  build: {
    outDir: "../dist",
    sourcemap: true, 
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks: {
          three: ["three"]
        }
      }
    }
  },

  server: {
    host: true,
    port: 5173,
    strictPort: false,
    cors: false,
    proxy: {
      "/api": "http://localhost:3000"
    },
    watch: {
      usePolling: true
    }
  },
  

  plugins: [
    wasm(),
    topLevelAwait(),
  ],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src")
    }
  },
  
  optimizeDeps: {
    include: ["three"]
  },

  define: {
    "process.env": {} // Node env 
  }
});