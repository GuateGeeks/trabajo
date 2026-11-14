import { useRef, type PointerEvent } from "react";
import type { AccentName, ArtKind } from "../data/types";
import { Illustration } from "./Illustration";

interface BannerProps {
  title: string;
  subtitle?: string;
  art: ArtKind;
  accent: AccentName | "brand";
}

/** Cabecera ilustrada con paralaje suave. El paralaje solo mueve `transform` y se apaga en modo ligero. */
export function Banner({ title, subtitle, art, accent }: BannerProps) {
  const ref = useRef<HTMLElement>(null);
  const frame = useRef(0);

  const enabled = () =>
    document.documentElement.dataset.perf !== "lite" && !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const onMove = (e: PointerEvent<HTMLElement>) => {
    if (!enabled() || e.pointerType !== "mouse") return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = ((e.clientX - rect.left) / rect.width - 0.5) * -1;
    const py = ((e.clientY - rect.top) / rect.height - 0.5) * -1;
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      el.style.setProperty("--px", px.toFixed(3));
      el.style.setProperty("--py", (py * 0.5).toFixed(3));
    });
  };

  const onLeave = () => {
    const el = ref.current;
    if (!el) return;
    cancelAnimationFrame(frame.current);
    el.style.setProperty("--px", "0");
    el.style.setProperty("--py", "0");
  };

  return (
    <header ref={ref} className="banner" data-accent={accent} onPointerMove={onMove} onPointerLeave={onLeave}>
      <Illustration kind={art} />
      <div className="banner__text">
        <h1 className="banner__title">{title}</h1>
        {subtitle && <p className="banner__sub">{subtitle}</p>}
      </div>
    </header>
  );
}
