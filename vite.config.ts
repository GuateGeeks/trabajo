import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { vaultApi } from "./server/plugin";

export default defineConfig({
  // Rutas relativas: la copia estática funciona bajo cualquier subruta (por ejemplo GitHub Pages).
  base: "./",
  plugins: [react(), vaultApi()],
  server: { port: 5180, strictPort: true },
});
