import { Check, ChevronDown, ChevronUp, Undo2, X } from "lucide-react";
import { useState } from "react";
import { Banner } from "../components/Banner";
import { projectById, ProjectChip, RiskChip } from "../components/Chips";
import { EmptyState } from "../components/States";
import { relativeTime } from "../data/format";
import { useWorkspace } from "../data/store";
import type { Proposal } from "../data/types";

function ProposalCard({ proposal }: { proposal: Proposal }) {
  const { workspace, decide } = useWorkspace();
  const [open, setOpen] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const project = projectById(workspace?.projects ?? [], proposal.projectId);

  // Espera a que termine la salida (240 ms) antes de quitar la tarjeta; sin animación decide al instante.
  const resolve = (outcome: "approved" | "rejected") => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const lite = document.documentElement.dataset.perf === "lite";
    if (reduced || lite) return decide(proposal.id, outcome);
    setLeaving(true);
    window.setTimeout(() => decide(proposal.id, outcome), 220);
  };

  return (
    <li className={`card proposal ${leaving ? "proposal-leave" : ""}`}>
      <div className="proposal__top">
        <ProjectChip project={project} />
        <RiskChip risk={proposal.risk} />
        <span className="notice">
          {proposal.agent} · {relativeTime(proposal.createdAt)}
        </span>
      </div>
      <h3>{proposal.title}</h3>
      <p className="proposal__summary">{proposal.summary}</p>

      <button
        type="button"
        className="btn btn--ghost"
        style={{ justifySelf: "start" }}
        aria-expanded={open}
        aria-controls={`diff-${proposal.id}`}
        onClick={() => setOpen((v) => !v)}
      >
        {open ? <ChevronUp size={16} aria-hidden="true" /> : <ChevronDown size={16} aria-hidden="true" />}
        {open ? "Ocultar cambios" : "Ver cambios"}
      </button>
      {open && (
        <pre className="diff" id={`diff-${proposal.id}`} aria-label="Cambios propuestos">
          {proposal.diff.map((line, i) => (
            <span key={i} className={line.kind === "ctx" ? "" : line.kind}>
              {line.kind === "add" ? "+ " : line.kind === "del" ? "- " : "  "}
              {line.text}
            </span>
          ))}
        </pre>
      )}

      <div className="proposal__actions">
        <button type="button" className="btn btn--primary" onClick={() => resolve("approved")}>
          <Check size={16} aria-hidden="true" /> Aprobar
        </button>
        <button type="button" className="btn" onClick={() => resolve("rejected")}>
          <X size={16} aria-hidden="true" /> Rechazar
        </button>
      </div>
    </li>
  );
}

export function DecideView() {
  const { workspace, pending, resolved, undo } = useWorkspace();
  const [announce, setAnnounce] = useState("");
  if (!workspace) return null;

  return (
    <div className="view">
      <Banner
        title="Decidir"
        subtitle="La IA propone, tú decides. Nada se aplica sin tu visto bueno."
        art="arcos"
        accent="plum"
      />

      <p className="visually-hidden" role="status" aria-live="polite">
        {announce}
      </p>

      <section className="section" aria-labelledby="h-pend">
        <h2 id="h-pend">Pendientes ({pending.length})</h2>
        {pending.length === 0 ? (
          <EmptyState title="Nada pendiente">La IA te avisará aquí cuando necesite una decisión.</EmptyState>
        ) : (
          <ul className="task-list">
            {pending.map((p) => (
              <ProposalCard key={p.id} proposal={p} />
            ))}
          </ul>
        )}
      </section>

      {resolved.length > 0 && (
        <section className="section" aria-labelledby="h-res">
          <h2 id="h-res">Resueltas ({resolved.length})</h2>
          <ul className="task-list">
            {resolved.map(({ proposal, outcome, at }) => (
              <li className="card resolved" key={proposal.id}>
                <div>
                  <p className="note__title">{proposal.title}</p>
                  <p className="notice">
                    {outcome === "approved" ? "Aprobada" : "Rechazada"} {relativeTime(at)}
                  </p>
                </div>
                <button
                  type="button"
                  className="btn"
                  onClick={() => {
                    undo(proposal.id);
                    setAnnounce(`Decisión deshecha: ${proposal.title}`);
                  }}
                >
                  <Undo2 size={16} aria-hidden="true" /> Deshacer
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
