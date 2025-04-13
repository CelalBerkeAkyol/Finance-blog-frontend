import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());

  return {
    plugins: [react()],
    define: {
      "import.meta.env.DEV": env.NODE_ENV === "development",
      "import.meta.env.PROD": env.NODE_ENV === "production",
    },
    server: {
      host: "0.0.0.0",
      port: 5173,
      strictPort: false,
      open: false,
      cors: true,
      proxy: {
        // Tüm /api isteklerini backend sunucusuna yönlendir
        "/api": {
          target: "http://localhost:3000", // Backend sunucu adresi
          changeOrigin: true,
          secure: false,
        },
      },
    },
  };
});
