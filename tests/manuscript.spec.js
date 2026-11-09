import {test,expect} from '@playwright/test';
import fs from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
async function seed(page,manuscript){
 await page.goto(process.env.APP_URL||'http://127.0.0.1:5173');
 await page.getByRole('button',{name:'Manuscrito',exact:true}).waitFor();
 await page.evaluate(async manuscript=>{const db=await new Promise(resolve=>{const r=indexedDB.open('prisma-research-manager');r.onsuccess=()=>resolve(r.result)});const state=await new Promise(resolve=>{const r=db.transaction('state').objectStore('state').get('main');r.onsuccess=()=>resolve(r.result)});state.projects[0].manuscript=manuscript;await new Promise(resolve=>{const tx=db.transaction('state','readwrite');tx.objectStore('state').put(state,'main');tx.oncomplete=()=>resolve()});db.close()},manuscript);
 await page.reload();await page.getByRole('button',{name:'Manuscrito',exact:true}).click();
}
test('revisión de Ecology and Society, adaptación del ejemplo y exportación con plan visual',async({page})=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await seed(page,{journal:'marine',type:'original',drafts:{'marine:original':{title:'Mi manuscrito',introduction:'Texto anterior'},'energy:systematic':{title:'Otro borrador'}}});
 await expect(page.locator('.nav button').nth(2)).toHaveText('Manuscrito');
 await expect(page.getByRole('heading',{name:'Revisión sistemática · Ecology and Society',exact:true})).toBeVisible();
 await expect(page.getByRole('combobox',{name:'Revista objetivo'})).toHaveCount(0);
 await expect(page.getByRole('combobox',{name:'Tipo de artículo'})).toHaveCount(0);
 await expect(page.getByText('El PDF aportado pertenece a Ambio',{exact:false})).toBeVisible();
 await expect(page.getByRole('textbox',{name:'Título / Title',exact:true})).toHaveValue('Mi manuscrito');
 await expect(page.getByRole('textbox',{name:'Búsqueda bibliográfica / Literature search'})).toBeVisible();
 await expect(page.getByRole('textbox',{name:'Cribado y selección / Screening and selection'})).toBeVisible();
 await expect(page.getByRole('textbox',{name:'Figura 5 · Jerarquía de categorías',exact:true})).toBeVisible();
 await page.getByRole('textbox',{name:'Introducción / Introduction',exact:true}).fill('Síntesis propia & contribución SES.');
 await page.getByRole('textbox',{name:'Figura 2 · Marco analítico (Sankey)',exact:true}).fill('Relacionar presiones, preguntas e indicadores.');
 const [word]=await Promise.all([page.waitForEvent('download'),page.getByRole('button',{name:'Descargar Word (.docx)',exact:true}).click()]);
 expect(word.suggestedFilename()).toContain('ecology_systematic');
 execFileSync('unzip',['-t',await word.path()]);
 const xml=execFileSync('unzip',['-p',await word.path(),'word/document.xml'],{encoding:'utf8'});
 expect(xml).toContain('Síntesis propia &amp; contribución SES.');expect(xml).toContain('Ecology and Society');expect(xml).toContain('Revisión sistemática');expect(xml).toContain('Relacionar presiones, preguntas e indicadores.');expect(xml).toContain('Ambio');expect(xml).toContain('Heading2');
 const [md]=await Promise.all([page.waitForEvent('download'),page.getByRole('button',{name:'Descargar Markdown (.md)'}).click()]);
 expect(await fs.readFile(await md.path(),'utf8')).toContain('### Figura 6 · Tensiones y aportes');
 const [backup]=await Promise.all([page.waitForEvent('download'),page.getByRole('button',{name:'Respaldo',exact:true}).click()]);
 const json=JSON.parse(await fs.readFile(await backup.path(),'utf8'));
 expect(json.projects[0].manuscript.drafts['marine:original'].introduction).toBe('Texto anterior');
 expect(json.projects[0].manuscript.drafts['energy:systematic'].title).toBe('Otro borrador');
 expect(json.projects[0].manuscript.drafts['ecology:systematic'].introduction).toBe('Síntesis propia & contribución SES.');
 await expect.poll(()=>page.evaluate(async()=>{const db=await new Promise(resolve=>{const r=indexedDB.open('prisma-research-manager');r.onsuccess=()=>resolve(r.result)});return new Promise(resolve=>{const r=db.transaction('state').objectStore('state').get('main');r.onsuccess=()=>{db.close();resolve(r.result?.projects[0]?.manuscript?.drafts?.['ecology:systematic']?.introduction)}})})).toBe('Síntesis propia & contribución SES.');
 await page.reload();await page.getByRole('button',{name:'Manuscrito',exact:true}).click();
 await expect(page.getByRole('textbox',{name:'Introducción / Introduction',exact:true})).toHaveValue('Síntesis propia & contribución SES.');
 await page.getByRole('button',{name:'Nueva revisión'}).click();await page.getByRole('button',{name:'Manuscrito',exact:true}).click();
 await expect(page.getByRole('textbox',{name:'Título / Title',exact:true})).toHaveValue('');expect(errors).toEqual([]);
});
test('conserva el borrador previo de Ecology aunque hubiera otro activo',async({page})=>{
 await seed(page,{journal:'marine',type:'original',drafts:{'marine:original':{title:'Marine anterior'},'ecology:systematic':{title:'Ecology existente',results:'Resultados propios'}}});
 await expect(page.getByRole('textbox',{name:'Título / Title',exact:true})).toHaveValue('Ecology existente');
 await expect(page.getByRole('textbox',{name:'Resultados / Results',exact:true})).toHaveValue('Resultados propios');
});
