import { Plus } from "lucide-react";
import { useState, type FormEvent } from "react";
import { Banner } from "../components/Banner";
import { OriginChip, projectById, ProjectChip } from "../components/Chips";
import { EmptyState } from "../components/States";
import { relativeTime } from "../data/format";
import { useWorkspace } from "../data/store";
import type { ProjectId } from "../data/types";

export function LearnedView() {
  const { workspace, lessons, addLesson } = useWorkspace();
  const [projectId, setProjectId] = useState<ProjectId>("");
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  if (!workspace) return null;
  const selected = projectId || workspace.projects[0]?.id || "";

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const clean = text.trim();
    if (clean.length < 8) {
      setError("Cuéntalo con un poco más de detalle (al menos 8 caracteres).");
      return;
    }
    addLesson(selected, clean);
    setText("");
    setError("");
  };

  return (
    <div className="view">
      <Banner title="Aprendido" subtitle="Lo que ya sabemos, para no tener que descubrirlo dos veces." art="volcanes" accent="coral" />

      <section className="section" aria-labelledby="h-nueva">
        <h2 id="h-nueva">Anota una lección</h2>
        <form className="card lesson-form" onSubmit={onSubmit} noValidate>
          <div className="lesson-form__row">
            <label>
              Proyecto
              <select value={selected} onChange={(e) => setProjectId(e.target.value as ProjectId)}>
                {workspace.projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Qué aprendimos
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                aria-invalid={error ? true : undefined}
                aria-describedby={error ? "lesson-error" : undefined}
                placeholder="Por ejemplo: medir primero en un equipo lento…"
              />
            </label>
          </div>
          {error && (
            <p id="lesson-error" role="alert" style={{ color: "var(--danger)", fontSize: "0.875rem" }}>
              {error}
            </p>
          )}
          <div>
            <button className="btn btn--primary" type="submit">
              <Plus size={16} aria-hidden="true" /> Guardar lección
            </button>
          </div>
          <p className="notice">Se guarda como «Humano»: queda separada de lo que resuma la IA.</p>
        </form>
      </section>

      <section className="section" aria-labelledby="h-lecciones">
        <h2 id="h-lecciones">Lecciones ({lessons.length})</h2>
        {lessons.length === 0 ? (
          <EmptyState title="Aún no hay lecciones">Anota la primera arriba.</EmptyState>
        ) : (
          <ul className="task-list">
            {lessons.map((l) => (
              <li className="card lesson" key={l.id}>
                <p>{l.text}</p>
                <div className="proposal__top">
                  <ProjectChip project={projectById(workspace.projects, l.projectId)} />
                  <OriginChip origin={l.origin} />
                  <span className="notice">{relativeTime(l.at)}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
