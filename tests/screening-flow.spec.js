import {test,expect} from './fixtures';
async function prepare(page){
 await page.goto(process.env.APP_URL||'http://127.0.0.1:5173');
 await page.evaluate(async()=>{const db=await new Promise(resolve=>{const r=indexedDB.open('prisma-research-manager');r.onsuccess=()=>resolve(r.result)});const state=await new Promise(resolve=>{const r=db.transaction('state').objectStore('state').get('main');r.onsuccess=()=>resolve(r.result)});state.projects[0].records=state.projects[0].records.map((r,i)=>i<3?{...r,screen:'Pendiente',full:'Pendiente',reasons:[]}:i<5?{...r,screen:'Incluir',full:'Pendiente',reasons:[]}:r);await new Promise(resolve=>{const tx=db.transaction('state','readwrite');tx.objectStore('state').put(state,'main');tx.oncomplete=resolve});db.close()});
 await page.reload();await page.getByRole('button',{name:'Cribado',exact:true}).click();
}
test('cola por etapa, atajos seguros, avance automático, motivo y deshacer',async({page})=>{
 await prepare(page);
 await page.getByRole('button',{name:'Revisar título y resumen (3)',exact:true}).click();
 await expect(page.locator('.record')).toHaveCount(3);
 await expect(page.locator('.swipe-card h2')).toHaveText('Offshore wind and coastal fishing communities: coupled interactions');
 const nav=page.locator('.review-navigation');
 await page.getByLabel('Avanzar al siguiente pendiente al decidir',{exact:true}).check();
 await page.locator('.swipe-card h2').click();await page.keyboard.press('i');
 await expect(page.locator('.swipe-card h2')).toHaveText('Institutional coordination of marine renewable energy uses');
 await expect(page.locator('.record')).toHaveCount(2);
 await page.keyboard.press('e');
 await expect(page.locator('.swipe-card h2')).toHaveText('Community perceptions and seabed habitats in offshore wind planning');
 await page.getByRole('button',{name:'Deshacer última decisión',exact:true}).click();
 await expect(page.locator('.swipe-card h2')).toHaveText('Institutional coordination of marine renewable energy uses');
 await expect(page.getByLabel('Notas / justificación',{exact:true})).toBeVisible();
 await page.getByLabel('Notas / justificación',{exact:true}).fill('');await page.getByLabel('Notas / justificación',{exact:true}).pressSequentially('i e d');
 await expect(page.locator('.swipe-card h2')).toHaveText('Institutional coordination of marine renewable energy uses');
 await page.getByRole('button',{name:'Revisar texto completo (3)',exact:true}).click();
 await expect(page.locator('.swipe-card h2')).toHaveText('Offshore wind and coastal fishing communities: coupled interactions');
 await page.locator('.swipe-card').getByRole('button',{name:'← Excluir',exact:true}).click();
 await expect(page.locator('.swipe-card h2')).toHaveText('Offshore wind and coastal fishing communities: coupled interactions');
 await expect(page.getByRole('status')).toContainText('Selecciona un motivo principal');
 await nav.getByRole('combobox',{name:'Razón principal de exclusión',exact:true}).selectOption('E2');
 await expect(page.locator('.swipe-card h2')).toHaveText('Adaptive governance around marine wind installations');
 await page.getByRole('button',{name:'Deshacer última decisión',exact:true}).click();
 await expect(page.locator('.swipe-card h2')).toHaveText('Offshore wind and coastal fishing communities: coupled interactions');
 await expect(page.getByLabel('Notas / justificación',{exact:true})).toBeVisible();
 await expect(nav.getByRole('combobox',{name:'Razón principal de exclusión',exact:true})).toHaveCount(0);
 await page.getByRole('button',{name:'Nueva revisión',exact:true}).click();await page.getByRole('button',{name:'Cribado',exact:true}).click();
 await expect(page.getByRole('button',{name:'Deshacer última decisión',exact:true})).toBeDisabled();
});
test('revisión en móvil sin desbordamiento y criterios accesibles',async({page})=>{
 await page.setViewportSize({width:390,height:844});await prepare(page);
 await page.getByRole('button',{name:'Revisar título y resumen (3)',exact:true}).click();
 const nav=page.locator('.review-navigation');
 await expect(page.locator('.swipe-card').getByRole('button',{name:'Incluir →',exact:true})).toBeVisible();
 await page.getByLabel('Avanzar al siguiente pendiente al decidir',{exact:true}).uncheck();
 await nav.getByText('Ver criterios y palabras clave',{exact:true}).click();
 await expect(nav.getByRole('region',{name:'Criterios para título y resumen',exact:true})).toContainText('E1');
 await expect.poll(()=>page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBe(true);
 await expect(page.locator('.swipe-card h2')).toBeVisible();
 await page.locator('.swipe-card').getByRole('button',{name:'Incluir →',exact:true}).click();
 await nav.getByRole('button',{name:'Siguiente →',exact:true}).click();
 await expect(page.locator('.swipe-card h2')).toHaveText('Institutional coordination of marine renewable energy uses');
 await page.getByRole('combobox',{name:'Estado de los registros',exact:true}).selectOption('Duplicados');await expect(page.locator('.record')).toHaveCount(2);
 await page.getByRole('button',{name:'Nuevo registro',exact:true}).click();await expect(page.getByLabel('Título',{exact:true})).toHaveValue('');await expect(page.getByRole('combobox',{name:'Estado de los registros',exact:true})).toHaveValue('Todos');
});

test('el avance automático respeta la búsqueda activa',async({page})=>{
 await prepare(page);await page.getByRole('button',{name:'Revisar título y resumen (3)',exact:true}).click();
 await page.getByPlaceholder('Buscar por título, autor, DOI o resumen…').fill('Institutional coordination');
 await page.getByRole('button',{name:'Vista de ficha',exact:true}).click();await page.locator('.record').click();await page.getByRole('button',{name:'Modo tarjetas',exact:true}).click();await page.getByLabel('Avanzar al siguiente pendiente al decidir',{exact:true}).check();
 await page.locator('.swipe-card').getByRole('button',{name:'Incluir →',exact:true}).click();
 await expect(page.locator('.record')).toHaveCount(0);await expect(page.locator('.swipe-card')).toHaveCount(0);
 await expect(page.getByRole('status')).toContainText('en esta búsqueda y etapa');
 await page.getByPlaceholder('Buscar por título, autor, DOI o resumen…').fill('');await expect(page.locator('.record')).toHaveCount(2);
});
