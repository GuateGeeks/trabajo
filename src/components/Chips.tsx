import { Bot, User } from "lucide-react";
import type { JobStatus, Origin, ProjectId, Risk } from "../data/types";
import type { Project } from "../data/types";

export function OriginChip({ origin }: { origin: Origin }) {
  return origin === "humano" ? (
    <span className="chip chip--human">
      <User size={13} aria-hidden="true" /> Humano
    </span>
  ) : (
    <span className="chip chip--machine">
      <Bot size={13} aria-hidden="true" /> Máquina
    </span>
  );
}

const RISK_CLASS: Record<Risk, string> = { bajo: "chip--ok", medio: "chip--warn", alto: "chip--danger" };

export function RiskChip({ risk }: { risk: Risk }) {
  return <span className={`chip ${RISK_CLASS[risk]}`}>Riesgo {risk}</span>;
}

const STATUS_LABEL: Record<JobStatus, string> = {
  ok: "Correcto",
  warn: "Con advertencias",
  error: "Con errores",
  idle: "En espera",
};

export function StatusDot({ status }: { status: JobStatus }) {
  return (
    <span className={`dot dot--${status}`} role="img" aria-label={STATUS_LABEL[status]} title={STATUS_LABEL[status]} />
  );
}

export function ProjectChip({ project }: { project: Pick<Project, "name" | "accent"> | undefined }) {
  if (!project) return null;
  return (
    <span className="chip chip--accent" data-accent={project.accent}>
      {project.name}
    </span>
  );
}

export function projectById(projects: Project[], id: ProjectId) {
  return projects.find((p) => p.id === id);
}
