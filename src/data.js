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
const make=(id,title,year,source,abstract,doi,screen,full,reasons=[],codes=[],method='Cualitativa',ses='Implícito')=>({id,title,authors:'Equipo de investigación ficticio',year,source,doi,abstract,screen,full,reasons,fullObtained:true,codes,method,ses,notes:'Datos simulados exclusivamente con fines didácticos',isDemo:true});
export const demoProject={id:'demo-ses',title:'Eólica marina desde la perspectiva SES',question:'¿Cómo se conceptualiza la eólica marina desde la perspectiva de los sistemas socioecológicos en la literatura científica?',from:2010,to:2026,description:'PROYECTO DEMOSTRATIVO. Todas las referencias, autores, DOI y resultados son ficticios.',created:'2026-11-09',reasons:initialReasons,codes:initialCodes,searches:[
{id:'s1',source:'Web of Science',date:'2026-11-08',query:'TS=("offshore wind" AND ("social ecological" OR governance OR fisheries))',filters:'2010–2026 · artículos · inglés/español',count:7,notes:'Simulación didáctica'},
{id:'s2',source:'Scopus',date:'2026-11-08',query:'TITLE-ABS-KEY("offshore wind" AND ("social ecological" OR coastal governance))',filters:'2010–2026 · artículos',count:5,notes:'Simulación didáctica'}],
records:[
make('d1','Offshore wind and coastal fishing communities: coupled interactions',2023,'Web of Science','Estudio ilustrativo de relaciones entre pesca, ecosistemas y gobernanza marina.','10.demo/ses001','Incluir','Incluir',[],['social','ecological','institutional','interactions','fishing','scales'],'Mixta','Explícito'),
make('d2','Institutional coordination of marine renewable energy uses',2022,'Web of Science','Ejemplo de planificación marina y respuestas institucionales asociadas a cambios ecológicos.','10.demo/ses002','Incluir','Incluir',[],['social','ecological','institutional','interactions','scales'],'Cualitativa','Implícito'),
make('d3','Community perceptions and seabed habitats in offshore wind planning',2024,'Scopus','Ejemplo de percepción de pescadores vinculada con hábitats costeros y decisiones de planificación.','10.demo/ses003','Incluir','Incluir',[],['social','ecological','interactions','fishing','justice'],'Mixta','Implícito'),
make('d4','Adaptive governance around marine wind installations',2021,'Web of Science','Trabajo ficticio sobre aprendizaje, pesca y adaptación institucional.','10.demo/ses004','Incluir','Incluir',[],['social','institutional','ecological','interactions','feedback','fishing'],'Cualitativa','Explícito'),
make('d5','Multi-level interactions in offshore wind development',2025,'Scopus','Análisis simulado de regulación multinivel y efectos sobre actividades costeras.','10.demo/ses005','Incluir','Incluir',[],['social','ecological','institutional','interactions','scales','justice'],'Cualitativa','Explícito'),
make('d6','Floating turbine blade optimization',2023,'Web of Science','Optimización de palas sin interacción con actores o sistemas marinos.','10.demo/ses006','Excluir','Pendiente',['E3'],[],'Cuantitativa','No aplica'),
make('d7','Land-based wind energy landscape perception',2020,'Scopus','Percepción de eólica terrestre en paisajes rurales.','10.demo/ses007','Excluir','Pendiente',['E1'],[],'Cualitativa','No aplica'),
make('d8','Marine birds monitoring at an offshore wind farm',2024,'Web of Science','Seguimiento exclusivamente de especies, sin articulación social.','10.demo/ses008','Incluir','Excluir',['E2'],[],'Cuantitativa','No aplica'),
make('d9','Offshore wind installation cost forecasting',2022,'Scopus','Evaluación puramente económica de costes de inversión.','10.demo/ses009','Incluir','Excluir',['E3'],[],'Cuantitativa','No aplica'),
make('d10','Historical coastal electricity systems',2006,'Web of Science','Infraestructura costera anterior al periodo de revisión.','10.demo/ses010','Excluir','Pendiente',['E4'],[],'Cualitativa','No aplica'),
{...make('d11','Offshore wind and coastal fishing communities: coupled interactions',2023,'Scopus','Duplicado de una referencia presente en Web of Science.','10.demo/ses001','Pendiente','Pendiente'),duplicateOf:'d1'},
{...make('d12','Institutional coordination of marine renewable energy uses',2022,'Scopus','Duplicado de una referencia presente en Web of Science.','10.demo/ses002','Pendiente','Pendiente'),duplicateOf:'d2'}]};
export const starter=()=>({id:uid(),title:'Nueva revisión',question:'',from:2010,to:new Date().getFullYear(),description:'',created:new Date().toISOString().slice(0,10),codes:structuredClone(initialCodes),reasons:structuredClone(initialReasons),searches:[],records:[]});
