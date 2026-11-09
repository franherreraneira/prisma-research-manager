export const example={title:'Towards improved ecosystem service assessments in marine systems: A systematic review and evaluation of effectiveness',authors:'Socrate y colegas',journal:'Ambio',year:'2026',doi:'10.1007/s13280-025-02299-2'};
export const profile={name:'Ecology and Society',guide:'https://ecologyandsociety.org/submissions/',policy:'https://ecologyandsociety.org/policies/'};
const s=(id,title,hint,level=1)=>({id,title,hint,level});
export const reviewSections=[
 s('title','Título / Title','Identifica el objeto de estudio, el aporte socioecológico y el carácter sistemático de la revisión.'),
 s('abstract','Resumen / Abstract','Sintetiza problema, objetivo, búsqueda y selección, corpus, hallazgos y contribución. Redacta a partir de resultados reales.'),
 s('keywords','Palabras clave / Keywords','Selecciona términos de búsqueda que complementen el título.'),
 s('introduction','Introducción / Introduction','Conecta el problema socioecológico con la literatura, identifica la brecha y justifica la revisión. Cierra con el objetivo y preguntas que luego ordenen los resultados.'),
 s('questions','Preguntas y contribución / Research questions','Enumera preguntas contestables. Para cada una, especifica qué evidencia, comparación o síntesis permitirá responderla.',2),
 s('framework','Marco conceptual / Conceptual framework','Explicita conceptos SES, escalas, actores y relaciones sociedad–ecosistemas. Puede integrarse en la introducción.',2),
 s('methods','Métodos / Methods','Presenta el diseño de revisión, protocolo o registro si existe, cambios al protocolo y estrategia de transparencia. No atribuyas doble cribado o uso de IA si no se realizaron.'),
 s('scope','Ámbito y unidades de análisis / Scope','Define contexto, regiones o sectores cuando corresponda. Distingue artículos, estudios y casos; un artículo puede aportar varios casos.',2),
 s('search','Búsqueda bibliográfica / Literature search','Describe bases, fechas, idiomas, cadenas completas, periodo, criterios de inclusión y exclusión. Registra la estrategia reproducible en un anexo.',2),
 s('selection','Cribado y selección / Screening and selection','Describe deduplicación, cribado por título/resumen y texto completo, revisores y resolución de discrepancias. Vincula los conteos con PRISMA (Figura 1); informa motivos de exclusión.',2),
 s('extraction','Extracción y categorización / Data extraction','Explica variables, definiciones operacionales, categorías múltiples, codificación, validación y tratamiento de datos faltantes. Vincula las variables SES con las preguntas de revisión.',2),
 s('analysis','Análisis y síntesis / Data analysis','Explica estadística descriptiva y síntesis temática o conceptual, unidades de conteo, denominadores y comparaciones. Justifica categorías, decisiones y software.',2),
 s('evaluation','Marco de evaluación / Evaluation framework','Si vas a evaluar calidad, integración SES o efectividad, justifica criterios, preguntas, reglas y validación. La evaluación de efectividad del ejemplo es opcional y distinta de evaluar calidad metodológica.',2),
 s('results','Resultados / Results','Organiza la evidencia según las preguntas. Reporta primero el corpus y luego patrones, comparaciones y síntesis. Vincula cada figura con un hallazgo verificable.'),
 s('corpus','Caracterización del corpus / Evidence base','Presenta estudios y casos, años, localización o sectores, enfoques y tipos de datos. Distingue falta de información de ausencia de una característica.',2),
 s('patterns','Patrones y comparaciones / Patterns','Compara categorías pertinentes a tu pregunta: métodos, dimensiones SES, regiones, actividades o escalas. Usa barras y tablas; explica cuándo un estudio cuenta en varias categorías.',2),
 s('synthesis','Síntesis integradora / Integrative synthesis','Integra patrones, tensiones, vacíos y relaciones socioecológicas. Si hay evaluación propia, presenta resultados con criterios trazables. No reduzcas la contribución a enumerar frecuencias.',2),
 s('discussion','Discusión / Discussion','Responde las preguntas, contrasta explicaciones y literatura e identifica qué cambia la síntesis en la comprensión de los sistemas socioecológicos.'),
 s('implications','Implicaciones socioecológicas / Implications','Explica consecuencias para teoría, gobernanza, gestión y futuras investigaciones. Distingue propuestas de inferencias respaldadas por el corpus.',2),
 s('limitations','Limitaciones / Limitations','Discute cobertura, idiomas, sesgos, heterogeneidad, decisiones de codificación y transferibilidad. No generalices desde celdas escasas o datos faltantes.',2),
 s('conclusion','Conclusión / Conclusion','Resume la respuesta y la contribución integradora. Evita repetir todas las frecuencias o introducir resultados nuevos.'),
 s('declarations','Declaraciones / Declarations','Prepara contribuciones, financiamiento, conflictos, ética si corresponde, agradecimientos y disponibilidad de datos y código. Revisa anonimización y requisitos editoriales.'),
 s('references','Referencias / Literature Cited','Comprueba correspondencia entre citas y referencias y estilo de la revista. El ejemplo es una referencia de estructura, no evidencia de tu revisión.'),
 s('supplement','Anexos / Supplementary material','Planifica estrategias completas; listado del corpus; exclusiones y motivos; diccionario de extracción; matriz de datos; reglas de evaluación si aplica; checklist PRISMA con ubicación de ítems.')
];
export const figurePlan=[
 {id:'fig-prisma',title:'Figura 1 · Flujo PRISMA',kind:'Flujo de selección',page:5,hint:'Datos: identificados, duplicados, decisiones, no recuperados y exclusiones. Ubicación: selección. Ya puedes generarlo en Exportar; revisa la distinción entre registros, informes y estudios.'},
 {id:'fig-sankey',title:'Figura 2 · Marco analítico (Sankey)',kind:'Problemas → preguntas → criterios',page:8,hint:'Datos: relaciones explícitas entre conceptos, preguntas y criterios de tu marco. Ubicación: métodos. Si los enlaces son conceptuales, no presentes su grosor como frecuencia de estudios.'},
 {id:'fig-comparison',title:'Figura 3 · Comparación del corpus',kind:'Barras agrupadas o paneles',page:9,hint:'Datos: enfoques, temas o tipos de datos cruzados por región, sector u otro grupo. Ubicación: caracterización. Informa n y la unidad de conteo; no impongas regiones si tu pregunta no las necesita.'},
 {id:'fig-dimensions',title:'Figura 4 · Dimensiones conceptuales',kind:'Barras por dimensión y grupo',page:10,hint:'Datos: presencia de dimensiones SES en estudios incluidos y grupos de comparación. Ubicación: patrones. Permite categorías coexistentes e informa si los porcentajes pueden sumar más de 100 %.'},
 {id:'fig-sunburst',title:'Figura 5 · Jerarquía de categorías',kind:'Sunburst o tabla jerárquica',page:11,hint:'Datos: jerarquía definida, por ejemplo contexto → método → actividad, con conteos y regla de asignación. Ubicación: patrones. Evita sumar categorías superpuestas como si fueran partes de un total.'},
 {id:'fig-strengths',title:'Figura 6 · Tensiones y aportes',kind:'Barras apiladas o matriz',page:13,hint:'Datos: desafíos y fortalezas codificados por método o grupo, con denominadores explícitos. Ubicación: síntesis. Usa proporciones apiladas solo si las categorías y el denominador lo justifican.'}
];
export function activeReviewDraft(state={}){
 if(state.drafts?.['ecology:systematic'])return state.drafts['ecology:systematic'];
 const previous=state.drafts?.[`${state.journal||'marine'}:${state.type||'original'}`];
 return previous||{};
}
