import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  define: {
    global: {},
  },
  server: {
    cors: true,
    headers: {
      "Cross-Origin-Resource-Policy": "cross-origin",
    },
  },
});
