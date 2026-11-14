#!/usr/bin/env node
/**
 * Sincronización diaria del HQ: lee los repositorios de `vault/repositorios.md`
 * y deja el resultado dentro de la bóveda para que el panel lo muestre.
 *
 * SOLO hace `git fetch` y lecturas (lista blanca en ALLOWED_GIT). Nunca `pull`, `checkout`, `reset` ni escribe en los repos.
 * Escribe únicamente:
 *   - proyectos/<id>/maquina/Repo <nombre>.md   (estado del repo, se sobrescribe)
 *   - bitacora/AAAA-MM-DD.md                    (una línea por repo, se añade al final)
 *
 * Uso: node scripts/sync.mjs [--sin-fetch]
 */
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const vault = path.resolve(process.env.HQ_VAULT || path.join(here, "..", "vault"));
const skipFetch = process.argv.includes("--sin-fetch");
const PROJECTS = fs.existsSync(path.join(vault, "proyectos"))
  ? fs.readdirSync(path.join(vault, "proyectos"), { withFileTypes: true }).filter((e) => e.isDirectory()).map((e) => e.name)
  : [];
// Garantía de SOLO LECTURA: únicamente estos subcomandos de git pueden ejecutarse.
// `fetch` solo descarga al repositorio local las referencias remotas; no toca tu rama ni tus archivos.
const ALLOWED_GIT = new Set(["fetch", "status", "branch", "rev-list", "log"]);

const pad = (n) => String(n).padStart(2, "0");
const now = new Date();
const day = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
const clock = `${pad(now.getHours())}:${pad(now.getMinutes())}`;
const iso = `${day}T${clock}`;
const clean = (text) => String(text).replace(/\s*\|\s*/g, " · ").replace(/\s+/g, " ").trim();

function git(repo, args, timeout = 60_000) {
  if (!ALLOWED_GIT.has(args[0])) throw new Error(`Subcomando de git no permitido (el HQ es solo lectura): ${args[0]}`);
  return execFileSync("git", ["-C", repo, ...args], {
    encoding: "utf8",
    timeout,
    stdio: ["ignore", "pipe", "pipe"],
    env: { ...process.env, GIT_TERMINAL_PROMPT: "0", GIT_SSH_COMMAND: "ssh -o BatchMode=yes -o ConnectTimeout=15" },
  }).trim();
}

function readRepos() {
  const file = path.join(vault, "repositorios.md");
  if (!fs.existsSync(file)) throw new Error(`Falta ${file}. Copia vault/repositorios.ejemplo.md como vault/repositorios.md y pon las rutas de tu máquina.`);
  const repos = [];
  for (const line of fs.readFileSync(file, "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*-\s+([\w-]+)\s*\|\s*(.+?)\s*$/);
    if (!m) continue;
    if (!PROJECTS.includes(m[1])) {
      console.warn(`Proyecto desconocido «${m[1]}» en repositorios.md; se omite.`);
      continue;
    }
    const resolved = m[2].replace(/^~(?=\/|$)/, os.homedir());
    repos.push({ project: m[1], dir: resolved, name: path.basename(resolved) });
  }
  return repos;
}

function inspect(repo) {
  const result = { status: "ok", notes: [], facts: [], recent: [], news24: 0, branch: "?", dirty: 0, ahead: 0, behind: 0 };

  if (!fs.existsSync(path.join(repo.dir, ".git"))) {
    result.status = "error";
    result.notes.push("La carpeta no existe o no es un repositorio git.");
    return result;
  }

  if (!skipFetch) {
    try {
      git(repo.dir, ["fetch", "--prune", "--quiet"]);
    } catch (e) {
      result.status = "error";
      const detail = String(e.stderr || e.message).split("\n").find(Boolean) || "error desconocido";
      result.notes.push(`No se pudo consultar el remoto (${clean(detail)}). Se muestra lo último que había en local.`);
    }
  }

  try {
    result.branch = git(repo.dir, ["branch", "--show-current"]) || "(sin rama)";
    result.dirty = git(repo.dir, ["status", "--porcelain"]).split("\n").filter(Boolean).length;
    try {
      const [ahead, behind] = git(repo.dir, ["rev-list", "--left-right", "--count", "HEAD...@{upstream}"]).split(/\s+/).map(Number);
      result.ahead = ahead;
      result.behind = behind;
    } catch {
      result.notes.push("La rama actual no tiene rama remota asociada.");
    }
    result.news24 = Number(git(repo.dir, ["rev-list", "--all", "--count", "--since=24 hours ago"]));
    result.recent = git(repo.dir, ["log", "--all", "-8", "--date=format:%Y-%m-%d %H:%M", "--format=%h\t%cd\t%an\t%s"])
      .split("\n")
      .filter(Boolean)
      .map((l) => l.split("\t"));
  } catch (e) {
    result.status = "error";
    result.notes.push(`No se pudo leer el repositorio: ${clean(String(e.stderr || e.message).split("\n")[0])}`);
  }

  if (result.status === "ok" && result.behind > 0) {
    result.status = "warn";
    result.notes.push(`El remoto tiene ${result.behind} commit(s) que tu copia local aún no tiene.`);
  }
  return result;
}

function writeJobNote(repo, r) {
  const dir = path.join(vault, "proyectos", repo.project, "maquina");
  fs.mkdirSync(dir, { recursive: true });
  const lines = [
    "---",
    "tipo: repositorio",
    `repo: ${repo.name}`,
    "horario: cada día, 8:00",
    `ultima_ejecucion: ${iso}`,
    `estado: ${r.status}`,
    `rama: ${r.branch}`,
    `sin_guardar: ${r.dirty}`,
    `adelante: ${r.ahead}`,
    `atras: ${r.behind}`,
    `commits_24h: ${r.news24}`,
    "---",
    `Repositorio \`${repo.dir.replace(os.homedir(), "~")}\`, solo para visualizar. Esta nota la genera \`npm run sync\`: no la edites a mano.`,
    "",
    `- Rama: ${r.branch}`,
    `- Cambios sin guardar: ${r.dirty}`,
    `- Adelante / atrás del remoto: ${r.ahead} / ${r.behind}`,
    `- Commits en las últimas 24 h: ${r.news24}`,
    ...r.notes.map((n) => `- ⚠ ${n}`),
    "",
    "## Últimos commits (todas las ramas)",
    ...r.recent.map(([h, when, who, msg]) => `- \`${h}\` | ${when} | ${clean(who)} | ${msg.replace(/\s+/g, " ").trim()}`),
    "",
  ];
  fs.writeFileSync(path.join(dir, `Repo ${repo.name}.md`), lines.join("\n"));
}

function appendLog(repo, r) {
  const dir = path.join(vault, "bitacora");
  fs.mkdirSync(dir, { recursive: true });
  const verdict = r.status === "error" ? "Sincronización con problemas" : "Sincronizó";
  const detail = r.status === "error" ? r.notes[0] : `${r.news24} commit(s) en 24 h · rama ${r.branch} · ${r.dirty} sin guardar${r.behind ? ` · ${r.behind} por traer` : ""}`;
  const line = `- ${clock} | ia | ${repo.project} | ${clean(`${verdict} ${repo.name}`)} | ${clean(detail)}\n`;
  const file = path.join(dir, `${day}.md`);
  const prefix = fs.existsSync(file) && !fs.readFileSync(file, "utf8").endsWith("\n") ? "\n" : "";
  fs.appendFileSync(file, prefix + line);
}

let failures = 0;
for (const repo of readRepos()) {
  const result = inspect(repo);
  writeJobNote(repo, result);
  appendLog(repo, result);
  if (result.status === "error") failures += 1;
  console.log(`${result.status.padEnd(5)} ${repo.project.padEnd(12)} ${repo.name} · ${result.news24} commits/24h · rama ${result.branch}`);
}
console.log(`Listo ${day} ${clock}${failures ? ` · ${failures} con problemas` : ""}`);
process.exit(failures ? 1 : 0);
