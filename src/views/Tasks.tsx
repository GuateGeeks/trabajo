import { useState } from "react";
import { Banner } from "../components/Banner";
import { OriginChip, projectById, ProjectChip } from "../components/Chips";
import { EmptyState } from "../components/States";
import { StageChip } from "../components/StageChip";
import { relativeTime } from "../data/format";
import { useWorkspace } from "../data/store";
import type { ProjectId } from "../data/types";

export function TasksView() {
  const { workspace, tasks, toggleTask } = useWorkspace();
  const [filter, setFilter] = useState<ProjectId | "todos">("todos");
  const [kind, setKind] = useState<"todas" | "tareas" | "mejoras">("todas");
  if (!workspace) return null;

  const visible = tasks
    .filter((t) => filter === "todos" || t.projectId === filter)
    .filter((t) => kind === "todas" || (kind === "mejoras") === !!t.improvement);
  const open = visible.filter((t) => !t.done);
  const done = visible.filter((t) => t.done);

  const renderTask = (t: (typeof tasks)[number]) => (
    <li className={`task ${t.done ? "task--done" : ""}`} key={t.id}>
      {t.improvement ? (
        <span className="task__static" aria-hidden="true" />
      ) : (
        <input id={`t-${t.id}`} type="checkbox" checked={t.done} onChange={(e) => toggleTask(t.id, e.target.checked)} />
      )}
      <label className="task__label" htmlFor={t.improvement ? undefined : `t-${t.id}`}>
        <span className="task__title">{t.title}</span>
        <span className="task__meta">
          {t.improvement ? (
            <a href="#/mejoras">Mejora · se marca en la bóveda</a>
          ) : t.due ? (
            `Vence ${relativeTime(t.due)}`
          ) : (
            "Sin fecha"
          )}
        </span>
      </label>
      <span style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "flex-end" }}>
        {t.improvement && <StageChip stage={t.improvement.stage} />}
        <ProjectChip project={projectById(workspace.projects, t.projectId)} />
        {!t.improvement && <OriginChip origin={t.origin} />}
      </span>
    </li>
  );

  return (
    <div className="view">
      <Banner title="Tareas" subtitle="Todo lo que sigue, de todos los proyectos." art="mesa" accent="brand" />

      <div className="filter-row" role="group" aria-label="Filtrar por tipo">
        {(["todas", "tareas", "mejoras"] as const).map((k) => (
          <button key={k} type="button" aria-pressed={kind === k} onClick={() => setKind(k)}>
            {k === "todas" ? "Tareas y mejoras" : k === "tareas" ? "Solo tareas" : "Solo mejoras"}
          </button>
        ))}
      </div>

      <div className="filter-row" role="group" aria-label="Filtrar por proyecto">
        <button type="button" aria-pressed={filter === "todos"} onClick={() => setFilter("todos")}>
          Todos
        </button>
        {workspace.projects.map((p) => (
          <button key={p.id} type="button" aria-pressed={filter === p.id} onClick={() => setFilter(p.id)}>
            {p.name}
          </button>
        ))}
      </div>

      <section className="section" aria-labelledby="h-abiertas">
        <h2 id="h-abiertas">Abiertas ({open.length})</h2>
        {open.length === 0 ? (
          <EmptyState title="Todo al día">No hay tareas abiertas con este filtro.</EmptyState>
        ) : (
          <ul className="task-list">{open.map(renderTask)}</ul>
        )}
      </section>

      {done.length > 0 && (
        <section className="section" aria-labelledby="h-hechas">
          <h2 id="h-hechas">Hechas ({done.length})</h2>
          <ul className="task-list">{done.map(renderTask)}</ul>
        </section>
      )}
    </div>
  );
}
