import type { Workspace } from "./types";

/** Datos FICTICIOS. Las fechas son relativas a "ahora" para que el panel siempre parezca vivo. */
const ago = (minutes: number) => new Date(Date.now() - minutes * 60_000).toISOString();
const inHours = (h: number) => new Date(Date.now() + h * 3_600_000).toISOString();

export function buildMockWorkspace(): Workspace {
  return {
    projects: [
      {
        id: "socrates",
        name: "Sócrates",
        tagline: "Plataforma educativa: contenido, laboratorios y seguimiento.",
        accent: "plum",
        art: "arcos",
        metrics: [
          { label: "Tareas abiertas", value: 7 },
          { label: "Pruebas pasando", value: "212/214" },
          { label: "Por revisar", value: 3 },
        ],
        humano: [
          { id: "n1", title: "Prioridades de noviembre", excerpt: "Cerrar el flujo de volver al inicio y revisar la guía editorial antes de publicar.", updatedAt: ago(95) },
          { id: "n2", title: "Ideas para el laboratorio", excerpt: "Una escena de la cuenca con control de lluvia y predicción antes de revelar.", updatedAt: ago(60 * 26) },
        ],
        maquina: [
          { id: "j1", name: "Revisar pruebas de interfaz", schedule: "cada noche, 02:00", lastRun: ago(540), status: "warn" },
          { id: "j2", name: "Indexar contenido", schedule: "al guardar", lastRun: ago(14), status: "ok" },
          { id: "j3", name: "Respaldo a repositorio privado", schedule: "cada noche, 23:30", lastRun: ago(60 * 14), status: "ok" },
        ],
      },
      {
        id: "code-studio",
        name: "Code Studio",
        tagline: "Entorno para aprender a programar con agentes de apoyo.",
        accent: "sky",
        art: "codigo",
        metrics: [
          { label: "Agentes activos", value: 2 },
          { label: "Cambios propuestos", value: 4 },
          { label: "Builds hoy", value: 11 },
        ],
        humano: [
          { id: "n3", title: "Cómo debe sentirse el editor", excerpt: "Pocas pestañas, errores que expliquen el siguiente paso y nada que castigue.", updatedAt: ago(60 * 5) },
        ],
        maquina: [
          { id: "j4", name: "Agente de refactor", schedule: "bajo demanda", lastRun: ago(32), status: "ok" },
          { id: "j5", name: "Verificar accesibilidad", schedule: "cada build", lastRun: ago(75), status: "error" },
        ],
      },
      {
        id: "guategeeks",
        name: "GuateGeeks",
        tagline: "Comunidad, sitio web y contenido de la marca.",
        accent: "coral",
        art: "volcanes",
        metrics: [
          { label: "Publicaciones listas", value: 5 },
          { label: "Eventos próximos", value: 2 },
          { label: "Mensajes por responder", value: 9 },
        ],
        humano: [
          { id: "n4", title: "Voz de marca", excerpt: "Tuteo, cercanía y ejemplos de Guatemala. Evitar jerga innecesaria.", updatedAt: ago(60 * 48) },
          { id: "n5", title: "Evento de diciembre", excerpt: "Taller abierto de robótica con invitados de la comunidad.", updatedAt: ago(60 * 7) },
        ],
        maquina: [
          { id: "j6", name: "Resumen de menciones", schedule: "cada día, 07:00", lastRun: ago(420), status: "ok" },
          { id: "j7", name: "Borradores de publicaciones", schedule: "lunes y jueves", lastRun: ago(60 * 30), status: "idle" },
        ],
      },
      {
        id: "lab-3d",
        name: "Laboratorio 3D",
        tagline: "Experimentos web con Three.js, shaders y escenas interactivas.",
        accent: "teal",
        art: "cubos",
        metrics: [
          { label: "Experimentos", value: 6 },
          { label: "Cuadros por segundo", value: 58 },
          { label: "En pruebas", value: 2 },
        ],
        humano: [
          { id: "n6", title: "Regla del 3D", excerpt: "Solo usarlo cuando el concepto lo necesite. Siempre con versión estática.", updatedAt: ago(60 * 70) },
        ],
        maquina: [
          { id: "j8", name: "Medir rendimiento en equipo lento", schedule: "cada experimento", lastRun: ago(60 * 3), status: "warn" },
        ],
      },
    ],
    tasks: [
      { id: "t1", projectId: "socrates", title: "Revisar textos del inicio del estudiante", due: inHours(5), done: false, origin: "humano" },
      { id: "t2", projectId: "socrates", title: "Corregir 2 pruebas que fallan en tableta", due: inHours(26), done: false, origin: "maquina" },
      { id: "t3", projectId: "code-studio", title: "Aprobar cambios del agente de refactor", due: inHours(3), done: false, origin: "maquina" },
      { id: "t4", projectId: "code-studio", title: "Arreglar contraste del panel de salida", due: null, done: false, origin: "humano" },
      { id: "t5", projectId: "guategeeks", title: "Responder mensajes de la comunidad", due: inHours(8), done: false, origin: "humano" },
      { id: "t6", projectId: "guategeeks", title: "Programar publicación del taller", due: inHours(48), done: false, origin: "humano" },
      { id: "t7", projectId: "lab-3d", title: "Probar escena de montañas en teléfono lento", due: inHours(30), done: false, origin: "humano" },
      { id: "t8", projectId: "socrates", title: "Actualizar guía de estilo", due: null, done: true, origin: "humano" },
    ],
    proposals: [
      {
        id: "p1",
        projectId: "code-studio",
        title: "Extraer el panel de salida a un componente",
        summary: "El agente propone separar la lógica del panel de la presentación para poder probarlo.",
        agent: "Agente de refactor",
        createdAt: ago(32),
        risk: "bajo",
        diff: [
          { kind: "ctx", text: "export function OutputPanel({ lines }) {" },
          { kind: "del", text: "  const [open, setOpen] = useState(true);" },
          { kind: "add", text: "  const { open, toggle } = useCollapsible(true);" },
          { kind: "ctx", text: "  return <section aria-label=\"Salida\">…</section>;" },
        ],
      },
      {
        id: "p2",
        projectId: "socrates",
        title: "Mover pruebas lentas a una tarea nocturna",
        summary: "Reduce el tiempo de la revisión diaria de 9 a 3 minutos sin quitar cobertura.",
        agent: "Revisor de pruebas",
        createdAt: ago(210),
        risk: "medio",
        diff: [
          { kind: "ctx", text: "\"scripts\": {" },
          { kind: "del", text: "  \"test\": \"run-all\"," },
          { kind: "add", text: "  \"test\": \"run-fast\"," },
          { kind: "add", text: "  \"test:night\": \"run-slow\"" },
          { kind: "ctx", text: "}" },
        ],
      },
      {
        id: "p3",
        projectId: "guategeeks",
        title: "Borrador: anuncio del taller de robótica",
        summary: "Texto con tuteo y tres variantes de título. Pendiente de tu visto bueno antes de programarlo.",
        agent: "Redactor de contenido",
        createdAt: ago(60 * 6),
        risk: "bajo",
        diff: [
          { kind: "add", text: "Título A: Ven a construir tu primer robot" },
          { kind: "add", text: "Título B: Taller abierto de robótica en diciembre" },
          { kind: "add", text: "Título C: Tu comunidad también construye robots" },
        ],
      },
      {
        id: "p4",
        projectId: "lab-3d",
        title: "Reducir partículas en equipos de gama baja",
        summary: "Detecta memoria y núcleos y baja de 1000 a 240 partículas. Mantiene el mismo aspecto general.",
        agent: "Optimizador de escenas",
        createdAt: ago(60 * 9),
        risk: "alto",
        diff: [
          { kind: "del", text: "const COUNT = 1000;" },
          { kind: "add", text: "const COUNT = isLowEnd() ? 240 : 1000;" },
        ],
      },
    ],
    log: [
      { id: "l1", projectId: "code-studio", at: ago(32), actor: "ia", action: "Propuso extraer el panel de salida", detail: "3 archivos tocados, 0 aplicados." },
      { id: "l2", projectId: "socrates", at: ago(14), actor: "ia", action: "Reindexó el contenido", detail: "1.284 elementos, sin errores." },
      { id: "l3", projectId: "socrates", at: ago(540), actor: "ia", action: "Terminó la revisión nocturna con advertencias", detail: "2 pruebas fallaron en tableta." },
      { id: "l4", projectId: "guategeeks", at: ago(420), actor: "ia", action: "Resumió las menciones del día", detail: "14 menciones, 9 requieren respuesta." },
      { id: "l5", projectId: "lab-3d", at: ago(60 * 3), actor: "ia", action: "Midió el rendimiento en CPU lenta", detail: "34 cuadros por segundo con 1000 partículas." },
      { id: "l6", projectId: "guategeeks", at: ago(60 * 7), actor: "humano", action: "Escribió la nota «Evento de diciembre»" },
      { id: "l7", projectId: "code-studio", at: ago(75), actor: "ia", action: "Encontró 2 problemas de accesibilidad", detail: "Contraste bajo en el panel de salida." },
      { id: "l8", projectId: "socrates", at: ago(60 * 26), actor: "humano", action: "Anotó ideas para el laboratorio" },
    ],
    lessons: [
      { id: "a1", projectId: "socrates", text: "Mostrar el siguiente paso antes que los puntos reduce el abandono en la lección.", origin: "humano", at: ago(60 * 80) },
      { id: "a2", projectId: "code-studio", text: "Los errores que explican cómo seguir se corrigen más rápido que los que solo marcan la línea.", origin: "maquina", at: ago(60 * 40) },
      { id: "a3", projectId: "lab-3d", text: "Siempre medir en CPU lenta antes de decidir cuántas partículas dibujar.", origin: "humano", at: ago(60 * 20) },
    ],
  };
}
