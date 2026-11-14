import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useState, type ReactNode } from "react";
import { fetchWorkspace } from "./api";
import type { LogEntry, Lesson, Outcome, Proposal, ProjectId, Task, UserOverlay, Workspace } from "./types";

/* ───────── Estado de las decisiones de la persona (separado de los datos base) ───────── */

const STORAGE_KEY = "gg-hq:v1";
const EMPTY: UserOverlay = { doneTasks: {}, decisions: {}, lessons: [] };

function loadOverlay(): UserOverlay {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? { ...EMPTY, ...JSON.parse(raw) } : EMPTY;
  } catch {
    return EMPTY;
  }
}

type Action =
  | { type: "toggleTask"; id: string; done: boolean }
  | { type: "decide"; id: string; outcome: Outcome }
  | { type: "undo"; id: string }
  | { type: "addLesson"; lesson: Lesson };

function reducer(state: UserOverlay, action: Action): UserOverlay {
  switch (action.type) {
    case "toggleTask":
      return { ...state, doneTasks: { ...state.doneTasks, [action.id]: action.done } };
    case "decide":
      return { ...state, decisions: { ...state.decisions, [action.id]: { outcome: action.outcome, at: new Date().toISOString() } } };
    case "undo": {
      const { [action.id]: _removed, ...rest } = state.decisions;
      return { ...state, decisions: rest };
    }
    case "addLesson":
      return { ...state, lessons: [action.lesson, ...state.lessons] };
  }
}

/* ───────── Contexto ───────── */

type Status = "loading" | "error" | "ready";

export interface ResolvedProposal {
  proposal: Proposal;
  outcome: Outcome;
  at: string;
}

interface WorkspaceApi {
  status: Status;
  error: string | null;
  retry: () => void;
  workspace: Workspace | null;
  tasks: Task[];
  pending: Proposal[];
  resolved: ResolvedProposal[];
  log: LogEntry[];
  lessons: Lesson[];
  openTaskCount: number;
  toggleTask: (id: string, done: boolean) => void;
  decide: (id: string, outcome: Outcome) => void;
  undo: (id: string) => void;
  addLesson: (projectId: ProjectId, text: string) => void;
}

const Ctx = createContext<WorkspaceApi | null>(null);

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [status, setStatus] = useState<Status>("loading");
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);
  const [overlay, dispatch] = useReducer(reducer, undefined, loadOverlay);

  useEffect(() => {
    const controller = new AbortController();
    setStatus("loading");
    fetchWorkspace(controller.signal)
      .then((data) => {
        setWorkspace(data);
        setError(null);
        setStatus("ready");
      })
      .catch((err: unknown) => {
        if (err instanceof DOMException && err.name === "AbortError") return;
        setError(err instanceof Error ? err.message : "Error desconocido.");
        setStatus("error");
      });
    return () => controller.abort();
  }, [attempt]);

  // Al volver a la pestaña (por ejemplo desde Obsidian) se relee la bóveda sin mostrar la carga.
  useEffect(() => {
    if (status !== "ready") return;
    const refresh = () => {
      if (document.visibilityState !== "visible") return;
      fetchWorkspace(undefined, { silent: true })
        .then(setWorkspace)
        .catch(() => {
          /* Se conserva lo último que se leyó bien. */
        });
    };
    document.addEventListener("visibilitychange", refresh);
    window.addEventListener("focus", refresh);
    return () => {
      document.removeEventListener("visibilitychange", refresh);
      window.removeEventListener("focus", refresh);
    };
  }, [status]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(overlay));
    } catch {
      /* Sin almacenamiento: el panel sigue funcionando en memoria. */
    }
  }, [overlay]);

  const retry = useCallback(() => setAttempt((n) => n + 1), []);
  const toggleTask = useCallback((id: string, done: boolean) => dispatch({ type: "toggleTask", id, done }), []);
  const decide = useCallback((id: string, outcome: Outcome) => dispatch({ type: "decide", id, outcome }), []);
  const undo = useCallback((id: string) => dispatch({ type: "undo", id }), []);
  const addLesson = useCallback(
    (projectId: ProjectId, text: string) =>
      dispatch({
        type: "addLesson",
        lesson: { id: `u-${Date.now()}`, projectId, text, origin: "humano", at: new Date().toISOString() },
      }),
    [],
  );

  const value = useMemo<WorkspaceApi>(() => {
    // Las mejoras no se tachan desde el panel: su estado se marca a mano en la bóveda.
    const tasks = (workspace?.tasks ?? []).map((t) => (t.improvement ? t : { ...t, done: overlay.doneTasks[t.id] ?? t.done }));
    const all = workspace?.proposals ?? [];
    const pending = all.filter((p) => !overlay.decisions[p.id]);
    const resolved = all
      .filter((p) => overlay.decisions[p.id])
      .map((p) => ({ proposal: p, ...overlay.decisions[p.id] }))
      .sort((a, b) => b.at.localeCompare(a.at));

    // La bitácora combina lo que hizo la IA con lo que decidió la persona.
    const decisionLog: LogEntry[] = resolved.map(({ proposal, outcome, at }) => ({
      id: `d-${proposal.id}`,
      projectId: proposal.projectId,
      at,
      actor: "humano",
      action: `${outcome === "approved" ? "Aprobó" : "Rechazó"}: ${proposal.title}`,
    }));
    const log = [...(workspace?.log ?? []), ...decisionLog].sort((a, b) => b.at.localeCompare(a.at));
    const lessons = [...overlay.lessons, ...(workspace?.lessons ?? [])];

    return {
      status,
      error,
      retry,
      workspace,
      tasks,
      pending,
      resolved,
      log,
      lessons,
      openTaskCount: tasks.filter((t) => !t.done && !t.improvement).length,
      toggleTask,
      decide,
      undo,
      addLesson,
    };
  }, [workspace, overlay, status, error, retry, toggleTask, decide, undo, addLesson]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useWorkspace(): WorkspaceApi {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useWorkspace debe usarse dentro de <WorkspaceProvider>");
  return ctx;
}
