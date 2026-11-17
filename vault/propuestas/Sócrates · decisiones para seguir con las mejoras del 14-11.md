---
proyecto: socrates
agente: Claude
creada: 2026-11-15
riesgo: medio
---

Joaquín: el lote 1 (S-01, S-02, S-04 y la parte rápida de S-06) y el lote 2 (S-16, evaluaciones que no llegaban) ya se pueden revisar en el ambiente de pruebas, y para seguir con los demás lotes hacen falta 13 decisiones tuyas. Responde debajo de cada pregunta (una línea basta) y, si un lote te convence, agrega `aprobado:` a cada mejora en `mejoras/Sócrates · experiencia docente.md`.

## Cómo revisar

- Sitio: https://socrates-pruebas.web.app. Es un Sócrates aparte, con una escuela ficticia («Escuela de Pruebas Sócrates»): nada de lo que hagas ahí toca a la escuela real.
- La franja de arriba dice qué rama y commit estás viendo. Hoy: `pruebas/lotes-1-2` (lotes 1 y 2 sobre `main`).
- Como docente: en «Soy docente o parte del equipo escolar», «Recuperar contraseña» con tu correo agregando `+docente` antes de la @ (y `+coordinacion` para coordinación). Llega un enlace para definir la contraseña.
- Como estudiante: «Entrar con mi código». Los códigos de los 20 estudiantes ficticios te los pasa Alvin por mensaje (no van en este repositorio, que es público).
- La ayuda de Geeky no está disponible en pruebas.
- Evaluación completa con el detalle técnico: `docs/mejoras/2026-11-14/EVALUACION.md` en socrates.app (PR #36).

## Lote 1 · qué revisar

- **S-01 y S-02:** la barra del espacio docente ya no tiene «Construcciones» ni «← Mi aprendizaje».
- **S-04:** el ingreso del personal solo pide correo y contraseña. Queda un «Volver» para regresar a elegir rol.
- **S-06:** al entrar ya no aparecen el panel de cuenta ni la imagen del planeta. La espera de 1 a 3 segundos sigue (ver pregunta 10 y lote 8).

## Lote 2 · qué revisar (S-16)

La causa: quien entró con código cuando su clase aún no tenía secciones quedó sin sección. Al agregar secciones y publicar para todas, esos estudiantes quedaban fuera sin aviso y la tarjeta decía «0 estudiantes».

Para comprobarlo en pruebas (Sexto A no tiene secciones, como en ese caso):

1. Con la cuenta +docente, en «Tus clases» abre Sexto A y en «Secciones» agrega A y B. Guarda.
2. En Evaluaciones crea una evaluación para Sexto A, deja marcadas las dos secciones y publícala. La tarjeta debe decir 10 estudiantes.
3. Entra como estudiante con un código de Sexto A: la evaluación debe aparecer.
4. Si publicas en una clase sin estudiantes, ahora aparece un aviso en vez de publicarse para nadie.

## Las 13 preguntas

1. **S-02/S-04 · Salida del ingreso:** sin «Mi aprendizaje» ni «Volver a elegir», dejé un único «Volver» en el ingreso del personal. ¿Se queda o no debe haber salida? ¿Aplica igual a coordinación, dirección y familias, que comparten ese ingreso?
2. **S-04 · Enlaces del estudiante:** los enlaces del estudiante que llevaban al formulario de correo ahora abren «Entrar con mi código». ¿Correcto?
3. **Vocabulario:** ¿«tema» para cada lección y «ejercicio» para cada paso? Hoy se mezclan «ejercicios», «actividades» y «actividades diferentes».
4. **E-02/E-06 · Menos texto en la lección:** ¿se retira la sesión diaria «¿Cuánto tiempo tienes?» o solo los minutos? ¿Los objetivos de la lección desaparecen o pasan al cierre o a la vista docente? ¿La versión breve aplica también a STEAM y a la vista previa docente?
5. **S-16 · Evaluaciones que no llegan:** la causa más probable es que la evaluación se envía solo a quienes estaban en la clase (y en la sección) al publicarla. ¿Quien se une tarde debe recibir las evaluaciones abiertas? ¿Y los estudiantes sin sección cuando la clase tiene secciones? ¿Autorizas una lectura, sin escritura, de la clase donde pasó en producción para confirmarlo?
6. **Nombres de materias:** ¿L1 se llama «Idioma» o «Español»? En el contenido, L2 es castellano como segundo idioma y el inglés es L3: ¿Inglés es L2 o L3?
7. **Idioma por institución:** ¿el idioma se configura por sección o por institución, y qué se muestra mientras no exista esa configuración?
8. **E-07 · Explorar antes de empezar:** la etapa «Explorar» irá entre «Empezar» y el primer ejercicio, sin reordenar ejercicios. ¿Cómo debe verse cuando el primer ejercicio ya trae su material?
9. **E-03/E-17/E-22 · Navegación del estudiante:** ¿a dónde van los pendientes que salen de Inicio? ¿Se ocultan también las 44 evaluaciones del contenido para quien aprende sin escuela? ¿Las pantallas vacías se ocultan o conservan una acción?
10. **S-03/S-05/S-06 · Ingreso docente:** ¿se quita la mascota del ingreso? ¿«Crear cuenta» sigue para todo el personal o solo se entra por invitación? Para acortar la espera, ¿aceptamos el costo de tener el servidor siempre encendido?
11. **S-11/S-12 · Quitar y eliminar estudiantes:** «quitar de la clase» y «eliminar perfil», ¿son reversibles y conservan el historial, o borran datos? ¿Los códigos deben verse en la lista sin pedirlos?
12. **S-13/S-14 · Progreso e intervenciones:** ¿«Progreso» es la mesa de revisión o «Avance del grupo»? ¿«Habilidad» es lo mismo que indicador del CNB? ¿La reasignación va a toda la sección o solo a quienes recibieron la intervención?
13. **S-08 · Color por clase:** ¿color por clase o por grado? ¿Solo en Hoy o en todo el espacio docente?

## Lotes y lo que los desbloquea

| Lote | Mejoras | Espera |
|---|---|---|
| 1 · Docente rápido | S-01, S-02, S-04, S-06 (parte rápida) | tu revisión en pruebas y preguntas 1–2 |
| 2 · Evaluaciones que no llegan | S-16 | pregunta 5 |
| 3 · Estudiante: menos texto | E-02, E-04, E-06, E-16, E-18, E-19, E-20 | preguntas 3–4 |
| 4 · Nombres de materias | S-07, E-12, E-13, E-23 | preguntas 6–7 |
| 5 · Explorar | E-01, E-10, E-11, E-14, E-15, E-21 | lote 4 |
| 6 · Reproductor | E-07, E-08, E-09 | pregunta 8 |
| 7 · Navegación del estudiante | E-03, E-17, E-22 | pregunta 9 |
| 8 · Ingreso docente | S-03, S-05, S-06 (espera) | pregunta 10 |
| 9 · Estudiantes del docente | S-11, S-12 | pregunta 11 |
| 10 · Asignar práctica | S-13, S-14 | pregunta 12 |
| 11 · Color por clase | S-08 | pregunta 13 |
| Más adelante | S-09, S-10, S-15, idioma por institución | — |
