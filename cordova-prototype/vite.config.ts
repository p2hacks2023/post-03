import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      jsxImportSource: "@emotion/react",
    }),
  ],
  server: {
    host: "0.0.0.0",
    port: 8080,
  },
  build: {
    outDir: "www",
  },
});
