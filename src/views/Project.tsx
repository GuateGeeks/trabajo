import { Banner } from "../components/Banner";
import { OriginChip, StatusDot } from "../components/Chips";
import { Metrics } from "../components/ProjectCard";
import { EmptyState } from "../components/States";
import { StageChip } from "../components/StageChip";
import { relativeTime } from "../data/format";
import type { RepoStatus } from "../data/types";
import { useWorkspace } from "../data/store";
import type { ProjectId } from "../data/types";

function RepoCard({ repo }: { repo: RepoStatus }) {
  const label = repo.status === "error" ? "No se pudo consultar" : repo.status === "warn" ? "Hay cambios por traer" : "Al día";
  return (
    <article className="card repo">
      <div className="repo__top">
        <StatusDot status={repo.status} />
        <h3 className="repo__name">{repo.name}</h3>
        <span className="chip">{repo.branch}</span>
      </div>
      <p className="job__meta">
        {label} · revisado {relativeTime(repo.syncedAt)}
      </p>
      <dl className="repo__facts">
        <div>
          <dt>Commits en 24 h</dt>
          <dd>{repo.commits24h}</dd>
        </div>
        <div>
          <dt>Sin guardar</dt>
          <dd>{repo.dirty}</dd>
        </div>
        <div>
          <dt>Por traer</dt>
          <dd>{repo.behind}</dd>
        </div>
        <div>
          <dt>Por subir</dt>
          <dd>{repo.ahead}</dd>
        </div>
      </dl>
      {repo.notes.map((n) => (
        <p className="repo__note" key={n}>
          {n}
        </p>
      ))}
      {repo.recent.length > 0 && (
        <details className="repo__commits">
          <summary>Últimos {repo.recent.length} commits</summary>
          <ol className="repo__list">
            {repo.recent.map((c) => (
              <li key={`${c.hash}-${c.at}`}>
                <code>{c.hash}</code>
                <span className="repo__msg">{c.message}</span>
                <span className="note__meta">
                  {c.author} · {relativeTime(c.at)}
                </span>
              </li>
            ))}
          </ol>
        </details>
      )}
    </article>
  );
}

export function ProjectView({ id }: { id: ProjectId }) {
  const { workspace, tasks, pending, toggleTask } = useWorkspace();
  const project = workspace?.projects.find((p) => p.id === id);
  if (!project) return <EmptyState title="Proyecto no encontrado" />;

  const mine = tasks.filter((t) => t.projectId === id);
  const open = mine.filter((t) => !t.done);
  const toDecide = pending.filter((p) => p.projectId === id).length;

  return (
    <div className="view" data-accent={project.accent}>
      <Banner title={project.name} subtitle={project.tagline} art={project.art} accent={project.accent} />
      <Metrics items={project.metrics} />

      <div className="split">
        <section className="split__col split__col--human" aria-labelledby="h-humano">
          <div className="split__head">
            <h2 id="h-humano">Humano</h2>
            <code>humano/</code>
            <p className="split__caption">Lo que dijimos nosotros, tal cual. La IA lo lee, pero nunca lo reescribe.</p>
          </div>
          {project.humano.length === 0 && (
            <p className="notice">
              Aún no hay notas tuyas. Crea una en <code>proyectos/{project.id}/humano/</code> desde Obsidian.
            </p>
          )}
          {project.humano.map((n) => (
            <article className="card" key={n.id}>
              <h3 className="note__title">{n.title}</h3>
              <p className="note__excerpt sensitive">{n.excerpt}</p>
              <p className="note__meta">Actualizada {relativeTime(n.updatedAt)}</p>
            </article>
          ))}
        </section>

        <section className="split__col split__col--machine" aria-labelledby="h-maquina">
          <div className="split__head">
            <h2 id="h-maquina">Máquina</h2>
            <code>maquina/</code>
            <p className="split__caption">Scripts y agentes que trabajan por detrás. Solo miras si algo falla.</p>
          </div>
          {(project.repos ?? []).map((r) => (
            <RepoCard repo={r} key={r.name} />
          ))}
          {project.maquina.map((j) => (
            <article className="card job" key={j.id}>
              <StatusDot status={j.status} />
              <div>
                <p className="job__name">{j.name}</p>
                <p className="job__meta">
                  {j.schedule} · última vez {relativeTime(j.lastRun)}
                </p>
              </div>
            </article>
          ))}
        </section>
      </div>

      <section className="section" aria-labelledby="h-tareas">
        <div className="section__head">
          <h2 id="h-tareas">Tareas de {project.name}</h2>
          {toDecide > 0 && (
            <a className="btn btn--primary" href="#/decidir">
              {toDecide} por decidir
            </a>
          )}
        </div>
        {open.length === 0 ? (
          <EmptyState title="Todo al día">No quedan tareas abiertas en este proyecto.</EmptyState>
        ) : (
          <ul className="task-list">
            {open.map((t) => (
              <li className="task" key={t.id}>
                {t.improvement ? (
                  <span className="task__static" aria-hidden="true" />
                ) : (
                  <input id={`pt-${t.id}`} type="checkbox" checked={t.done} onChange={(e) => toggleTask(t.id, e.target.checked)} />
                )}
                <label className="task__label" htmlFor={t.improvement ? undefined : `pt-${t.id}`}>
                  <span className="task__title">{t.title}</span>
                  <span className="task__meta">{t.improvement ? <a href="#/mejoras">Mejora · se marca en la bóveda</a> : t.due ? `Vence ${relativeTime(t.due)}` : "Sin fecha"}</span>
                </label>
                {t.improvement ? <StageChip stage={t.improvement.stage} /> : <OriginChip origin={t.origin} />}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
