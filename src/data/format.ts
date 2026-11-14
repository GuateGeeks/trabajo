const rtf = new Intl.RelativeTimeFormat("es", { numeric: "auto" });

/** "hace 12 min", "ayer", "en 3 h". */
export function relativeTime(iso: string, now = Date.now()): string {
  const diffMin = Math.round((new Date(iso).getTime() - now) / 60_000);
  const abs = Math.abs(diffMin);
  if (abs < 1) return "ahora";
  if (abs < 60) return rtf.format(diffMin, "minute");
  if (abs < 60 * 24) return rtf.format(Math.round(diffMin / 60), "hour");
  return rtf.format(Math.round(diffMin / (60 * 24)), "day");
}

export function dayLabel(iso: string, now = new Date()): string {
  const d = new Date(iso);
  const sameDay = (a: Date, b: Date) => a.toDateString() === b.toDateString();
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (sameDay(d, now)) return "Hoy";
  if (sameDay(d, yesterday)) return "Ayer";
  return d.toLocaleDateString("es-GT", { weekday: "long", day: "numeric", month: "long" });
}

export function timeOfDay(iso: string): string {
  return new Date(iso).toLocaleTimeString("es-GT", { hour: "2-digit", minute: "2-digit", hour12: false });
}

export function greeting(now = new Date()): string {
  const h = now.getHours();
  return h < 12 ? "Buen día" : h < 19 ? "Buenas tardes" : "Buenas noches";
}

export function pluralize(n: number, one: string, many: string): string {
  return `${n} ${n === 1 ? one : many}`;
}
