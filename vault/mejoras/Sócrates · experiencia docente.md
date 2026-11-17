# Sócrates · experiencia del docente y equipo escolar

Puntos de mejora para la sección «Soy docente o parte del equipo escolar» de Sócrates. Los dictó Joaquín el 2026-11-14 y están ordenados por recorrido: navegación, ingreso, clases, planificación, estudiantes, progreso, intervenciones y evaluación.

## Navegación del docente

- [ ] **S-01** Quitar del espacio del docente el enlace «Construcciones»: no corresponde a su experiencia #socrates #docente · 2026-11-14 · Joaquín
  - trabajado: 2026-11-14 Claude
  - aprobado: 2026-11-16 Joaquín
  - rama: claude/lote-1-docente
  - Hoy está en la barra superior del espacio escolar (`src/school/SchoolApp.tsx`, línea 87), junto al botón de tema.
  - Su pantalla de origen es la galería de modelos y manuales; en el estudiante se llega desde Materias.
  - Revisar en pruebas (https://socrates-pruebas.web.app, cuenta +docente): la barra superior del espacio docente ya no tiene «Construcciones». La galería sigue disponible en Programas.
- [ ] **S-02** Quitar del espacio del docente el enlace «← Mi aprendizaje»: es del estudiante y no va en el docente #socrates #docente · 2026-11-14 · Joaquín
  - trabajado: 2026-11-14 Claude
  - aprobado: 2026-11-16 Joaquín
  - rama: claude/lote-1-docente
  - Hoy está en esa misma barra superior (`src/school/SchoolApp.tsx`, línea 87) y solo aparece fuera del modo demostración.
  - Al quitarlo, revisar qué otro camino de regreso necesita el docente (hoy el aviso «Abriendo Mi aprendizaje…» y «Volver a Mi aprendizaje» también viven en ese archivo).
  - Revisar en pruebas (cuenta +docente): la barra superior ya no tiene «← Mi aprendizaje». El estudiante conserva su «Volver a Mi aprendizaje».

## Ingreso

- [ ] **S-03** Hacer más sobria la experiencia visual del ingreso docente #socrates #docente · 2026-11-14 · Joaquín
- [ ] **S-04** Quitar los enlaces redundantes del ingreso docente: el docente entra con correo y contraseña, nunca con código de clase #socrates #docente · 2026-11-14 · Joaquín
  - trabajado: 2026-11-14 Claude
  - aprobado: 2026-11-16 Joaquín
  - rama: claude/lote-1-docente
  - Eliminar «Ya tengo mi código · Tengo un código de clase · Volver a elegir».
  - Eliminar «Ya tengo mi código · Tengo un código de clase».
  - Revisar en pruebas: en «Soy docente o parte del equipo escolar» el ingreso solo pide correo y contraseña, sin enlaces de código. Queda un único «Volver» arriba a la derecha para regresar a elegir rol (decidir en la pregunta 1 de la propuesta si se queda).
  - Los enlaces del estudiante que llevaban al formulario de correo ahora abren «Entrar con mi código» (pregunta 2).
- [ ] **S-05** Rediseñar por completo la distribución de botones y campos de iniciar sesión, crear cuenta y recuperar contraseña #socrates #docente · 2026-11-14 · Joaquín
- [ ] **S-06** Quitar la pantalla intermedia entre el login y la plataforma del docente: hoy aparece otra imagen y espera de 1 a 3 segundos; el paso debe ser directo y no perceptible #socrates #docente · 2026-11-14 · Joaquín
  - estado: en curso
  - aprobado: 2026-11-16 Joaquín (parte rápida)
  - rama: claude/lote-1-docente
  - Hecha la parte rápida: mientras carga ya no aparecen el panel de cuenta ni la imagen del planeta. La espera de 1 a 3 s sigue: el servidor carga espacios, clases y tablero en cadena; acortarla es el lote 8 (armazón con esqueletos y, si se acepta el costo, una instancia siempre encendida).
  - Revisar en pruebas: entrar con la cuenta +docente y mirar el paso del login al espacio docente.

## Clases y materias

- [ ] **S-07** Dejar de nombrar las materias con la nomenclatura del CNB: usar nombres claros y un nombre más comercial #socrates #docente · 2026-11-14 · Joaquín
  - Ejemplos: «Comunicación y Lenguaje L1»; L2 se llama «Inglés».
- [ ] **S-08** En Hoy, usar colores tenues por clase para distinguir cada grado y comunicar mejor #socrates #docente · 2026-11-14 · Joaquín

## Planificación

- [ ] **S-09** Que los programas educativos habilitados vivan dentro de la planificación, para que el docente decida cuándo usar cada recurso #socrates #docente · 2026-11-14 · Joaquín
- [ ] **S-10** Más adelante: alinear los programas con los indicadores del CNB que se trabajan en cada uno #socrates #docente · 2026-11-14 · Joaquín

## Estudiantes

- [ ] **S-11** Reorganizar Estudiantes por clase construida, no por grado #socrates #docente · 2026-11-14 · Joaquín
  - Hoy, para ver a sus estudiantes, el docente debe entrar a «Códigos personales · Sexto Primaria A — Para entrar desde otro dispositivo, sin correo».
  - El docente debe poder quitar de su clase a un estudiante que ingresó y no le pertenece.
- [ ] **S-12** Reorganizar cómo se comunican los estudiantes y sus códigos, con opción de cambiar el código y, si hace falta, eliminar el perfil #socrates #docente · 2026-11-14 · Joaquín
  - Mantener la sección de imprimir tarjeta: funciona muy bien.

## Progreso

- [ ] **S-13** Reducir el texto de Progreso: información concisa, por materia y por habilidades a reforzar #socrates #docente · 2026-11-14 · Joaquín
  - Hoy hay demasiado contenido y estresa: el docente no puede convertirlo en trabajo para asignar.
  - Definir qué se le comunica al docente para que lo aplique y apoye al estudiante.

## Intervenciones

- [ ] **S-14** Mejorar Intervenciones: filtros por fecha y hora del contenido dado, y actividades que se pueden reasignar para practicar #socrates #docente · 2026-11-14 · Joaquín
  - Hoy solo muestra el título.
  - Mostrar las actividades como en Planificación, para reasignar trabajo fácil y rápido.
  - Confirmar con Joaquín: en el mensaje se pegó el texto «3. Calendario · Clase compartida (opcional) · Sin clase vinculada · Vincular no cambia la clase…», que parece ser la pantalla de referencia.

## Evaluación

- [ ] **S-15** Replicar exactamente el comportamiento de Google Forms para construir evaluaciones #socrates #docente · 2026-11-14 · Joaquín
  - El docente selecciona campos y formatos de pregunta como en Google Forms.
  - Mantener la disponibilidad de horario para aplicarla, y la clase y la materia.
- [ ] **S-16** Error: la evaluación aplicada debe verse reflejada en los estudiantes asociados a la clase; hoy no ocurre #socrates #docente · 2026-11-14 · Joaquín
  - trabajado: 2026-11-15 Claude
  - aprobado: 2026-11-16 Joaquín
  - rama: claude/lote-2-evaluaciones
  - Revisar en pruebas: pasos en la propuesta «Sócrates · decisiones para seguir con las mejoras del 14-11», sección Lote 2.
  - Causa encontrada y reproducida: quien entró con código cuando la clase no tenía secciones queda sin sección; al agregar secciones y publicar para todas, esos estudiantes quedaban fuera sin aviso (la tarjeta decía 0 estudiantes).
  - Arreglado en socrates.app PR #38: publicar para todas las secciones llega a toda la clase, y una publicación sin destinatarios se rechaza con un mensaje.
  - Decidido 16-11 (pregunta 5): quien se une tarde, por cualquier vía, recibe las evaluaciones abiertas; no puede haber estudiantes sin sección (todo estudiante está en un grado y una sección). Es trabajo nuevo sobre lo aprobado; sigue pendiente la autorización para leer en producción la clase donde pasó.
