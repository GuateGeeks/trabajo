import { CheckCheck, House, Lightbulb, ListChecks, Rocket, ScrollText } from "lucide-react";
import type { ReactNode } from "react";
import { routeKey, type Route } from "../hooks/useRoute";

interface DockItem {
  key: string;
  href: string;
  label: string;
  icon: ReactNode;
  badge?: number;
}

/**
 * Dock de dos grupos: lo operativo (inicio, tareas) y la supervisión de la IA
 * (decidir, bitácora, aprendido, mejoras). Los proyectos NO van aquí: son dinámicos y se
 * eligen desde Inicio, así el dock no crece cuando se conecta otra herramienta.
 */
export function Dock({ route, openTasks, pending }: { route: Route; openTasks: number; pending: number }) {
  // Estar dentro de un proyecto cuenta como estar en Inicio (de ahí se llega).
  const current = route.name === "proyecto" ? "inicio" : routeKey(route);
  const size = 22;
  const work: DockItem[] = [
    { key: "inicio", href: "#/", label: "Inicio", icon: <House size={size} /> },
    { key: "tareas", href: "#/tareas", label: "Tareas", icon: <ListChecks size={size} />, badge: openTasks },
  ];
  const supervise: DockItem[] = [
    { key: "decidir", href: "#/decidir", label: "Decidir", icon: <CheckCheck size={size} />, badge: pending },
    { key: "bitacora", href: "#/bitacora", label: "Bitácora", icon: <ScrollText size={size} /> },
    { key: "aprendido", href: "#/aprendido", label: "Aprendido", icon: <Lightbulb size={size} /> },
    { key: "mejoras", href: "#/mejoras", label: "Mejoras", icon: <Rocket size={size} /> },
  ];

  const render = (item: DockItem) => (
    <li key={item.key}>
      <a
        className="dock__item"
        href={item.href}
        aria-current={current === item.key ? "page" : undefined}
        aria-label={item.badge ? `${item.label}, ${item.badge} pendientes` : item.label}
        title={item.label}
      >
        <span aria-hidden="true">{item.icon}</span>
        <span className="dock__label" aria-hidden="true">
          {item.label}
        </span>
        {item.badge ? (
          <span className="badge" key={item.badge} aria-hidden="true">
            {item.badge}
          </span>
        ) : null}
      </a>
    </li>
  );

  return (
    <nav className="dock" aria-label="Navegación principal">
      <ul className="dock__list" style={{ listStyle: "none", margin: 0, padding: 0 }}>
        {work.map(render)}
        <li className="dock__sep" role="separator" aria-hidden="true" />
        {supervise.map(render)}
      </ul>
    </nav>
  );
}
