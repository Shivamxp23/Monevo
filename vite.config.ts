import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    configureServer: (server) => {
      server.middlewares.use((req, res, next) => {
        const url = req.url;

        // Allow access to specific files or directories
        if (url === '/' || url === '/static-home.html' || url.startsWith('/assets/')) {
          return next();
        }

        // Restrict access to other files
        res.statusCode = 403;
        res.end('Access Forbidden');
      });
    },
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
  publicDir: path.resolve(__dirname, "public"), // Specify the public directory
}));
