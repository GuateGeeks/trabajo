/** Contrato de datos del HQ. Hoy lo llena `mock.ts`; mañana lo llenarán scripts locales. */

/** Id = nombre de la carpeta en `vault/proyectos/`. Los proyectos se descubren, no están fijos. */
export type ProjectId = string;
export type AccentName = "plum" | "sky" | "coral" | "teal";
export type ArtKind = "mesa" | "arcos" | "codigo" | "cubos" | "volcanes";

/** Quién dijo/hizo esto: preserva la separación humano / máquina del sistema de referencia. */
export type Origin = "humano" | "maquina";

export interface Metric {
  label: string;
  value: string | number;
}

export interface Note {
  id: string;
  title: string;
  excerpt: string;
  updatedAt: string;
}

export type JobStatus = "ok" | "warn" | "error" | "idle";

export interface Job {
  id: string;
  name: string;
  schedule: string;
  lastRun: string;
  status: JobStatus;
}

export interface RepoCommit {
  hash: string;
  at: string;
  author: string;
  message: string;
}

/** Estado de un repositorio git, SOLO para visualizar (lo deja `scripts/sync.mjs`). */
export interface RepoStatus {
  name: string;
  branch: string;
  dirty: number;
  ahead: number;
  behind: number;
  commits24h: number;
  syncedAt: string;
  status: JobStatus;
  notes: string[];
  recent: RepoCommit[];
}

export interface Project {
  id: ProjectId;
  name: string;
  tagline: string;
  accent: AccentName;
  art: ArtKind;
  metrics: [Metric, Metric, Metric];
  humano: Note[];
  maquina: Job[];
  /** Repositorios conectados (solo lectura). Opcional: los datos de ejemplo no los tienen. */
  repos?: RepoStatus[];
}

export type Audience = "docente" | "estudiante";

export interface Task {
  id: string;
  projectId: ProjectId;
  title: string;
  due: string | null;
  done: boolean;
  origin: Origin;
  /** Si viene de `vault/mejoras/`, su identificador y estado (se marcan a mano en la bóveda). */
  improvement?: { code: string | null; stage: ImprovementStage };
  /** Para quién es: la experiencia del docente o la del estudiante (solo mejoras). */
  audience?: Audience | null;
}

export type Risk = "bajo" | "medio" | "alto";

export interface DiffLine {
  kind: "add" | "del" | "ctx";
  text: string;
}

export interface Proposal {
  id: string;
  projectId: ProjectId;
  title: string;
  summary: string;
  agent: string;
  createdAt: string;
  risk: Risk;
  diff: DiffLine[];
}

export interface LogEntry {
  id: string;
  projectId: ProjectId;
  at: string;
  actor: "ia" | "humano";
  action: string;
  detail?: string;
}

export interface Lesson {
  id: string;
  projectId: ProjectId;
  text: string;
  origin: Origin;
  at: string;
}

/**
 * Ciclo de una mejora, marcado A MANO en la bóveda (el panel solo lo muestra):
 * por hacer → en curso → trabajado (hay trabajo, falta aprobación) → aprobado (el equipo confirmó que
 * se cumplió lo pedido; ya se puede hacer commit) → hecha (commit hecho).
 */
export type ImprovementStage = "por-hacer" | "en-curso" | "trabajado" | "aprobado" | "hecha";

/** Una mejora futura anotada en `vault/mejoras/`. */
export interface Improvement {
  id: string;
  text: string;
  done: boolean;
  projectId: ProjectId | null;
  /** Etiqueta `#docente` o `#estudiante` de la línea. */
  audience: Audience | null;
  date: string | null;
  by: string;
  /** Identificador, por ejemplo `S-04`. */
  code: string | null;
  stage: ImprovementStage;
  /** Quién y cuándo la trabajó, tal como se escribió. */
  worked: string | null;
  /** Quién del equipo aprobó que se cumplió lo pedido, y cuándo. */
  approved: string | null;
  branch: string | null;
  commit: string | null;
  /** Incoherencia en los campos (por ejemplo, commit sin aprobación). */
  warning: string | null;
  /** Encabezado `##` bajo el que está anotada. */
  section: string;
  /** Sub-puntos indentados bajo la mejora. */
  details: string[];
}

export interface Workspace {
  projects: Project[];
  tasks: Task[];
  proposals: Proposal[];
  log: LogEntry[];
  lessons: Lesson[];
  improvements?: Improvement[];
  /** Cuándo se leyó la bóveda. En la copia compartida es la fecha de publicación. */
  generatedAt?: string;
}

export type Outcome = "approved" | "rejected";

/** Lo que decide la persona. Se guarda aparte de los datos base para no mezclar autorías. */
export interface UserOverlay {
  doneTasks: Record<string, boolean>;
  decisions: Record<string, { outcome: Outcome; at: string }>;
  lessons: Lesson[];
}
