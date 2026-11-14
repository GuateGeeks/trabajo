import fs from "node:fs";
import path from "node:path";
import type {
  AccentName,
  ArtKind,
  DiffLine,
  Improvement,
  ImprovementStage,
  Job,
  JobStatus,
  Lesson,
  LogEntry,
  Note,
  Origin,
  Project,
  ProjectId,
  Proposal,
  RepoCommit,
  RepoStatus,
  Risk,
  Task,
  Workspace,
} from "../src/data/types";

/**
 * Lector de la bóveda de Obsidian. Solo LEE: nunca escribe ni modifica notas.
 * Formato documentado en `vault/LEEME.md`.
 */

const ACCENTS: AccentName[] = ["plum", "sky", "coral", "teal"];
const ARTS: ArtKind[] = ["mesa", "arcos", "codigo", "cubos", "volcanes"];
const STATUSES: JobStatus[] = ["ok", "warn", "error", "idle"];
const RISKS: Risk[] = ["bajo", "medio", "alto"];

export interface VaultResult {
  workspace: Workspace;
  /** Archivos omitidos por tener un formato que no se entiende. */
  warnings: string[];
}

/* ───────── Utilidades ───────── */

function parseNote(raw: string): { meta: Record<string, string>; body: string } {
  const text = raw.replace(/^﻿/, "").replace(/\r\n/g, "\n");
  const match = text.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!match) return { meta: {}, body: text };
  const meta: Record<string, string> = {};
  for (const line of match[1].split("\n")) {
    const kv = line.match(/^([\p{L}_][\p{L}\p{N}_-]*):\s*(.*)$/u);
    if (kv) meta[kv[1]] = kv[2].trim().replace(/^["']|["']$/g, "");
  }
  return { meta, body: match[2] };
}

function listMarkdown(dir: string): string[] {
  try {
    return fs
      .readdirSync(dir, { withFileTypes: true })
      .filter((e) => e.isFile() && e.name.endsWith(".md") && !e.name.startsWith("."))
      .map((e) => path.join(dir, e.name))
      .sort();
  } catch {
    return [];
  }
}

const readText = (file: string) => fs.readFileSync(file, "utf8");
const baseName = (file: string) => path.basename(file, ".md");
const pick = <T extends string>(value: string | undefined, allowed: readonly T[], fallback: T): T =>
  allowed.includes(value as T) ? (value as T) : fallback;

function toIso(value: string | undefined): string | null {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

function firstParagraph(body: string): string {
  const paragraph = body
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .find((p) => p && !p.startsWith("#") && !p.startsWith("```"));
  const clean = (paragraph ?? "").replace(/\s+/g, " ");
  return clean.length > 180 ? `${clean.slice(0, 177)}…` : clean;
}

function slug(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);
}


/* ───────── Lectores por tipo ───────── */

function readTasks(file: string, projectId: ProjectId): Task[] {
  let text: string;
  try {
    text = readText(file);
  } catch {
    return [];
  }
  const tasks: Task[] = [];
  for (const line of text.split(/\r?\n/)) {
    const m = line.match(/^\s*[-*]\s+\[( |x|X)\]\s+(.+)$/);
    if (!m) continue;
    let title = m[2];
    const due = title.match(/📅\s*(\d{4}-\d{2}-\d{2})/);
    const origin: Origin = /#maquina\b/.test(title) ? "maquina" : "humano";
    title = title.replace(/📅\s*\d{4}-\d{2}-\d{2}/g, "").replace(/#(maquina|humano)\b/g, "").replace(/\s+/g, " ").trim();
    tasks.push({
      id: `${projectId}:${slug(title)}`,
      projectId,
      title,
      due: due ? toIso(`${due[1]}T23:59:00`) : null,
      done: m[1].toLowerCase() === "x",
      origin,
    });
  }
  return tasks;
}

function readProject(root: string, id: ProjectId, index: number, tasks: Task[], pendingCount: number, notes: Note[], jobs: Job[], repos: RepoStatus[]): Project | null {
  const file = path.join(root, "proyectos", id, "proyecto.md");
  if (!fs.existsSync(file)) return null;
  const { meta } = parseNote(readText(file));
  const open = tasks.filter((t) => !t.done).length;
  return {
    id,
    name: meta.nombre || id,
    tagline: meta.lema || "",
    accent: pick(meta.acento, ACCENTS, ACCENTS[index % ACCENTS.length]),
    art: pick(meta.arte, ARTS, "mesa"),
    metrics: [
      { label: "Tareas abiertas", value: open },
      { label: "Por decidir", value: pendingCount },
      repos.length > 0
        ? { label: "Commits en 24 h", value: repos.reduce((sum, r) => sum + r.commits24h, 0) }
        : { label: "Notas tuyas", value: notes.length },
    ],
    humano: notes,
    maquina: jobs,
    repos,
  };
}

function readDiff(body: string): DiffLine[] {
  const block = body.match(/```diff\n([\s\S]*?)\n```/);
  if (!block) return [];
  return block[1].split("\n").map((line): DiffLine => {
    if (line.startsWith("+")) return { kind: "add", text: line.slice(1) };
    if (line.startsWith("-")) return { kind: "del", text: line.slice(1) };
    return { kind: "ctx", text: line.startsWith(" ") ? line.slice(1) : line };
  });
}

function readRepo(file: string, meta: Record<string, string>, body: string): RepoStatus {
  const num = (v: string | undefined) => Number.parseInt(v ?? "0", 10) || 0;
  const recent: RepoCommit[] = [];
  const notes: string[] = [];
  for (const line of body.split("\n")) {
    const note = line.match(/^- ⚠ (.+)$/);
    if (note) notes.push(note[1]);
    const c = line.match(/^- `([0-9a-f]+)` \| (\d{4}-\d{2}-\d{2} \d{2}:\d{2}) \| (.+?) \| (.*)$/);
    if (c) recent.push({ hash: c[1], at: toIso(c[2].replace(" ", "T")) ?? "", author: c[3], message: c[4] });
  }
  return {
    name: meta.repo || baseName(file).replace(/^Repo /, ""),
    branch: meta.rama || "?",
    dirty: num(meta.sin_guardar),
    ahead: num(meta.adelante),
    behind: num(meta.atras),
    commits24h: num(meta.commits_24h),
    syncedAt: toIso(meta.ultima_ejecucion) ?? fs.statSync(file).mtime.toISOString(),
    status: pick(meta.estado, STATUSES, "idle"),
    notes,
    recent,
  };
}

/* ───────── Lectura completa ───────── */

export function readVault(root: string): VaultResult {
  const warnings: string[] = [];
  const rel = (file: string) => path.relative(root, file);

  if (!fs.existsSync(path.join(root, "proyectos"))) {
    throw new Error(`La bóveda no tiene la carpeta «proyectos»: ${root}`);
  }

  const orderOf = (id: string) => {
    try {
      const n = Number.parseInt(parseNote(readText(path.join(root, "proyectos", id, "proyecto.md"))).meta.orden ?? "", 10);
      return Number.isNaN(n) ? 999 : n;
    } catch {
      return 999;
    }
  };

  // Los proyectos se descubren: cada carpeta de `proyectos/` es uno.
  const projectIds = fs
    .readdirSync(path.join(root, "proyectos"), { withFileTypes: true })
    .filter((e) => e.isDirectory() && !e.name.startsWith("."))
    .map((e) => e.name)
    .sort((x, y) => orderOf(x) - orderOf(y) || x.localeCompare(y));
  const isProjectId = (value: string | undefined): value is ProjectId => !!value && projectIds.includes(value);

  // Propuestas
  const proposals: Proposal[] = [];
  for (const file of listMarkdown(path.join(root, "propuestas"))) {
    try {
      const { meta, body } = parseNote(readText(file));
      if (!isProjectId(meta.proyecto)) {
        warnings.push(`${rel(file)}: falta la propiedad «proyecto» (o no es una de: ${projectIds.join(", ")}).`);
        continue;
      }
      proposals.push({
        id: `prop:${slug(baseName(file))}`,
        projectId: meta.proyecto as ProjectId,
        title: baseName(file),
        summary: firstParagraph(body),
        agent: meta.agente || "IA",
        createdAt: toIso(meta.creada) ?? fs.statSync(file).mtime.toISOString(),
        risk: pick(meta.riesgo, RISKS, "medio"),
        diff: readDiff(body),
      });
    } catch (e) {
      warnings.push(`${rel(file)}: ${(e as Error).message}`);
    }
  }
  proposals.sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  // Proyectos
  const projects: Project[] = [];
  const tasks: Task[] = [];
  for (const [index, id] of projectIds.entries()) {
    const dir = path.join(root, "proyectos", id);
    const projectTasks = readTasks(path.join(dir, "tareas.md"), id);
    tasks.push(...projectTasks);

    const notes: Note[] = listMarkdown(path.join(dir, "humano")).map((file) => {
      const { body } = parseNote(readText(file));
      return { id: `nota:${id}:${slug(baseName(file))}`, title: baseName(file), excerpt: firstParagraph(body), updatedAt: fs.statSync(file).mtime.toISOString() };
    });

    const jobs: Job[] = [];
    const repos: RepoStatus[] = [];
    for (const file of listMarkdown(path.join(dir, "maquina"))) {
      const { meta, body } = parseNote(readText(file));
      if (meta.tipo === "repositorio") {
        repos.push(readRepo(file, meta, body));
        continue;
      }
      jobs.push({
        id: `job:${id}:${slug(baseName(file))}`,
        name: baseName(file),
        schedule: meta.horario || "sin horario",
        lastRun: toIso(meta.ultima_ejecucion) ?? fs.statSync(file).mtime.toISOString(),
        status: pick(meta.estado, STATUSES, "idle"),
      });
    }

    const pendingCount = proposals.filter((p) => p.projectId === id).length;
    const project = readProject(root, id, index, projectTasks, pendingCount, notes, jobs, repos);
    if (project) projects.push(project);
    else warnings.push(`proyectos/${id}: falta proyecto.md.`);
  }

  // Bitácora: una línea por acción.
  const log: LogEntry[] = [];
  for (const file of listMarkdown(path.join(root, "bitacora"))) {
    const day = baseName(file);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(day)) {
      warnings.push(`${rel(file)}: el nombre debe ser AAAA-MM-DD.`);
      continue;
    }
    readText(file)
      .split(/\r?\n/)
      .forEach((line, index) => {
        const m = line.match(/^\s*-\s+(\d{2}:\d{2})\s*\|\s*(ia|humano)\s*\|\s*([\w-]+)\s*\|\s*([^|]+?)\s*(?:\|\s*(.+?))?\s*$/);
        if (!m) {
          if (line.trim()) warnings.push(`${rel(file)}:${index + 1}: línea de bitácora con formato inválido.`);
          return;
        }
        if (!isProjectId(m[3])) {
          warnings.push(`${rel(file)}:${index + 1}: proyecto desconocido «${m[3]}».`);
          return;
        }
        const at = toIso(`${day}T${m[1]}:00`);
        if (!at) return;
        log.push({ id: `log:${day}:${index}`, projectId: m[3], at, actor: m[2] as "ia" | "humano", action: m[4], detail: m[5] });
      });
  }
  log.sort((a, b) => b.at.localeCompare(a.at));

  // Lecciones
  const lessons: Lesson[] = [];
  const lessonsFile = path.join(root, "aprendido", "lecciones.md");
  if (fs.existsSync(lessonsFile)) {
    readText(lessonsFile)
      .split(/\r?\n/)
      .forEach((line, index) => {
        const m = line.match(/^\s*-\s+(\d{4}-\d{2}-\d{2})\s*\|\s*([\w-]+)\s*\|\s*(humano|maquina)\s*\|\s*(.+?)\s*$/);
        if (!m) {
          if (line.trim()) warnings.push(`aprendido/lecciones.md:${index + 1}: formato inválido.`);
          return;
        }
        if (!isProjectId(m[2])) {
          warnings.push(`aprendido/lecciones.md:${index + 1}: proyecto desconocido «${m[2]}».`);
          return;
        }
        lessons.push({ id: `les:${index}`, projectId: m[2], text: m[4], origin: m[3] as Origin, at: toIso(`${m[1]}T12:00:00`) ?? new Date().toISOString() });
      });
    lessons.sort((a, b) => b.at.localeCompare(a.at));
  }

  // Mejoras futuras: `- [ ] texto #proyecto · AAAA-MM-DD · quién`, con sub-puntos indentados opcionales
  // y secciones `##`.
  const improvements: Improvement[] = [];
  const fields = new Map<string, Record<string, string>>();
  for (const file of listMarkdown(path.join(root, "mejoras"))) {
    let section = "General";
    let last: Improvement | null = null;
    readText(file)
      .split(/\r?\n/)
      .forEach((line, index) => {
        const heading = line.match(/^##\s+(.+?)\s*$/);
        if (heading) {
          section = heading[1];
          last = null;
          return;
        }
        const meta = line.match(/^\s{2,}[-*]\s+(estado|trabajado|aprobado|rama|commit):\s*(.*)$/i);
        if (meta && last) {
          const value = meta[2].trim();
          const key = meta[1].toLowerCase();
          if (value) fields.set(last.id, { ...(fields.get(last.id) ?? {}), [key]: value });
          return;
        }
        const sub = line.match(/^\s{2,}[-*]\s+(.+)$/);
        if (sub && last) {
          last.details.push(sub[1].trim());
          return;
        }
        const m = line.match(/^[-*]\s+\[( |x|X)\]\s+(.+)$/);
        if (!m) return;
        const parts = m[2].split(" · ").map((x) => x.trim());
        const by = parts.length >= 3 ? parts[parts.length - 1] : "Equipo";
        const date = parts.length >= 3 && /^\d{4}-\d{2}-\d{2}$/.test(parts[parts.length - 2]) ? parts[parts.length - 2] : null;
        let body = parts.length >= 3 ? parts.slice(0, -2).join(" · ") : m[2];
        const code = body.match(/^\*\*([A-Z]+-\d+)\*\*\s+/)?.[1] ?? null;
        if (code) body = body.replace(/^\*\*[A-Z]+-\d+\*\*\s+/, "");
        const tag = body.match(/#([\w-]+)/)?.[1];
        last = {
          id: `mej:${slug(baseName(file))}:${index}`,
          text: body.replace(/\s*#[\w-]+/g, "").trim(),
          done: m[1].toLowerCase() === "x",
          projectId: tag && isProjectId(tag) ? tag : null,
          date,
          by,
          code,
          stage: "por-hacer",
          worked: null,
          approved: null,
          branch: null,
          commit: null,
          warning: null,
          section,
          details: [],
        };
        improvements.push(last);
      });
  }

  for (const item of improvements) {
    const f = fields.get(item.id) ?? {};
    item.worked = f.trabajado ?? null;
    item.approved = f.aprobado ?? null;
    item.branch = f.rama ?? null;
    item.commit = f.commit ?? null;
    let stage: ImprovementStage = "por-hacer";
    if (/^en[ -]curso$/i.test(f.estado ?? "")) stage = "en-curso";
    if (item.worked) stage = "trabajado";
    if (item.approved) stage = "aprobado";
    if (item.commit || item.done) stage = "hecha";
    item.stage = stage;
    if (item.approved && !item.worked) item.warning = "Aprobada sin marcarla como trabajada.";
    else if ((item.commit || item.done) && !item.approved) item.warning = "Marcada como hecha sin la aprobación del equipo.";
    if (item.warning) warnings.push(`mejoras: ${item.code ?? item.text.slice(0, 40)}: ${item.warning}`);
  }

  // Cada mejora con proyecto también es una tarea, para verla junto al resto del trabajo.
  for (const item of improvements) {
    if (!item.projectId) continue;
    tasks.push({
      id: `tarea-${item.id}`,
      projectId: item.projectId,
      title: item.code ? `${item.code} · ${item.text}` : item.text,
      due: null,
      done: item.stage === "hecha",
      origin: "humano",
      improvement: { code: item.code, stage: item.stage },
    });
  }

  return { workspace: { projects, tasks, proposals, log, lessons, improvements }, warnings };
}
