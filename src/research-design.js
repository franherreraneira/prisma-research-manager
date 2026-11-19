export const RESEARCH_QUESTION='¿De qué manera la literatura científica sobre eólica marina incorpora y analiza las interacciones socioecológicas, y qué niveles de integración presenta?';
export const OBJECTIVES=[
 'Caracterizar la literatura según su distribución temporal y geográfica.',
 'Analizar cómo se presentan las relaciones, interdependencias y retroalimentaciones entre componentes sociales, ecológicos y técnico-económicos.',
 'Comparar los niveles de integración socioecológica —sectorial, multidimensional e integrado— e identificar los principales vacíos de conocimiento.'
];
export const researchQuestion=p=>!p.question||p.question==='¿Cómo se conceptualiza la eólica marina desde la perspectiva de los sistemas socioecológicos en la literatura científica?'?RESEARCH_QUESTION:p.question;
export const integrationFields=[
 ['country','País o región estudiada','text'],['location','Localización o caso','text'],['scale','Escala espacial','text'],
 ['approach','Enfoque del estudio: cómo plantea la relación sociedad–naturaleza','textarea'],['socialDescription','Qué componentes sociales analiza','textarea'],['ecologicalDescription','Qué componentes ecológicos analiza','textarea'],['interactionMechanism','Cómo presenta los mecanismos de interacción','textarea'],
 ['social','Componentes sociales',['No informado','Sí','No']],['ecological','Componentes ecológicos',['No informado','Sí','No']],['technical','Componentes técnico-económicos',['No informado','Sí','No']],
 ['relations','Relaciones explícitas entre componentes',['No informado','Sí','No']],['direction','Dirección de las relaciones',['No informado','Unidireccional','Recíproca','Múltiples relaciones']],
 ['relationDescription','Descripción de las relaciones e interdependencias','textarea'],
 ['feedback','Retroalimentaciones analizadas',['No informado','Sí','No']],['transformation','Transformación analizada',['No informado','Sí','No']],
 ['level','Nivel de integración',['Sin clasificar','Sectorial','Multidimensional','Integrado']],
 ['rationale','Justificación del nivel de integración','textarea'],
 ['disciplines','Disciplinas participantes','text'],['interdisciplinarity','Articulación disciplinaria',['No informado','Disciplinaria','Multidisciplinaria','Interdisciplinaria']],
 ['transdisciplinarity','Participación en la construcción de conocimiento',['No informado','Sin participación no académica','Consulta a actores','Colaboración con actores','Coproducción transdisciplinaria']],
 ['natureSociety','Concepción de la relación sociedad–naturaleza','textarea'],['knowledge','Cómo se construye el conocimiento','textarea'],
 ['evidence','Fragmento de evidencia','textarea'],['pages','Página(s) de la evidencia','text'],['gaps','Vacíos y límites identificados','textarea'],['authorGaps','Vacíos declarados por los autores','textarea'],['reviewerGaps','Vacíos identificados por la revisora','textarea']
];
export function integrationWarnings(a={}){
 const warnings=[];
 if(a.level==='Integrado'&&(a.social!=='Sí'||a.ecological!=='Sí'))warnings.push('Integrado requiere componentes sociales y ecológicos identificados.');
 if(a.level==='Integrado'&&a.relations!=='Sí')warnings.push('El nivel Integrado requiere justificar relaciones explícitas; revisa el indicador y la evidencia.');
 if(a.level==='Multidimensional'&&(a.social!=='Sí'||a.ecological!=='Sí'))warnings.push('Multidimensional requiere componentes sociales y ecológicos identificados.');
 if(a.feedback==='Sí'&&a.relations!=='Sí')warnings.push('Si hay retroalimentación, comprueba y documenta las relaciones entre componentes.');
 if(a.level&&a.level!=='Sin clasificar'&&(!a.rationale?.trim()||!a.evidence?.trim()))warnings.push('Completa la justificación y el fragmento de evidencia de la clasificación.');
 return warnings;
}
