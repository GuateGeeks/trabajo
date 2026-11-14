import { ArrowRight } from "lucide-react";
import type { Project } from "../data/types";
import { Illustration } from "./Illustration";

export function Metrics({ items }: { items: Project["metrics"] }) {
  return (
    <dl className="metrics">
      {items.map((m) => (
        <div className="metric" key={m.label}>
          <dd>{m.value}</dd>
          <dt>{m.label}</dt>
        </div>
      ))}
    </dl>
  );
}

/** Tarjeta de proyecto: portada, descripción de una línea, tres cifras y una sola acción. */
export function ProjectCard({ project }: { project: Project }) {
  return (
    <a className="card project-card" href={`#/p/${project.id}`} data-accent={project.accent} aria-label={`Entrar a ${project.name}`}>
      <div className="project-card__cover">
        <Illustration kind={project.art} />
        <span className="chip chip--accent">{project.name}</span>
      </div>
      <div className="project-card__body">
        <p className="project-card__tagline">{project.tagline}</p>
        <Metrics items={project.metrics} />
        <span className="project-card__enter">
          Entrar <ArrowRight size={16} aria-hidden="true" />
        </span>
      </div>
    </a>
  );
}
