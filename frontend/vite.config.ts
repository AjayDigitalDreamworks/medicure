import { defineConfig, Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// Detect if we’re in dev mode
const isDev = process.env.NODE_ENV !== "production";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    proxy: {
      "/api": {
        target: "https://medicure-57ts.onrender.com/", // Replace with real backend URL
        changeOrigin: true,
        secure: false,
      },
    },
  fs: {
    allow: ["./client", "./shared", "./node_modules", "./"],
    deny: [".env", ".env.*", "*.{crt,pem}", "**/.git/**", "server/**"],
  },


  },
  build: {
    outDir: "dist", // Netlify expects this
  },
  plugins: [
    react(),
    ...(isDev ? [expressPlugin()] : []), // Only add express plugin in dev
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./client"),
      "@shared": path.resolve(__dirname, "./shared"),
    },
  },
}));

function expressPlugin(): Plugin {
  return {
    name: "express-plugin",
    apply: "serve", // Only apply during dev
    configureServer(server) {
      const { createServer } = require("./server"); // Import only in dev
      const app = createServer();
      server.middlewares.use(app);
    },
  };
}
