import { useEffect, useState } from "react";
import type { ProjectId } from "../data/types";

export type Route =
  | { name: "inicio" }
  | { name: "tareas" }
  | { name: "proyecto"; id: ProjectId }
  | { name: "decidir" }
  | { name: "bitacora" }
  | { name: "aprendido" }
  | { name: "mejoras" };

export function parseHash(hash: string): Route {
  const parts = hash.replace(/^#\/?/, "").split("/").filter(Boolean);
  const [a, b] = parts;
  if (a === "tareas") return { name: "tareas" };
  if (a === "decidir") return { name: "decidir" };
  if (a === "bitacora") return { name: "bitacora" };
  if (a === "aprendido") return { name: "aprendido" };
  if (a === "mejoras") return { name: "mejoras" };
  if (a === "p" && b) return { name: "proyecto", id: decodeURIComponent(b) };
  return { name: "inicio" };
}

export function routeKey(route: Route): string {
  return route.name === "proyecto" ? `proyecto:${route.id}` : route.name;
}

export function useRoute(): Route {
  const [route, setRoute] = useState<Route>(() => parseHash(location.hash));
  useEffect(() => {
    const onChange = () => setRoute(parseHash(location.hash));
    window.addEventListener("hashchange", onChange);
    return () => window.removeEventListener("hashchange", onChange);
  }, []);
  return route;
}
