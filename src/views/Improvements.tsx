import { useState } from "react";
import { Banner } from "../components/Banner";
import { projectById, ProjectChip } from "../components/Chips";
import { EmptyState } from "../components/States";
import { STAGES, stageOf } from "../components/StageChip";
import { useWorkspace } from "../data/store";
import type { Improvement, ImprovementStage, ProjectId } from "../data/types";

/**
 * Buzón de mejoras futuras, leído de `vault/mejoras/`. Solo lectura: el estado, el «trabajado»
 * y la aprobación del equipo se marcan A MANO en la bóveda (ver `vault/mejoras/LEEME.md`).
 */

export function ImprovementsView() {
  const { workspace } = useWorkspace();
  const [project, setProject] = useState<ProjectId | "todos">("todos");
  const [stage, setStage] = useState<ImprovementStage | "todas">("todas");
  if (!workspace) return null;

  const everything = workspace.improvements ?? [];
  const inProject = everything.filter((i) => project === "todos" || i.projectId === project);
  const shown = inProject.filter((i) => stage === "todas" || i.stage === stage);
  const withItems = workspace.projects.filter((p) => everything.some((i) => i.projectId === p.id));
  const count = (key: ImprovementStage) => inProject.filter((i) => i.stage === key).length;

  const bySection = new Map<string, Improvement[]>();
  for (const item of shown) bySection.set(item.section, [...(bySection.get(item.section) ?? []), item]);

  const row = (item: Improvement) => {
    const s = stageOf(item.stage);
    return (
      <li className={`card improvement ${item.stage === "hecha" ? "improvement--done" : ""}`} key={item.id}>
        <div className="improvement__top">
          {item.code && <code className="improvement__code">{item.code}</code>}
          <span className={`chip ${s.chip}`} title={s.hint}>
            {s.label}
          </span>
        </div>
        <p className="improvement__text">{item.text}</p>
        {item.details.length > 0 && (
          <ul className="improvement__details">
            {item.details.map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ul>
        )}
        {(item.worked || item.approved || item.branch || item.commit) && (
          <dl className="improvement__trail">
            {item.worked && (
              <div>
                <dt>Trabajado</dt>
                <dd>{item.worked}</dd>
              </div>
            )}
            {item.approved && (
              <div>
                <dt>Aprobado por</dt>
                <dd>{item.approved}</dd>
              </div>
            )}
            {item.branch && (
              <div>
                <dt>Rama</dt>
                <dd>
                  <code>{item.branch}</code>
                </dd>
              </div>
            )}
            {item.commit && (
              <div>
                <dt>Commit</dt>
                <dd>
                  <code>{item.commit}</code>
                </dd>
              </div>
            )}
          </dl>
        )}
        {item.warning && (
          <p className="repo__note" role="note">
            ⚠ {item.warning}
          </p>
        )}
        <div className="entry__tags">
          {item.projectId && <ProjectChip project={projectById(workspace.projects, item.projectId)} />}
          <span className="chip">{item.by}</span>
          {item.date && <span className="notice">{item.date}</span>}
        </div>
      </li>
    );
  };

  return (
    <div className="view">
      <Banner title="Mejoras" subtitle="Lo que buscamos mejorar, quién lo trabajó y si el equipo lo aprobó antes del commit." art="volcanes" accent="coral" />

      <div className="filter-row" role="group" aria-label="Filtrar por estado">
        <button type="button" aria-pressed={stage === "todas"} onClick={() => setStage("todas")}>
          Todas ({inProject.length})
        </button>
        {STAGES.map((s) => (
          <button key={s.key} type="button" aria-pressed={stage === s.key} title={s.hint} onClick={() => setStage(s.key)}>
            {s.label} ({count(s.key)})
          </button>
        ))}
      </div>

      {withItems.length > 0 && (
        <div className="filter-row" role="group" aria-label="Filtrar por proyecto">
          <button type="button" aria-pressed={project === "todos"} onClick={() => setProject("todos")}>
            Todos los proyectos
          </button>
          {withItems.map((p) => (
            <button key={p.id} type="button" aria-pressed={project === p.id} onClick={() => setProject(p.id)}>
              {p.name}
            </button>
          ))}
        </div>
      )}

      {shown.length === 0 ? (
        <EmptyState title="Nada en este filtro">Cambia el estado o el proyecto para ver otras mejoras.</EmptyState>
      ) : (
        [...bySection.entries()].map(([section, items]) => (
          <section className="section" key={section} aria-label={section}>
            <div className="section__head">
              <h2>
                {section} ({items.length})
              </h2>
            </div>
            <ul className="task-list">{items.map(row)}</ul>
          </section>
        ))
      )}
    </div>
  );
}
