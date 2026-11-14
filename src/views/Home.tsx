import { ArrowRight } from "lucide-react";
import { Banner } from "../components/Banner";
import { projectById, ProjectChip, RiskChip } from "../components/Chips";
import { ProjectCard } from "../components/ProjectCard";
import { greeting, pluralize, relativeTime } from "../data/format";
import { useWorkspace } from "../data/store";

/** Mesa de trabajo: estado de todos los proyectos sin abrir ninguno. */
export function Home() {
  const { workspace, pending, openTaskCount } = useWorkspace();
  if (!workspace) return null;

  return (
    <div className="view">
      <Banner
        title="Mesa de trabajo"
        subtitle={`${greeting()}. Esto es lo que pasa en tus proyectos ahora mismo.`}
        art="mesa"
        accent="brand"
      />

      <div className="summary-strip" aria-label="Resumen">
        <a href="#/decidir">
          <strong>{pending.length}</strong> {pending.length === 1 ? "propuesta por decidir" : "propuestas por decidir"}
        </a>
        <a href="#/mejoras">
          <strong>{(workspace.improvements ?? []).filter((i) => i.stage !== "hecha").length}</strong> mejoras abiertas ·{" "}
          <strong>{(workspace.improvements ?? []).filter((i) => i.stage === "aprobado").length}</strong> listas para commit
        </a>
        <a href="#/tareas">
          <strong>{openTaskCount}</strong> {openTaskCount === 1 ? "tarea abierta" : "tareas abiertas"}
        </a>
      </div>

      <section className="section" aria-labelledby="h-proyectos">
        <div className="section__head">
          <h2 id="h-proyectos">Proyectos</h2>
          <span className="section__hint">{new URLSearchParams(location.search).has("demo") ? "Datos de ejemplo" : (import.meta.env.PROD && workspace.generatedAt ? `Copia del ${new Date(workspace.generatedAt).toLocaleString("es-GT", { dateStyle: "medium", timeStyle: "short" })}` : `${workspace.projects.length} en la bóveda`)}</span>
        </div>
        <div className="grid-cards">
          {workspace.projects.map((p) => (
            <ProjectCard key={p.id} project={p} />
          ))}
        </div>
      </section>

      <section className="section" aria-labelledby="h-decidir">
        <div className="section__head">
          <h2 id="h-decidir">Esperan tu decisión</h2>
          <a href="#/decidir" className="btn btn--ghost">
            Ver todas <ArrowRight size={16} aria-hidden="true" />
          </a>
        </div>
        {pending.length === 0 ? (
          <p className="notice">No hay nada pendiente. {pluralize(workspace.proposals.length, "propuesta resuelta", "propuestas resueltas")}.</p>
        ) : (
          <ul className="task-list">
            {pending.slice(0, 3).map((p) => (
              <li key={p.id} className="card proposal">
                <div className="proposal__top">
                  <ProjectChip project={projectById(workspace.projects, p.projectId)} />
                  <RiskChip risk={p.risk} />
                  <span className="notice">{relativeTime(p.createdAt)}</span>
                </div>
                <h3>{p.title}</h3>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
