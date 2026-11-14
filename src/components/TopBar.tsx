import { Eye, EyeOff, Monitor, Moon, Sun } from "lucide-react";
import { useClock } from "../hooks/useClock";
import type { ThemeChoice } from "../hooks/usePreferences";

interface TopBarProps {
  crumb?: string;
  theme: ThemeChoice;
  onCycleTheme: () => void;
  privacy: boolean;
  onTogglePrivacy: () => void;
}

const THEME_LABEL: Record<ThemeChoice, string> = {
  system: "Tema: según el sistema",
  light: "Tema: claro",
  dark: "Tema: oscuro",
};

export function TopBar({ crumb, theme, onCycleTheme, privacy, onTogglePrivacy }: TopBarProps) {
  const now = useClock();
  const time = now.toLocaleTimeString("es-GT", { hour: "2-digit", minute: "2-digit", hour12: false });
  const date = now.toLocaleDateString("es-GT", { weekday: "long", day: "numeric", month: "long" });
  const ThemeIcon = theme === "system" ? Monitor : theme === "light" ? Sun : Moon;

  return (
    <div className="topbar">
      <div className="topbar__inner">
        <nav className="crumbs" aria-label="Ruta">
          <a href="#/">HQ</a>
          {crumb && (
            <>
              <span className="crumbs__sep" aria-hidden="true">
                /
              </span>
              <span className="crumbs__current" aria-current="page">
                {crumb}
              </span>
            </>
          )}
        </nav>
        <div className="topbar__tools">
          <button
            className="btn btn--icon btn--ghost"
            type="button"
            aria-pressed={privacy}
            aria-label="Modo privado: difumina datos sensibles"
            title="Modo privado"
            onClick={onTogglePrivacy}
          >
            {privacy ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
          <button
            className="btn btn--icon btn--ghost"
            type="button"
            aria-label={`${THEME_LABEL[theme]}. Cambiar tema`}
            title={THEME_LABEL[theme]}
            onClick={onCycleTheme}
          >
            <ThemeIcon size={20} />
          </button>
          <div className="clock" aria-label={`${time}, ${date}`}>
            <span className="clock__time" aria-hidden="true">
              {time}
            </span>
            <span className="clock__date" aria-hidden="true">
              {date}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
