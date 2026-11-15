# Bóveda del HQ de GuateGeeks

Esta carpeta es una bóveda de Obsidian. El panel HQ la lee en vivo: lo que escribes aquí aparece allá al volver a la pestaña del navegador.

## Regla de oro

- `humano/` = lo que dices tú, tal cual. La IA lo lee, nunca lo reescribe.
- `maquina/` = lo que hacen los scripts y agentes.

## Estructura

```
proyectos/<id>/proyecto.md     nombre, lema, acento y arte (propiedades)
proyectos/<id>/humano/*.md     tus notas (el título es el nombre del archivo)
proyectos/<id>/maquina/*.md    un trabajo automático por archivo (los `Repo *.md` los genera el sync)
proyectos/<id>/tareas.md       tareas en formato Tasks: - [ ] texto 📅 2026-11-12 #maquina
propuestas/*.md                cambios que la IA propone y esperan tu decisión
bitacora/AAAA-MM-DD.md         una línea por acción: - 09:14 | ia | socrates | acción | detalle
aprendido/lecciones.md         - 2026-11-05 | socrates | humano | lo aprendido
```

Cada carpeta de `proyectos/` es un proyecto: añade una y aparece sola. `proyecto.md` acepta `nombre`, `lema`, `acento` (plum, sky, coral, teal), `arte` y `orden`.

Repositorios: `repositorios.md` (solo para visualizar). Mejoras futuras: `mejoras/`.

## Notas

- Las cifras de cada proyecto se calculan solas (tareas abiertas, propuestas por decidir, notas tuyas).
- Aprobar o rechazar una propuesta en el panel se guarda en el navegador, no en la bóveda.
- Los archivos o líneas con formato inválido se omiten. La lista de avisos aparece en `http://127.0.0.1:5180/api/workspace` (campo `warnings`).
- El panel solo lee la bóveda: nunca escribe en ella.

## Mejoras: identificador, trabajado y aprobación (se marcan a mano)

Cada mejora de `mejoras/` lleva un identificador en negrita (`S-04` Sócrates, `CO-` Cotizador, `HQ-` el propio HQ) y se mueve así:

| Estado | Cómo se marca (líneas indentadas bajo la mejora) |
|---|---|
| Por hacer | no hay nada |
| En curso | `  - estado: en curso` |
| Trabajado | `  - trabajado: 2026-11-15 Claude` (hay trabajo hecho; **falta aprobación**) |
| Aprobado | `  - aprobado: 2026-11-16 Joaquín, Alvin` (el equipo confirmó que se cumplió lo pedido) |
| Hecha | `  - commit: abc1234` (y la casilla en `[x]`) |

Opcional: `  - rama: mejora/S-04-ingreso`.

**Para quién es:** además del proyecto (`#socrates`), cada mejora lleva `#docente` o `#estudiante` en la misma línea, para saber a qué experiencia responde. Código `E-` = estudiante, `S-` = docente en Sócrates. En Tareas y Mejoras se puede filtrar por esa etiqueta.

**Regla: no se hace commit de una mejora sin su línea `aprobado:`.** Si una mejora aparece como hecha o con commit sin aprobación, el panel muestra una advertencia.
