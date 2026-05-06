import { fileURLToPath, URL } from "node:url";
import type { IncomingMessage, ServerResponse } from "node:http";
import { defineConfig, type ProxyOptions, type ViteDevServer } from "vite";
import react from "@vitejs/plugin-react";

const configurarProxyBackend: ProxyOptions["configure"] = (proxy) => {
  proxy.on("proxyReq", (proxyReq) => {
    // Refuerzo para que el proxy no reenvie el origen local al backend.
    proxyReq.removeHeader("origin");
    proxyReq.removeHeader("referer");
  });
};

// Plugin para manejar CORS preflight requests
const corsPlugin = () => ({
  name: "cors-preflight",
  configureServer(server: ViteDevServer) {
    server.middlewares.use((req: IncomingMessage, res: ServerResponse, next: () => void) => {
      if (req.url?.startsWith("/api")) {
        // El backend valida CORS. En desarrollo el navegador habla con Vite y
        // Vite reenvia al backend, asi que limpiamos el origen local antes del
        // proxy para que llegue como una llamada servidor-a-servidor.
        delete req.headers.origin;
        delete req.headers.referer;
      }

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
        configure: configurarProxyBackend,
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
