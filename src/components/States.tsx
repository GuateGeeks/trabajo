import { AlertTriangle, RefreshCw } from "lucide-react";
import type { ReactNode } from "react";

export function LoadingView() {
  return (
    <div className="view" role="status" aria-live="polite" aria-busy="true">
      <span className="visually-hidden">Cargando el espacio de trabajo…</span>
      <div className="skeleton skeleton--banner" />
      <div className="grid-cards">
        {[0, 1, 2, 3].map((i) => (
          <div className="skeleton skeleton--card" key={i} />
        ))}
      </div>
    </div>
  );
}

export function ErrorView({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="view">
      <div className="state state--error" role="alert">
        <AlertTriangle size={32} aria-hidden="true" />
        <h2>No pudimos cargar el HQ</h2>
        <p>{message}</p>
        <button className="btn btn--primary" type="button" onClick={onRetry}>
          <RefreshCw size={16} aria-hidden="true" /> Reintentar
        </button>
      </div>
    </div>
  );
}

export function EmptyState({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div className="state">
      <h2>{title}</h2>
      {children && <p>{children}</p>}
    </div>
  );
}
