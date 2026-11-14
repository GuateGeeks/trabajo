# HQ de GuateGeeks — especificación

Panel local para ver y trabajar todos los proyectos de GuateGeeks (Sócrates, Code Studio, GuateGeeks, Laboratorio 3D).
Reinterpreta los principios del vídeo «Construye tu backend con Obsidian (no un segundo cerebro)», de Nico CMW.

Leyenda: **[O]** observado en el vídeo (transcripción y 3 capturas) · **[I]** interpretación · **[P]** propuesta propia.

## 1. Análisis del vídeo

**[O]** Demostración en pantalla de un sistema personal: carpetas (Obsidian) + scripts de Python + IA + un panel web llamado «HQ».

| Principio | Evidencia |
|---|---|
| Separar **humano** y **máquina** | 5:05–6:33: `humano/` guarda lo dicho por la persona sin resumir; `maquina/` guarda scripts, instrucciones y datos. |
| **Determinismo donde se pueda, IA donde haga falta** | 7:03–8:45: scripts de Python capturan datos (261 vídeos); la IA filtra (3 «útiles»). |
| **Todo queda registrado** | 8:49–9:38: un script escribe cada cambio de la IA en un log. |
| **Agnóstico al modelo** | 9:39–10:59: son carpetas; sirve con cualquier IA. |
| **Vista consultable sin chat** | Capturas 4:05, 3:44 y 11:45: tarjetas con 3 cifras, «Entrar →», dock inferior con insignias. |
| **Grupo de supervisión de la IA** | Dock: La IA, Decidir (19), Aprendido. **[I]** Es un circuito: qué hizo, qué espera tu decisión, qué se aprendió. |
| **Color e ilustración por sección** | Capturas: verde (Ventas), turquesa (Formación), azul (Bandeja). **[I]** Orientación sin leer. |
| **Confianza** | Captura 11:45: «Correo local · solo lectura»; lista difuminada. |
| Acceso móvil | 11:45–14:03: servidor local + Tailscale. |

**No observado (no lo afirmo):** transiciones, duraciones, hover, tecnología del panel. Las capturas son estáticas.

## 2. Mapa

```
EXTERIOR → scripts (sin IA) → maquina/ → IA (triage) → resultados
                                  │                        │
                                  └──── bitácora ◄─────────┘
humano/ ──► contexto fiable para la IA
Panel HQ: Inicio · Tareas · [proyectos] │ Decidir · Bitácora · Aprendido
```

## 3. Tres conceptos

- **A · Mesa de trabajo.** Portada con una tarjeta por proyecto (3 cifras + «Entrar →») y dock. Complejidad baja.
- **B · Taller 3D.** Taller isométrico navegable con Three.js. Complejidad alta; el 3D sería decorativo.
- **C · Cabina de supervisión.** Gira en torno a Decidir, Bitácora y Aprendido, con `humano/` y `maquina/` por proyecto. Complejidad media.

## 4. Recomendación: A como estructura, con el núcleo de C

La portada y el dock vienen de A; el segundo grupo del dock (Decidir, Bitácora, Aprendido) viene de C. No se usa 3D: la referencia no lo necesita y el panel se abre todos los días.
Originalidad: la identidad (paleta GuateGeeks, ilustraciones propias, modo privado) y la lección «Aprendido» escrita por el equipo como memoria compartida.

## 5. Storyboard

1. **Llegada.** Carga con esqueletos (700 ms simulados). Estado final: banner «Mesa de trabajo», resumen («4 propuestas por decidir · 7 tareas abiertas») y 4 tarjetas de proyecto.
2. **Entrar a un proyecto.** Clic en una tarjeta → la vista entra con 240 ms (opacidad + 8 px). Muestra tres cifras, columna Humano, columna Máquina y tareas.
3. **Decidir.** Dock → Decidir (insignia 4). «Ver cambios» abre el diff. «Aprobar» → la tarjeta sale en 220 ms, la insignia baja a 3 y aparece en «Resueltas» con «Deshacer».
4. **Bitácora.** La decisión aparece arriba como «Aprobó: …» con etiqueta Humano.
5. **Aprendido.** Se anota una lección (validación en línea) y queda marcada «Humano».
6. **Confianza.** El ojo activa el modo privado: difumina datos sensibles hasta pasar el cursor o enfocar.
7. **Fallo.** Con `?simular=error` aparece «No pudimos cargar el HQ» y «Reintentar» recupera la vista.

## 6. Arquitectura técnica

```
src/
  data/       types.ts (contrato) · mock.ts (datos ficticios) · api.ts (frontera) · store.tsx (estado) · format.ts
  hooks/      useRoute (hash) · usePreferences (tema, privacidad, modo ligero) · useClock
  components/ Dock · TopBar · Banner · Illustration · ProjectCard · Chips · States
  views/      Home · Project · Tasks · Decide · Log · Learned
  styles/     tokens.css · base.css · art.css · components.css
```

- **Presentación / comportamiento / datos separados.** Las vistas no conocen el origen de los datos: solo `api.ts` lo sabe.
- **Decisiones separadas de los datos base** (`UserOverlay`, en `localStorage`): así nunca se mezclan autorías.
- **Dependencias:** `react`, `react-dom`, `lucide-react`. Sin librería de animación: bastan CSS y `transform`/`opacity`. Sin Three.js.
- **Conectar datos reales:** reemplaza el cuerpo de `fetchWorkspace` por un `fetch` a un servidor local (scripts de Python que lean git, tareas y logs) respetando `types.ts`.

### Sistema de diseño
- Color: coral `#ef8556`, cielo `#5fbad6`, ciruela `#685599` y verde azulado `#3f9d8f`; la acción principal usa coral con tinta oscura. Un acento por proyecto.
- Tipografía: DM Sans (títulos, peso 500, tracking negativo) e Inter (texto).
- Espacio base 8 px; radios 8/16/24.
- Movimiento: respuestas 140 ms, cambio de vista 240 ms, curva `cubic-bezier(.2,.8,.2,1)`.
- Accesibilidad: enlace «Saltar al contenido», foco visible, foco al contenido al cambiar de vista, `aria-current`, `aria-pressed`, regiones `status`/`alert`, estados no solo por color.
- Responsive: dock con etiquetas hasta 441 px y solo iconos por debajo (cabe todo en 375 px).
- Equipos lentos: `data-perf="lite"` (≤ 4 núcleos o ≤ 4 GB, o `?ligero`) desactiva paralaje, animaciones y sombras costosas; `prefers-reduced-motion` también.

## 7–8. Evaluación crítica

| Criterio | Estado |
|---|---|
| Fidelidad estructural | Alta: humano/máquina, tarjetas de 3 cifras, dock de dos grupos, bitácora y cola de decisiones. |
| Originalidad | Media-alta: ilustración y paleta propias, modo privado, lecciones del equipo. Falta la identidad guatemalteca profunda (textiles, tipografía propia). |
| Calidad visual | Buena en claro y oscuro. Las ilustraciones son geométricas; pueden enriquecerse. |
| Animaciones | Sobrias y funcionales. Falta una transición compartida entre tarjeta y vista de proyecto. |
| Navegación | Clara. Con más de 4 proyectos el dock necesitará agrupar o desplazarse. |
| Rendimiento | JS 83 kB gzip, CSS 4 kB. Paralaje solo `transform`. |
| Mantenibilidad | Tokens y contrato de datos centralizados. **Sin pruebas automáticas todavía.** |

**Límites conocidos:** los datos son ficticios; no hay servidor ni Tailscale; el estado vive en el navegador; no se verificó con lector de pantalla real ni se midió contraste con herramienta.

**Siguientes pasos sugeridos**
1. Servidor local con scripts de Python que lean git, tareas y logs reales.
2. Pruebas (Playwright) de navegación, decisiones y modo privado.
3. Transición compartida tarjeta → proyecto (View Transitions).
4. Vista «Taller» opcional en 3D, solo si aporta algo.
5. Acceso móvil con Tailscale.
