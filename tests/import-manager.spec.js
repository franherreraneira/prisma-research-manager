import {test,expect} from '@playwright/test';
import {demoProject} from './demo-project';
import fs from 'node:fs/promises';
test('inicio vacío, cargas con igual nombre, borrado por lote y vaciado por revisión',async({page})=>{
 await page.goto(process.env.APP_URL||'http://127.0.0.1:5173');await page.getByRole('button',{name:'Cribado',exact:true}).click();await expect(page.locator('.record')).toHaveCount(0);
 const active=await page.locator('.projectchoose select').inputValue();
 await page.getByRole('button',{name:'Búsquedas',exact:true}).click();
 await page.getByRole('button',{name:'Añadir búsqueda',exact:true}).click();
 for(let i=0;i<2;i++)await page.locator('input[type=file]').setInputFiles({name:'same.csv',mimeType:'text/csv',buffer:Buffer.from('Title,DOI,Source title\nUn estudio sobre eólica marina,10.1234/a,Marine Journal')});
 const manager=page.locator('.import-manager');await expect(manager.locator('li')).toHaveCount(2);
 page.once('dialog',d=>d.dismiss());await manager.getByRole('button',{name:'Eliminar esta carga',exact:true}).first().click();await expect(manager.locator('li')).toHaveCount(2);
 page.once('dialog',d=>d.accept());await manager.getByRole('button',{name:'Eliminar esta carga',exact:true}).first().click();await expect(manager.locator('li')).toHaveCount(1);
 await page.getByRole('button',{name:'Cribado',exact:true}).click();await expect(page.locator('.record')).toHaveCount(1);await expect(page.locator('.record .chip.amber')).toHaveCount(0);
 await page.getByRole('button',{name:'Nueva revisión',exact:true}).click();await page.getByRole('button',{name:'Cribado',exact:true}).click();await page.getByRole('button',{name:'Nuevo registro',exact:true}).click();await page.getByLabel('Título',{exact:true}).fill('Registro de otra revisión');
 await page.locator('.projectchoose select').selectOption(active);await page.getByRole('button',{name:'Búsquedas',exact:true}).click();
 await expect(manager.locator('li')).toHaveCount(1);
 page.once('dialog',d=>d.accept());await manager.getByRole('button',{name:'Eliminar todos los registros de esta revisión',exact:true}).click();await expect(manager.locator('li')).toHaveCount(0);
 await expect(page.locator('tbody tr')).toHaveCount(1); // conserva la búsqueda documentada
 const [backup]=await Promise.all([page.waitForEvent('download'),page.getByRole('button',{name:'Respaldo',exact:true}).click()]);const state=JSON.parse(await fs.readFile(await backup.path(),'utf8'));
 expect(state.projects.find(p=>p.id===active).records).toHaveLength(0);expect(state.projects.find(p=>p.id!==active).records).toHaveLength(1);
 await page.reload();await page.getByRole('button',{name:'Cribado',exact:true}).click();await expect(page.locator('.record')).toHaveCount(0);
});
test('retira solo registros demostrativos y preserva referencias reales y protocolo',async({page})=>{
 await page.goto(process.env.APP_URL||'http://127.0.0.1:5173');await page.getByRole('button',{name:'Cribado',exact:true}).waitFor();
 const project=structuredClone(demoProject);project.records.push({...project.records[0],id:'real',isDemo:false,title:'Mi referencia real',duplicateOf:'d1',notes:'Mi nota de extracción'});project.inclusionCriteria=[{id:'i1',label:'Mi criterio',keywords:'wind'}];project.manuscript={drafts:{'ecology:systematic':{title:'Mi manuscrito'}}};
 await page.evaluate(async project=>{const db=await new Promise(resolve=>{const req=indexedDB.open('prisma-research-manager');req.onsuccess=()=>resolve(req.result)});await new Promise(resolve=>{const tx=db.transaction('state','readwrite');tx.objectStore('state').put({projects:[project],active:project.id},'main');tx.oncomplete=resolve});db.close()},project);
 await page.reload();await page.getByRole('button',{name:'Cribado',exact:true}).click();await expect(page.locator('.record')).toHaveCount(1);await expect(page.locator('.record')).toContainText('Mi referencia real');await expect(page.locator('.record .chip.amber')).toHaveCount(0);
 await page.getByRole('button',{name:'Búsquedas',exact:true}).click();await expect(page.locator('.import-manager')).toContainText('1 registros sin archivo de carga identificado');
 const [backup]=await Promise.all([page.waitForEvent('download'),page.getByRole('button',{name:'Respaldo',exact:true}).click()]);const saved=JSON.parse(await fs.readFile(await backup.path(),'utf8')).projects[0];expect(saved.records).toHaveLength(1);expect(saved.records[0].notes).toBe('Mi nota de extracción');expect(saved.inclusionCriteria[0].label).toBe('Mi criterio');expect(saved.manuscript.drafts['ecology:systematic'].title).toBe('Mi manuscrito');
 await page.reload();await page.getByRole('button',{name:'Cribado',exact:true}).click();await expect(page.locator('.record')).toHaveCount(1);
});
