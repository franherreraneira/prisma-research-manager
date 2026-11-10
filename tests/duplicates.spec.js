import {test,expect} from '@playwright/test';
test('busca en toda la revisión y permite revisar y marcar sin borrar',async({page})=>{
 await page.goto(process.env.APP_URL||'http://127.0.0.1:5173');await page.getByRole('button',{name:'Cribado',exact:true}).click();
 await page.evaluate(async()=>{const db=await new Promise(resolve=>{const r=indexedDB.open('prisma-research-manager');r.onsuccess=()=>resolve(r.result)});const state=await new Promise(resolve=>{const r=db.transaction('state').objectStore('state').get('main');r.onsuccess=()=>resolve(r.result)});const base=state.projects[0].records[0];state.projects[0].records=[
 {id:'a',title:'Original DOI',doi:'https://doi.org/10.1234/ABC',year:'2024'},
 {id:'b',title:'Otra escritura del original',doi:'doi:10.1234/abc',year:'2024'},
 {id:'c',title:'Participación social en pesca',doi:'',year:'2020'},
 {id:'d',title:'PARTICIPACION SOCIAL EN PESCA!',doi:'',year:'2020'},
 {id:'e',title:'Análisis de pesca costera',doi:'10.1234/uno',year:'2023'},
 {id:'f',title:'Análisis de pesca costera',doi:'10.1234/dos',year:'2023'},
 {id:'g',title:'Sin título',doi:'',year:''}
 ].map(r=>({...base,screen:'Pendiente',full:'Pendiente',duplicateOf:'',...r}));await new Promise(resolve=>{const tx=db.transaction('state','readwrite');tx.objectStore('state').put(state,'main');tx.oncomplete=resolve});db.close()});
 await page.reload();await page.getByRole('button',{name:'Cribado',exact:true}).click();
 await page.getByPlaceholder('Buscar por título, autor, DOI o resumen…').fill('sin coincidencias');
 await page.getByRole('button',{name:'Buscar duplicados',exact:true}).click();
 const panel=page.locator('.duplicatefinder');
 await expect(panel).toContainText('2 posibles duplicados por revisar');
 await expect(panel.locator('tbody tr')).toHaveCount(2);
 await expect(panel).toContainText('Mismo DOI');await expect(panel).toContainText('Mismo título y año');
 const mark=page.getByRole('button',{name:'Marcar seleccionados como duplicados (0)',exact:true});await expect(mark).toBeDisabled();
 await panel.getByRole('button',{name:'Otra escritura del original',exact:true}).click();
 await expect(page.locator('.editor').getByLabel('Título',{exact:true})).toHaveValue('Otra escritura del original');
 await panel.getByRole('checkbox',{name:'Marcar duplicado: Otra escritura del original',exact:true}).check();
 await page.getByRole('button',{name:'Marcar seleccionados como duplicados (1)',exact:true}).click();
 await expect(panel).toContainText('1 posibles duplicados por revisar · 1 ya marcados');
 await expect(page.locator('.record')).toHaveCount(7);
 await expect(page.locator('.editor').getByRole('combobox',{name:'Duplicado de',exact:true})).toHaveValue('a');
 await page.getByRole('button',{name:'Buscar duplicados',exact:true}).click();await expect(panel).toContainText('1 posibles duplicados por revisar');
 await page.getByRole('checkbox',{name:'Seleccionar todos los posibles duplicados',exact:true}).check();
 await page.getByRole('button',{name:'Marcar seleccionados como duplicados (1)',exact:true}).click();
 await expect(panel).toContainText('0 posibles duplicados por revisar · 2 ya marcados');
 await expect(panel).toContainText('No se encontraron nuevas coincidencias');
 await page.locator('.editor').getByRole('combobox',{name:'Duplicado de',exact:true}).selectOption('');
 await expect(panel).toContainText('1 posibles duplicados por revisar · 1 ya marcados');
 await page.getByRole('button',{name:'Nueva revisión'}).click();await page.getByRole('button',{name:'Cribado',exact:true}).click();
 await expect(page.getByRole('heading',{name:'Revisión de posibles duplicados',exact:true})).toHaveCount(0);
 await page.getByRole('button',{name:'Buscar duplicados',exact:true}).click();await expect(page.locator('.duplicatefinder')).toContainText('0 posibles duplicados por revisar');
});
