import { buildMockWorkspace } from "./mock";
import type { Workspace } from "./types";

/**
 * Frontera entre el panel y sus datos. Lee la bóveda de Obsidian a través de `/api/workspace`
 * (ver `server/`). El resto de la app no sabe de dónde vienen los datos.
 *
 * Parámetros de prueba: `?demo` (datos ficticios), `?simular=error` (falla una vez),
 * `?rapido` (sin latencia simulada, solo en demo).
 */
let errorAlreadyShown = false;

export async function fetchWorkspace(signal?: AbortSignal, options: { silent?: boolean } = {}): Promise<Workspace> {
  const params = new URLSearchParams(location.search);

  if (params.get("simular") === "error" && !errorAlreadyShown && !options.silent) {
    // Se marca al fallar de verdad (no al pedir), para que React StrictMode no consuma el error.
    await new Promise((resolve) => window.setTimeout(resolve, 400));
    errorAlreadyShown = true;
    throw new Error("No se pudo leer la bóveda de Obsidian.");
  }

  if (params.has("demo")) {
    const delay = params.has("rapido") ? 0 : 700;
    await new Promise<void>((resolve, reject) => {
      const timer = window.setTimeout(resolve, delay);
      signal?.addEventListener("abort", () => {
        window.clearTimeout(timer);
        reject(new DOMException("Cancelado", "AbortError"));
      });
    });
    return buildMockWorkspace();
  }

  let response: Response;
  try {
    // En desarrollo lo sirve el plugin de Vite en vivo; en la copia compilada es una foto estática.
    const url = import.meta.env.PROD ? new URL("api/workspace.json", document.baseURI).href : "/api/workspace";
    response = await fetch(url, { signal, cache: "no-store" });
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") throw error;
    throw new Error("No se pudo conectar con el servidor local del HQ. ¿Está corriendo «npm run dev»?");
  }

  const payload = (await response.json().catch(() => null)) as { workspace?: Workspace; generatedAt?: string; error?: string } | null;
  if (!response.ok || !payload?.workspace) {
    throw new Error(payload?.error ?? "El servidor local respondió con un error.");
  }
  return { ...payload.workspace, generatedAt: payload.generatedAt };
}
