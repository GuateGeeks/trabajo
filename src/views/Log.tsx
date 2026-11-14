import { Bot, User } from "lucide-react";
import { useState } from "react";
import { Banner } from "../components/Banner";
import { projectById, ProjectChip } from "../components/Chips";
import { EmptyState } from "../components/States";
import { dayLabel, timeOfDay } from "../data/format";
import { useWorkspace } from "../data/store";
import type { LogEntry, ProjectId } from "../data/types";

export function LogView() {
  const { workspace, log } = useWorkspace();
  const [filter, setFilter] = useState<ProjectId | "todos">("todos");
  if (!workspace) return null;

  const entries = log.filter((e) => filter === "todos" || e.projectId === filter);
  const groups = new Map<string, LogEntry[]>();
  for (const e of entries) {
    const key = dayLabel(e.at);
    groups.set(key, [...(groups.get(key) ?? []), e]);
  }

  return (
    <div className="view">
      <Banner title="Bitácora" subtitle="Todo lo que hizo la IA y todo lo que decidiste, en orden." art="codigo" accent="sky" />

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

      {entries.length === 0 ? (
        <EmptyState title="Sin movimientos">Todavía no hay actividad para este proyecto.</EmptyState>
      ) : (
        <div className="timeline">
          {[...groups.entries()].map(([day, items]) => (
            <section className="timeline__day" key={day} aria-label={day}>
              <h3>{day}</h3>
              <ol className="task-list">
                {items.map((e) => (
                  <li className="entry" key={e.id}>
                    <span className="entry__time">{timeOfDay(e.at)}</span>
                    <div>
                      <p className="entry__action">{e.action}</p>
                      {e.detail && <p className="entry__detail sensitive">{e.detail}</p>}
                      <div className="entry__tags">
                        <ProjectChip project={projectById(workspace.projects, e.projectId)} />
                        <span className={`chip ${e.actor === "ia" ? "chip--machine" : "chip--human"}`}>
                          {e.actor === "ia" ? <Bot size={13} aria-hidden="true" /> : <User size={13} aria-hidden="true" />}
                          {e.actor === "ia" ? "IA" : "Humano"}
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ol>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
