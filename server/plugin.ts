import fs from "node:fs";
import path from "node:path";
import type { Plugin } from "vite";
import { readVault } from "./vault";

/**
 * Sirve `/api/workspace` leyendo la bóveda de Obsidian. Solo escucha en 127.0.0.1.
 * Ruta de la bóveda: variable `HQ_VAULT` o, por defecto, `./vault`.
 */
export function vaultApi(): Plugin {
  const root = path.resolve(process.env.HQ_VAULT || "vault");

  const handler = (req: { url?: string }, res: import("node:http").ServerResponse, next: () => void) => {
    if (!req.url || !req.url.startsWith("/api/workspace")) return next();
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.setHeader("Cache-Control", "no-store");
    try {
      const { workspace, warnings } = readVault(root);
      res.end(JSON.stringify({ vault: root, generatedAt: new Date().toISOString(), warnings, workspace }));
    } catch (error) {
      res.statusCode = 500;
      res.end(JSON.stringify({ error: (error as Error).message, vault: root }));
    }
  };

  return {
    name: "hq-vault-api",
    // Copia estática para compartir: deja la lectura de la bóveda como `api/workspace.json` en `dist/`.
    // Es una foto del momento de compilar; no se actualiza sola.
    closeBundle() {
      const outDir = path.resolve("dist");
      if (!fs.existsSync(outDir)) return;
      const { workspace, warnings } = readVault(root);
      fs.mkdirSync(path.join(outDir, "api"), { recursive: true });
      fs.writeFileSync(
        path.join(outDir, "api", "workspace.json"),
        JSON.stringify({ generatedAt: new Date().toISOString(), warnings, workspace }),
      );
    },
    configureServer(server) {
      server.middlewares.use(handler);
    },
    configurePreviewServer(server) {
      server.middlewares.use(handler);
    },
  };
}
