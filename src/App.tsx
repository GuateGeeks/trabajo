import { useEffect, useRef } from "react";
import { Dock } from "./components/Dock";
import { ErrorView, LoadingView } from "./components/States";
import { TopBar } from "./components/TopBar";
import { useWorkspace } from "./data/store";
import { usePreferences } from "./hooks/usePreferences";
import { routeKey, useRoute, type Route } from "./hooks/useRoute";
import { DecideView } from "./views/Decide";
import { Home } from "./views/Home";
import { LearnedView } from "./views/Learned";
import { ImprovementsView } from "./views/Improvements";
import { LogView } from "./views/Log";
import { ProjectView } from "./views/Project";
import { TasksView } from "./views/Tasks";

function crumbFor(route: Route, projectName?: string): string | undefined {
  switch (route.name) {
    case "inicio":
      return undefined;
    case "tareas":
      return "Tareas";
    case "decidir":
      return "Decidir";
    case "bitacora":
      return "Bitácora";
    case "aprendido":
      return "Aprendido";
    case "mejoras":
      return "Mejoras";
    case "proyecto":
      return projectName;
  }
}

export function App() {
  const route = useRoute();
  const prefs = usePreferences();
  const { status, error, retry, workspace, pending, openTaskCount } = useWorkspace();
  const mainRef = useRef<HTMLElement>(null);
  const key = routeKey(route);

  // Al cambiar de vista, el foco pasa al contenido para lectores de pantalla y teclado.
  useEffect(() => {
    if (status === "ready") mainRef.current?.focus({ preventScroll: true });
    window.scrollTo({ top: 0 });
    const name = workspace?.projects.find((p) => route.name === "proyecto" && p.id === route.id)?.name;
    document.title = `${crumbFor(route, name) ?? "Inicio"} · HQ GuateGeeks`;
  }, [key, status, route, workspace]);

  const projectName = route.name === "proyecto" ? workspace?.projects.find((p) => p.id === route.id)?.name : undefined;

  let content;
  if (status === "loading") content = <LoadingView />;
  else if (status === "error") content = <ErrorView message={error ?? "Error desconocido."} onRetry={retry} />;
  else {
    switch (route.name) {
      case "inicio":
        content = <Home />;
        break;
      case "tareas":
        content = <TasksView />;
        break;
      case "proyecto":
        content = <ProjectView id={route.id} />;
        break;
      case "decidir":
        content = <DecideView />;
        break;
      case "bitacora":
        content = <LogView />;
        break;
      case "aprendido":
        content = <LearnedView />;
        break;
      case "mejoras":
        content = <ImprovementsView />;
        break;
    }
  }

  return (
    <>
      <a className="skip-link" href="#main" onClick={(e) => { e.preventDefault(); mainRef.current?.focus(); }}>
        Saltar al contenido
      </a>
      <TopBar
        crumb={crumbFor(route, projectName)}
        theme={prefs.theme}
        onCycleTheme={prefs.cycleTheme}
        privacy={prefs.privacy}
        onTogglePrivacy={prefs.togglePrivacy}
      />
      <main id="main" ref={mainRef} tabIndex={-1} className="page" style={{ outline: "none" }}>
        <div key={key}>{content}</div>
      </main>
      <Dock route={route} openTasks={openTaskCount} pending={pending.length} />
    </>
  );
}
