import { useCallback, useEffect, useState } from "react";

export type ThemeChoice = "system" | "light" | "dark";

function read<T extends string>(key: string, allowed: readonly T[], fallback: T): T {
  try {
    const v = localStorage.getItem(key);
    return (allowed as readonly string[]).includes(v ?? "") ? (v as T) : fallback;
  } catch {
    return fallback;
  }
}

function write(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {
    /* ignorar */
  }
}

/** Equipos con poca memoria o pocos núcleos pasan a un modo ligero (sin paralaje ni sombras costosas). */
function detectLite(): boolean {
  const nav = navigator as Navigator & { deviceMemory?: number };
  const lowMemory = typeof nav.deviceMemory === "number" && nav.deviceMemory <= 4;
  const fewCores = typeof nav.hardwareConcurrency === "number" && nav.hardwareConcurrency <= 4;
  return lowMemory || fewCores || new URLSearchParams(location.search).has("ligero");
}

export function usePreferences() {
  const [theme, setTheme] = useState<ThemeChoice>(() => read("gg-hq:theme", ["system", "light", "dark"] as const, "system"));
  const [privacy, setPrivacy] = useState<boolean>(() => read("gg-hq:privacy", ["on", "off"] as const, "off") === "on");

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    write("gg-hq:theme", theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.dataset.privacy = privacy ? "on" : "off";
    write("gg-hq:privacy", privacy ? "on" : "off");
  }, [privacy]);

  useEffect(() => {
    document.documentElement.dataset.perf = detectLite() ? "lite" : "full";
  }, []);

  const cycleTheme = useCallback(() => setTheme((t) => (t === "system" ? "light" : t === "light" ? "dark" : "system")), []);
  const togglePrivacy = useCallback(() => setPrivacy((p) => !p), []);

  return { theme, cycleTheme, privacy, togglePrivacy };
}
