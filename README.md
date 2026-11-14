# HQ · GuateGeeks

Tablero para llevar el control del trabajo de todas las herramientas de GuateGeeks (Sócrates, Cotizador, Programas educativos, Calculadora Guate, Code Studio, Laboratorio 3D y el propio HQ).

Lee una **bóveda de Obsidian** (`vault/`) y los repositorios locales, **solo para visualizar**: el HQ nunca hace commit, push ni pull en ellos.

## Para el equipo: qué se debe estar trabajando

Abre **Mejoras** (o **Tareas**, donde también aparecen). Cada mejora tiene identificador (`S-01` Sócrates, `CO-` Cotizador, `HQ-` el HQ) y un estado marcado a mano:

`Por hacer → En curso → Trabajado → Aprobado → Hecha`

**Regla: no se hace commit de una mejora sin la línea `aprobado:` del equipo.** Cómo marcar cada paso: [vault/LEEME.md](vault/LEEME.md).

## Verlo

- **Copia compartida** (foto del último push a `main`): se publica con GitHub Pages desde este repo (Settings → Pages → Source: GitHub Actions). El enlace aparece en la pestaña Actions y en Settings → Pages. No se actualiza sola.
- **En vivo en tu máquina**:

```bash
npm install
npm run dev        # http://127.0.0.1:5180
```

Obsidian → *Abrir carpeta como bóveda* → `vault/`.

## Trabajar con el repo

1. Edita las mejoras en `vault/mejoras/` (Obsidian o cualquier editor) y sube el cambio con git. Así el estado queda igual para todos.
2. Opcional, para ver el estado de los repos: copia `vault/repositorios.ejemplo.md` como `vault/repositorios.md` (no se sube), pon tus rutas y corre `npm run sync`. Para que corra solo a las 8:00: `./scripts/programar-sync.sh instalar` (macOS).

## Más

- Mapa del sistema y reglas: [docs/ESTRUCTURA.md](docs/ESTRUCTURA.md)
- Diseño y análisis de la referencia: [docs/ESPECIFICACION.md](docs/ESPECIFICACION.md)
- Parámetros de prueba: `?demo` (datos ficticios), `?simular=error`, `?ligero`.
- La copia compartida es pública para quien tenga el enlace salvo que la organización use Pages con acceso restringido; no pongas en `vault/` nada que no deba verse.
