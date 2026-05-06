import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Plugin para manejar CORS preflight requests
const corsPlugin = () => ({
  name: "cors-preflight",
  configureServer(server: any) {
    return () => {
      server.middlewares.use((req: any, res: any, next: any) => {
        if (req.url?.startsWith("/api") && req.method === "OPTIONS") {
          res.writeHead(200, {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS, PATCH",
            "Access-Control-Allow-Headers": "Content-Type, Authorization, ngrok-skip-browser-warning",
            "Access-Control-Max-Age": "3600",
          });
          res.end();
          return;
        }
        next();
      });
    };
  },
});

export default defineConfig({
  server: {
    host: "::",
    port: 8081,
    proxy: {
      "/api": {
        target: "https://unsupervised-davin-pardonless.ngrok-free.dev",
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path,
        headers: {
          "ngrok-skip-browser-warning": "true",
        },
      },
    },
    hmr: {
      overlay: false,
    },
  },
  plugins: [react(), corsPlugin()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
    dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime", "@tanstack/react-query", "@tanstack/query-core"],
  },
});
