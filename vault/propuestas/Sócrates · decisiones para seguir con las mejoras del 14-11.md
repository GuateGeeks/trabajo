---
proyecto: socrates
agente: Claude
creada: 2026-11-15
riesgo: medio
---

Joaquín: el lote 1 (S-01, S-02, S-04 y la parte rápida de S-06) y el lote 2 (S-16, evaluaciones que no llegaban) ya se pueden revisar en el ambiente de pruebas, y para seguir con los demás lotes hacen falta 13 decisiones tuyas. Responde debajo de cada pregunta (una línea basta) y, si un lote te convence, agrega `aprobado:` a cada mejora en `mejoras/Sócrates · experiencia docente.md`.

## Cómo revisar

- Sitio: https://socrates-pruebas.web.app. Es un Sócrates aparte, con una escuela ficticia («Escuela de Pruebas Sócrates»): nada de lo que hagas ahí toca a la escuela real.
- La franja de arriba dice qué rama y commit estás viendo. Hoy: `pruebas/s16-lotes-4-5-9-11` (S-16 ampliado y lotes 4, 5, 9 y 11 sobre `main`, que ya tiene los lotes 1 y 2).
- Como docente: en «Soy docente o parte del equipo escolar», «Recuperar contraseña» con tu correo agregando `+docente` antes de la @ (y `+coordinacion` para coordinación). Llega un enlace para definir la contraseña.
- Como estudiante: «Entrar con mi código». Los códigos de los 20 estudiantes ficticios te los pasa Alvin por mensaje (no van en este repositorio, que es público).
- La ayuda de Geeky no está disponible en pruebas.
- Evaluación completa con el detalle técnico: `docs/mejoras/2026-11-14/EVALUACION.md` en socrates.app (PR #36).

## Lote 1 · qué revisar

- **S-01 y S-02:** la barra del espacio docente ya no tiene «Construcciones» ni «← Mi aprendizaje».
- **S-04:** el ingreso del personal solo pide correo y contraseña. Queda un «Volver» para regresar a elegir rol.
- **S-06:** al entrar ya no aparecen el panel de cuenta ni la imagen del planeta. La espera de 1 a 3 segundos sigue (ver pregunta 10 y lote 8).

## S-16 ampliado · qué revisar

Lo de producción (17-11, solo lectura): no había secciones dentro de las clases. El 14-11 la evaluación **se guardó como borrador y nunca se publicó**; el 17-11 se publicó y llegó a los 7 estudiantes. Por eso, además de tus reglas de la pregunta 5, ahora un borrador dice claramente que nadie lo ve.

La escuela de pruebas se reconstruyó el 17-11: Sexto A y Sexto B son dos clases, cada una con su sección. Los códigos de estudiante son los mismos.

1. **Borrador:** con la cuenta +docente, en Evaluaciones guarda una evaluación sin publicar. La tarjeta dice «No publicada · Tus estudiantes todavía no la ven» y tiene «Publicar». Publícala desde ahí.
2. **Llega a toda la clase:** entra con un código de Sexto A: la evaluación aparece. Ya no hay casillas de sección al publicar.
3. **Grado y sección:** en «Tus clases», crea una clase de Primaria, Sexto, sección C: el nombre se propone solo («Sexto Primaria C»). Si intentas crear otra vez Sexto A, aparece «Ya existe Sexto Primaria A…».
4. **Se ve en todas partes:** las clases muestran «Sexto Primaria · Sección A». En coordinación (+coordinacion) una clase se llama «clase», no «sección».
5. **Quien entra tarde:** con la evaluación ya publicada, entra como estudiante nuevo con el código de clase de Sexto A (está en «Tus clases»): la evaluación abierta aparece. Lo mismo pasa si coordinación crea al estudiante.

Si te convence, agrega `aprobado:` a S-16 en `mejoras/Sócrates · experiencia docente.md`. Detalle técnico: socrates.app PR #41.

## Lote 4 · qué revisar (nombres de materias)

1. **Nombres:** como estudiante (código) y como docente, las materias se llaman Idioma Materno, Segundo Idioma, Idioma Extranjero, Matemáticas, Ciencias Naturales, Ciencias Sociales, Arte, Educación Física, Productividad y Desarrollo, Formación Ciudadana y Medio Social y Natural.
2. **Contador:** en Materias, cada materia dice «3 de 160 temas» y dentro de la materia «Llevas 3 de 160 temas».
3. **Sin CNB:** en lo que ve el estudiante ya no aparecen «CNB», «Guatemala», «indicador», «competencia» ni «Tema generador». En su plan de clase dice «Meta», «Lo que practicarás» y «Contenido». La atribución del CNB sigue en Ajustes.
4. **Pendiente:** las semanas de evaluación (10, 20, 30 y 40) todavía se titulan «Evaluación: Comunicación y Lenguaje», etc. Se cambian con el lote 3, porque son lecciones ya publicadas.

Si te convence, agrega `aprobado:` a S-07, E-12, E-13 y E-23. Detalle técnico: socrates.app PR #42.

## Lote 9 · qué revisar (estudiantes del docente)

Con la cuenta +docente, en «Estudiantes»:

1. **Por clase:** el filtro dice «Clase» (Sexto Primaria · Sección A), no grado. Cada estudiante muestra su código. «Imprimir tarjetas» sigue igual.
2. **Ocultar códigos:** el botón esconde todos los códigos (también en las tarjetas) para proyectar la pantalla; «Mostrar códigos» los vuelve a mostrar.
3. **Quitar de la clase:** abre un estudiante y usa «Quitar de la clase». Pasa a «Estudiantes quitados» y su historial se conserva. «Restaurar» lo devuelve con su mismo código y recibe lo que siga abierto.
4. **Eliminar perfil:** su código deja de funcionar y sale de todas sus clases. «Restaurar» lo devuelve a esta clase.
5. **Quien entró por error:** si quitas a un estudiante de Sexto A, puede entrar a Sexto B con el código de clase de B.

Decisión para ti: hoy cualquier docente asignado a la clase, aunque dé una sola materia, puede quitar estudiantes. ¿Está bien o solo el docente principal o coordinación?

Si te convence, agrega `aprobado:` a S-11 y S-12. Detalle técnico: socrates.app PR #43.

## Lote 5 · qué revisar (Explorar y Mis materias)

Con un código de estudiante:

1. **Buscador:** en Mis materias, escribe «suma» en «¿Qué quieres aprender hoy?»: aparecen temas. Abre uno y vuelve: lo que escribiste sigue ahí.
2. **Tarjetas:** cada materia tiene una línea que dice para qué sirve, y son más bajas en el teléfono. Ya no están «Hay todo un mundo por descubrir» ni «Números, historias, naturaleza…».
3. **Laboratorios:** el Laboratorio de ideas y Construcciones están en su propia sección, después de las materias (en escuela solo Construcciones).
4. **Dentro de una materia:** cada tema muestra solo su nombre, sin «Lección N» ni minutos.
5. **Inicio:** cada actividad dice «Terminada», «A medias» o «Por empezar», con «Repasar», «Continuar» o «Empezar». En escuela, el trabajo entregado dice «Ver mi trabajo» para no reenviarlo.

## Lote 11 · qué revisar (color por clase)

Con la cuenta +docente: cada clase tiene un color tenue y siempre el mismo (Sexto A y Sexto B distintos) en Hoy, «Tus clases», Evaluaciones, Planificación, Estudiantes, Progreso e Intervenciones. El nombre de la clase siempre va al lado.

Si te convencen, agrega `aprobado:` a E-01, E-10, E-11, E-14, E-15, E-16, E-21 y S-08. Detalle técnico: socrates.app PR #45 (lote 5) y PR #44 (lote 11).

## Las 13 preguntas

Respuestas de la llamada del 16-11 debajo de cada una. Lo marcado «Pendiente» sigue abierto.

1. **S-02/S-04 · Salida del ingreso:** sin «Mi aprendizaje» ni «Volver a elegir», dejé un único «Volver» en el ingreso del personal. ¿Se queda o no debe haber salida? ¿Aplica igual a coordinación, dirección y familias, que comparten ese ingreso?
   - Respuesta (16-11): se queda el «Volver».
2. **S-04 · Enlaces del estudiante:** los enlaces del estudiante que llevaban al formulario de correo ahora abren «Entrar con mi código». ¿Correcto?
   - Respuesta (16-11): correcto.
3. **Vocabulario:** ¿«tema» para cada lección y «ejercicio» para cada paso? Hoy se mezclan «ejercicios», «actividades» y «actividades diferentes».
   - Respuesta (16-11): sí, «tema» y «ejercicio».
4. **E-02/E-06 · Menos texto en la lección:** ¿se retira la sesión diaria «¿Cuánto tiempo tienes?» o solo los minutos? ¿Los objetivos de la lección desaparecen o pasan al cierre o a la vista docente? ¿La versión breve aplica también a STEAM y a la vista previa docente?
   - Respuesta (16-11): todas las clases empiezan con una tarjeta y la lección está abajo; la lección debe ir dentro de esa tarjeta.
   - Pendiente: ¿se retira «¿Cuánto tiempo tienes?»? ¿Dónde quedan los objetivos? ¿Aplica a STEAM y a la vista previa docente?
5. **S-16 · Evaluaciones que no llegan:** la causa más probable es que la evaluación se envía solo a quienes estaban en la clase (y en la sección) al publicarla. ¿Quien se une tarde debe recibir las evaluaciones abiertas? ¿Y los estudiantes sin sección cuando la clase tiene secciones? ¿Autorizas una lectura, sin escritura, de la clase donde pasó en producción para confirmarlo?
   - Respuesta (16-11): quien entra tarde recibe las evaluaciones abiertas. No puede haber estudiantes sin sección: todo estudiante está en un grado y una sección.
   - Pendiente: autorización para la lectura en producción.
6. **Nombres de materias:** ¿L1 se llama «Idioma» o «Español»? En el contenido, L2 es castellano como segundo idioma y el inglés es L3: ¿Inglés es L2 o L3?
   - Respuesta (16-11): L1 «Idioma Materno», L2 «Segundo Idioma», L3 «Idioma Extranjero».
7. **Idioma por institución:** ¿el idioma se configura por sección o por institución, y qué se muestra mientras no exista esa configuración?
   - Respuesta (16-11): pidió más explicación.
   - Explicación: con los nombres genéricos de la pregunta 6, toda escuela ve «Segundo Idioma» e «Idioma Extranjero». Esta configuración solo hace falta si una escuela quiere ver el idioma concreto (por ejemplo «Inglés» en vez de «Idioma Extranjero», o «K'iche'» como idioma materno). La pregunta es si eso se elige una vez por escuela o puede cambiar por sección, y si mientras no se configure se muestran los nombres genéricos. Propuesta: por escuela, con los nombres genéricos por defecto, y dejarlo para más adelante.
8. **E-07 · Explorar antes de empezar:** la etapa «Explorar» irá entre «Empezar» y el primer ejercicio, sin reordenar ejercicios. ¿Cómo debe verse cuando el primer ejercicio ya trae su material?
   - Respuesta (16-11): va ligado a E-02/E-06 (la tarjeta de inicio de la clase); se diseña junto con el lote 3.
9. **E-03/E-17/E-22 · Navegación del estudiante:** ¿a dónde van los pendientes que salen de Inicio? ¿Se ocultan también las 44 evaluaciones del contenido para quien aprende sin escuela? ¿Las pantallas vacías se ocultan o conservan una acción?
   - Respuesta (16-11): E-03 está bien. E-17: los pendientes se quedan en Inicio. Las pantallas vacías se conservan, con un texto que diga que están vacías a propósito.
   - Pendiente: ¿se ocultan las 44 evaluaciones del contenido para quien aprende sin escuela?
10. **S-03/S-05/S-06 · Ingreso docente:** ¿se quita la mascota del ingreso? ¿«Crear cuenta» sigue para todo el personal o solo se entra por invitación? Para acortar la espera, ¿aceptamos el costo de tener el servidor siempre encendido?
   - Respuesta (16-11): aplicar el mismo diseño que el ingreso del estudiante.
   - Pendiente: ¿«Crear cuenta» sigue para todo el personal o solo por invitación? ¿Se acepta el costo del servidor siempre encendido?
11. **S-11/S-12 · Quitar y eliminar estudiantes:** «quitar de la clase» y «eliminar perfil», ¿son reversibles y conservan el historial, o borran datos? ¿Los códigos deben verse en la lista sin pedirlos?
   - Respuesta (16-11): son reversibles; los códigos se ven en la lista.
12. **S-13/S-14 · Progreso e intervenciones:** ¿«Progreso» es la mesa de revisión o «Avance del grupo»? ¿«Habilidad» es lo mismo que indicador del CNB? ¿La reasignación va a toda la sección o solo a quienes recibieron la intervención?
   - Respuesta (16-11): «Progreso» es el avance del grupo; «habilidad» = indicador del CNB; la reasignación va solo a quienes recibieron la intervención.
13. **S-08 · Color por clase:** ¿color por clase o por grado? ¿Solo en Hoy o en todo el espacio docente?
   - Respuesta (16-11): color por clase, en todo el espacio docente.

## Lotes y lo que los desbloquea

| Lote | Mejoras | Espera |
|---|---|---|
| 1 · Docente rápido | S-01, S-02, S-04, S-06 (parte rápida) | en producción 16-11 (S-06 solo parte rápida) |
| 2 · Evaluaciones que no llegan | S-16 | primera parte en producción 16-11; S-16 ampliado en pruebas (PR #41), espera tu revisión |
| 3 · Estudiante: menos texto | E-02, E-04, E-06, E-16, E-18, E-19, E-20 | preguntas 3–4 |
| 4 · Nombres de materias | S-07, E-12, E-13, E-23 | trabajado 21-11 (rama claude/lote-4-nombres); espera tu revisión en pruebas |
| 5 · Explorar | E-01, E-10, E-11, E-14, E-15, E-21 (+ E-16) | trabajado 22-11 (PR #45); espera tu revisión en pruebas |
| 6 · Reproductor | E-07, E-08, E-09 | pregunta 8 |
| 7 · Navegación del estudiante | E-03, E-17, E-22 | pregunta 9 |
| 8 · Ingreso docente | S-03, S-05, S-06 (espera) | pregunta 10 |
| 9 · Estudiantes del docente | S-11, S-12 | trabajado 22-11 (PR #43); espera tu revisión en pruebas |
| 10 · Asignar práctica | S-13, S-14 | pregunta 12 |
| 11 · Color por clase | S-08 | trabajado 22-11 (PR #44); espera tu revisión en pruebas |
| Más adelante | S-09, S-10, S-15, idioma por institución | — |
