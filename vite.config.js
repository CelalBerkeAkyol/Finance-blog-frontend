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
      port: 5173, // İsteğe bağlı, geliştirme için özel port
      host: "0.0.0.0", // Tüm ağ arayüzlerinden erişimi etkinleştir (mobil dahil)
    },
  };
});
