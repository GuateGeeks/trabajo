import type { ImprovementStage } from "../data/types";

export const STAGES: { key: ImprovementStage; label: string; hint: string; chip: string }[] = [
  { key: "por-hacer", label: "Por hacer", hint: "Sin trabajo todavía", chip: "" },
  { key: "en-curso", label: "En curso", hint: "Alguien está trabajando en ella", chip: "" },
  { key: "trabajado", label: "Trabajado", hint: "Hay trabajo hecho; falta la aprobación del equipo", chip: "chip--warn" },
  { key: "aprobado", label: "Aprobado", hint: "El equipo confirmó que se cumplió; listo para commit", chip: "chip--ok" },
  { key: "hecha", label: "Hecha", hint: "Commit hecho", chip: "chip--ok" },
];

export const stageOf = (key: ImprovementStage) => STAGES.find((s) => s.key === key)!;

export function StageChip({ stage }: { stage: ImprovementStage }) {
  const s = stageOf(stage);
  return (
    <span className={`chip ${s.chip}`} title={s.hint}>
      {s.label}
    </span>
  );
}
