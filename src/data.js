export const uid=()=>crypto.randomUUID();
export const stages=['Pendiente','Incluir','Excluir','Dudoso'];
export const initialCodes=[
{id:'social',label:'Componente social',help:'Actores, prácticas, percepciones o medios de vida'},
{id:'ecological',label:'Componente ecológico',help:'Hábitats, especies, recursos, procesos biofísicos'},
{id:'institutional',label:'Componente institucional',help:'Reglas, política, regulaciones o gobernanza'},
{id:'interactions',label:'Interacción socioecológica',help:'Relaciones entre sistemas humanos y biofísicos'},
{id:'scales',label:'Análisis multiescalar',help:'Escalas espaciales o temporales explícitas'},
{id:'feedback',label:'Retroalimentación',help:'Efectos recíprocos o dinámicas de feedback'},
{id:'fishing',label:'Pesca y usos del mar',help:'Coexistencia, pesca, navegación y usos marítimos'},
{id:'justice',label:'Justicia azul',help:'Distribución, reconocimiento o procedimientos'}];
export const initialReasons=[
{code:'E1',label:'Tecnología distinta de eólica marina'},
{code:'E2',label:'Sin relación socioecológica identificable'},
{code:'E3',label:'Enfoque exclusivamente técnico/biofísico'},
{code:'E4',label:'Fuera del periodo definido'},
{code:'E5',label:'Tipo documental no elegible'},
{code:'E6',label:'Idioma fuera de alcance'},
{code:'E7',label:'No responde a la pregunta de revisión'}];
export const starter=()=>({id:uid(),title:'Nueva revisión',question:'',from:2010,to:new Date().getFullYear(),description:'',created:new Date().toISOString().slice(0,10),codes:structuredClone(initialCodes),reasons:structuredClone(initialReasons),searches:[],records:[]});
