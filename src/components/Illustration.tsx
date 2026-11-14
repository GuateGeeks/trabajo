import type { ArtKind } from "../data/types";

/**
 * Ilustraciones vectoriales originales, pintadas con los colores de acento del contenedor
 * (`--accent`, `--accent-deep`, `--accent-soft`). Cada grupo `data-d` es una capa de profundidad
 * para el paralaje del banner. Pesan unos pocos KB y no necesitan imágenes externas.
 */

function Cube({ x, y, s, depth }: { x: number; y: number; s: number; depth: number }) {
  const top = `${x},${y} ${x + s},${y + s / 2} ${x},${y + s} ${x - s},${y + s / 2}`;
  const left = `${x - s},${y + s / 2} ${x},${y + s} ${x},${y + 2 * s} ${x - s},${y + 1.5 * s}`;
  const right = `${x + s},${y + s / 2} ${x},${y + s} ${x},${y + 2 * s} ${x + s},${y + 1.5 * s}`;
  return (
    <g data-d={depth}>
      <polygon points={top} className="f-soft" />
      <polygon points={left} className="f-accent" />
      <polygon points={right} className="f-dark" />
    </g>
  );
}

const ARTS: Record<ArtKind, React.ReactNode> = {
  volcanes: (
    <>
      <g data-d={2}>
        <circle cx="650" cy="62" r="34" className="f-soft" />
      </g>
      <g data-d={4}>
        <polygon points="0,200 0,128 90,82 170,130 260,72 360,140 460,100 560,152 660,92 800,140 800,200" className="f-soft" opacity=".4" />
      </g>
      <g data-d={8}>
        <polygon points="110,200 270,58 340,58 510,200" className="f-accent" />
        <polygon points="270,58 340,58 322,76 288,76" className="f-dark" />
        <circle cx="300" cy="38" r="14" className="f-white" />
        <circle cx="322" cy="18" r="10" className="f-white" />
      </g>
      <g data-d={12}>
        <polygon points="0,200 0,168 200,150 420,176 640,154 800,172 800,200" className="f-dark" />
      </g>
    </>
  ),
  arcos: (
    <>
      <g data-d={2}>
        <circle cx="690" cy="56" r="30" className="f-soft" />
      </g>
      <g data-d={6}>
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <rect key={i} x={110 + i * 112} y="64" width="38" height="112" rx="6" className="f-soft" opacity=".45" />
        ))}
        <rect x="90" y="44" width="640" height="18" rx="4" className="f-soft" opacity=".55" />
      </g>
      <g data-d={10}>
        {[0, 1, 2].map((i) => (
          <path key={i} d={`M${200 + i * 160} 176 v-64 a40 40 0 0 1 80 0 v64z`} className="f-accent" />
        ))}
      </g>
      <g data-d={13}>
        <rect x="0" y="176" width="800" height="24" className="f-dark" />
      </g>
    </>
  ),
  codigo: (
    <>
      <g data-d={3}>
        <rect x="0" y="0" width="800" height="200" className="f-deep" />
        {[0, 1, 2, 3].map((i) => (
          <rect key={i} x={40 + i * 200} y={26 + (i % 2) * 40} width="120" height="8" rx="4" className="f-soft" opacity=".25" />
        ))}
      </g>
      <g data-d={8}>
        <rect x="210" y="34" width="380" height="136" rx="14" className="f-accent" />
        <rect x="210" y="34" width="380" height="26" rx="14" className="f-dark" />
        <circle cx="230" cy="47" r="5" className="f-soft" />
        <circle cx="248" cy="47" r="5" className="f-soft" />
        <rect x="236" y="80" width="150" height="9" rx="4" className="f-soft" />
        <rect x="252" y="100" width="210" height="9" rx="4" className="f-white" />
        <rect x="252" y="120" width="120" height="9" rx="4" className="f-white" />
        <rect x="236" y="140" width="180" height="9" rx="4" className="f-soft" />
      </g>
      <g data-d={13}>
        <polyline points="150,70 100,105 150,140" fill="none" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" className="s-soft" />
        <polyline points="650,70 700,105 650,140" fill="none" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" className="s-soft" />
      </g>
    </>
  ),
  cubos: (
    <>
      <g data-d={3}>
        <rect x="0" y="0" width="800" height="200" className="f-deep" />
      </g>
      <Cube x={130} y={60} s={30} depth={5} />
      <Cube x={310} y={30} s={46} depth={9} />
      <Cube x={470} y={78} s={36} depth={12} />
      <Cube x={620} y={34} s={26} depth={6} />
      <Cube x={720} y={96} s={34} depth={14} />
    </>
  ),
  mesa: (
    <>
      <g data-d={2}>
        <circle cx="690" cy="58" r="32" className="f-soft" />
      </g>
      <g data-d={5}>
        <polygon points="0,200 0,120 120,76 220,124 340,68 460,132 560,96 700,146 800,110 800,200" className="f-soft" opacity=".4" />
      </g>
      <g data-d={9}>
        <polygon points="40,200 190,66 260,66 400,200" className="f-accent" />
        <polygon points="190,66 260,66 244,84 206,84" className="f-dark" />
      </g>
      <Cube x={520} y={70} s={34} depth={12} />
      <g data-d={14}>
        <polyline points="640,120 610,142 640,164" fill="none" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" className="s-soft" />
        <polyline points="700,120 730,142 700,164" fill="none" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" className="s-soft" />
        <polygon points="0,200 0,176 300,164 560,182 800,170 800,200" className="f-dark" />
      </g>
    </>
  ),
};

export function Illustration({ kind }: { kind: ArtKind }) {
  return (
    <svg className="art" viewBox="0 0 800 200" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
      {ARTS[kind]}
    </svg>
  );
}
