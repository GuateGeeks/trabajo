# Estructura del HQ

Mapa para saber qué hay, quién escribe dónde y cómo seguir trabajando. Última revisión: 2026-11-14.

## Visión de conjunto

```
 Obsidian (tú escribes)          Repos locales de GuateGeeks
        │                                  │
        │                       npm run sync  (launchd, 8:00 diario)
        │                       solo `git fetch` + lectura
        ▼                                  ▼
 ┌──────────────────────── vault/ (la bóveda) ────────────────────────┐
 │ humano/ · tareas · propuestas · aprendido · mejoras  ← lo escribes │
 │ maquina/ · bitacora                                  ← lo escribe  │
 │                                                        el sync     │
 └───────────────────────────────┬────────────────────────────────────┘
                                 │ lectura (solo lee)
                     server/  /api/workspace   (dentro de Vite)
                                 │
                         src/  el panel (React)  → http://127.0.0.1:5180
                                 │
              decisiones y lecciones: localStorage del navegador
```

## Quién escribe qué

| Zona | Escribe | Lee |
|---|---|---|
| `vault/proyectos/<id>/humano/`, `tareas.md`, `proyecto.md` | Tú, en Obsidian | Panel |
| `vault/propuestas/`, `aprendido/` | Tú o agentes (hoy a mano) | Panel |
| `vault/proyectos/<id>/maquina/Repo *.md` | `scripts/sync.mjs` (se sobrescribe) | Panel |
| `vault/bitacora/AAAA-MM-DD.md` | `sync.mjs` añade líneas; tú también puedes | Panel |
| `vault/mejoras/` | Claude y tú | Panel (vista Mejoras) |
| `vault/repositorios.md` | Tú | `sync.mjs` |
| Aprobar/rechazar, marcar tareas, lecciones del panel | El panel → `localStorage` | Panel |

Regla heredada del vídeo: **`humano/` nunca lo reescribe una máquina.**

## Carpetas del proyecto

| Ruta | Qué es |
|---|---|
| `vault/` | La bóveda de Obsidian (datos reales). Guía propia en `vault/LEEME.md`. |
| `server/vault.ts` | Lee la bóveda y la convierte al contrato de datos. Solo lectura. |
| `server/plugin.ts` | Expone `/api/workspace` dentro de Vite (dev y preview). |
| `scripts/sync.mjs` | Sincronización diaria con los repos. |
| `scripts/programar-sync.sh` | Instala, quita o consulta la tarea de las 8:00 en launchd. |
| `src/data/` | `types.ts` (contrato), `api.ts` (frontera), `store.tsx` (estado), `mock.ts` (solo `?demo`). |
| `src/views/` | Inicio, Proyecto (con repositorios), Tareas, Decidir, Bitácora, Aprendido, Mejoras. |
| `src/components/`, `src/styles/` | Piezas visuales y tokens GuateGeeks. |
| `docs/ESPECIFICACION.md` | Análisis del vídeo, conceptos y evaluación. |

## Sincronización de las 8:00

- Tarea de macOS `com.guategeeks.hq-sync` (launchd). Corre aunque no tengas abierto Claude ni el panel. Si la Mac está dormida a las 8:00, corre al despertar; si está apagada, ese día no corre.
- Por repo: `git fetch --prune`, rama actual, cambios sin guardar, adelante/atrás del remoto, commits de 24 h y últimos 8 commits. Estado `ok`, `warn` (el remoto tiene commits que no traes) o `error` (no se pudo consultar).
- **Solo visualización:** el script tiene una lista blanca de subcomandos de git (`fetch`, `status`, `branch`, `rev-list`, `log`). No hace commit, push ni pull, y el panel no manda nada a los repos.
- Repos conectados: los de `vault/repositorios.md` (hoy Sócrates, Cotizador, Programas educativos y Calculadora Guate). Las copias duplicadas y los clones de terceros quedaron fuera a propósito.
- Manual: `npm run sync`. Estado: `./scripts/programar-sync.sh estado`. Quitar: `./scripts/programar-sync.sh quitar`. Registro: `~/Library/Logs/guategeeks-hq-sync.log`.
- Límite: usa tus credenciales de git (ssh o HTTPS) sin pedir contraseña; si el remoto las exige, el repo sale en `error`.

## Compartir con el equipo

- El repo contiene el código y la parte **compartida** de la bóveda (proyectos, mejoras, tareas). Lo propio de cada máquina no se sube: `vault/repositorios.md`, las notas `Repo *.md` y la bitácora que genera el sync.
- La copia web (GitHub Pages) se compila con `.github/workflows/pages.yml` en cada push a `main`. Es una foto: no incluye el estado de los repos locales.

## Mejoras: del buzón al commit

Cada mejora tiene identificador (`S-04`) y avanza por: por hacer → en curso → trabajado → aprobado → hecha. Los campos `trabajado`, `aprobado`, `rama` y `commit` se escriben **a mano** en `vault/mejoras/` (formato en `vault/LEEME.md`); el panel solo los muestra y avisa de incoherencias (por ejemplo, un commit sin aprobación del equipo). **Regla: antes de hacer commit de una mejora debe existir su línea `aprobado:`.**

## Cómo se añade una herramienta nueva

1. Crea la carpeta `vault/proyectos/<id>/` con un `proyecto.md` (nombre, lema, acento, arte, orden) y, si quieres, `humano/` y `tareas.md`.
2. Si tiene repositorio, añade `- <id> | <ruta>` en `vault/repositorios.md` y corre `npm run sync`.
3. Aparece sola en Inicio, Tareas, Bitácora y Aprendido. El dock no cambia: los proyectos se eligen desde Inicio.

## Deuda y límites conocidos

- Los proyectos ya no están fijos en el código, pero solo hay 4 colores de acento y 5 ilustraciones: con más proyectos se repiten.
- El panel no escribe en la bóveda; las decisiones viven solo en el navegador.
- Las propuestas se crean a mano: aún ningún agente las deja en `vault/propuestas/`.
- `code-studio` y `lab-3d` los desarrolla Alvin Estrada y se integrarán a Sócrates; aún sin repositorio conectado. `guategeeks` (la marca) tampoco tiene.
- Las descripciones de Cotizador, Programas educativos y Calculadora Guate son provisionales.
- Sin pruebas automáticas ni acceso móvil.
- La lista completa y priorizada está en `vault/mejoras/Mejoras futuras.md`.
