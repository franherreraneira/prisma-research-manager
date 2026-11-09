import {test,expect} from '@playwright/test';
import fs from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
test('seis plantillas, borradores independientes, respaldo y exportación',async({page})=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(process.env.APP_URL||'http://127.0.0.1:5173');
 await expect(page.locator('.nav button').nth(2)).toHaveText('Manuscrito');
 await page.getByRole('button',{name:'Manuscrito',exact:true}).click();
 for(const journal of ['marine','energy','ecology']){
 await page.getByLabel('Revista objetivo').selectOption(journal);
 for(const type of ['original','systematic']){
 await page.getByLabel('Tipo de artículo').selectOption(type);
 await page.getByRole('textbox',{name:'Título / Title',exact:true}).fill(`Título ${journal} ${type}`);
 const [word]=await Promise.all([page.waitForEvent('download'),page.getByRole('button',{name:'Descargar Word (.docx)',exact:true}).click()]);
 expect(word.suggestedFilename()).toMatch(/\.docx$/);
 const wordPath=await word.path();
 execFileSync('unzip',['-t',wordPath]);
 const xml=execFileSync('unzip',['-p',wordPath,'word/document.xml'],{encoding:'utf8'});
 expect(xml).toContain(`Título ${journal} ${type}`);
 expect(xml).toContain('Introducción / Introduction');
 expect(xml).toContain('[Pendiente]');
 expect(execFileSync('unzip',['-p',wordPath,'word/styles.xml'],{encoding:'utf8'})).toContain('Times New Roman');
 if(type==='systematic')expect(xml).toContain('Selección de estudios / Study selection');
 else expect(xml).not.toContain('Selección de estudios / Study selection');
 if(type==='systematic')await expect(page.getByRole('textbox',{name:'Selección de estudios / Study selection'})).toBeVisible();
 else await expect(page.getByRole('textbox',{name:'Selección de estudios / Study selection'})).toHaveCount(0);
 if(journal==='ecology'&&type==='systematic')await expect(page.getByText('Revisar encaje editorial:',{exact:true})).toBeVisible();
 }
 }
 await page.getByLabel('Revista objetivo').selectOption('marine');
 await page.getByLabel('Tipo de artículo').selectOption('original');
 await expect(page.getByRole('textbox',{name:'Título / Title',exact:true})).toHaveValue('Título marine original');
 await page.getByRole('textbox',{name:'Introducción / Introduction',exact:true}).fill('Mi contribución a la política marina.');
 const [writtenWord]=await Promise.all([page.waitForEvent('download'),page.getByRole('button',{name:'Descargar Word (.docx)',exact:true}).click()]);
 expect(execFileSync('unzip',['-p',await writtenWord.path(),'word/document.xml'],{encoding:'utf8'})).toContain('Mi contribución a la política marina.');
 const [file]=await Promise.all([page.waitForEvent('download'),page.getByRole('button',{name:'Descargar Markdown (.md)'}).click()]);
 const text=await fs.readFile(await file.path(),'utf8');
 expect(text).toContain('Mi contribución a la política marina.');expect(text).toContain('Marine Policy');expect(text).toContain('## Métodos / Methods');
 const [backup]=await Promise.all([page.waitForEvent('download'),page.getByRole('button',{name:'Respaldo',exact:true}).click()]);
 const json=JSON.parse(await fs.readFile(await backup.path(),'utf8'));
 expect(Object.keys(json.projects[0].manuscript.drafts)).toHaveLength(6);
 await expect.poll(()=>page.evaluate(async()=>{const db=await new Promise(resolve=>{const r=indexedDB.open('prisma-research-manager');r.onsuccess=()=>resolve(r.result)});return new Promise(resolve=>{const r=db.transaction('state').objectStore('state').get('main');r.onsuccess=()=>{db.close();resolve(r.result?.projects[0]?.manuscript?.drafts?.['marine:original']?.introduction)}})})).toBe('Mi contribución a la política marina.');
 await page.reload();await page.getByRole('button',{name:'Manuscrito',exact:true}).click();
 await expect(page.getByRole('textbox',{name:'Introducción / Introduction',exact:true})).toHaveValue('Mi contribución a la política marina.');
 await page.getByRole('button',{name:'Nueva revisión'}).click();await page.getByRole('button',{name:'Manuscrito',exact:true}).click();
 await expect(page.getByRole('textbox',{name:'Título / Title',exact:true})).toHaveValue('');
 expect(errors).toEqual([]);
});
