import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// base "./" so the production build works under Electron's file:// protocol.
export default defineConfig({
  base: "./",
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      // Browser-dev mode only: forward /api to the optional Node proxy.
      "/api": { target: "http://localhost:8787", changeOrigin: true },
    },
  },
  build: { outDir: "dist" },
});
