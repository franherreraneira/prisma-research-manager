import {test,expect} from './fixtures';
import fs from 'node:fs/promises';
async function drag(page,selector,dx,dy=0){const box=await page.locator(selector).boundingBox();const x=box.x+box.width/2,y=box.y+box.height/2;await page.mouse.move(x,y);await page.mouse.down();await page.mouse.move(x+dx,y+dy,{steps:8});await page.mouse.up()}
test('tarjetas con keywords importadas, gestos, deshacer y edición',async({page})=>{
 await page.goto(process.env.APP_URL||'http://127.0.0.1:5173');await page.getByRole('button',{name:'Nueva revisión',exact:true}).click();await page.getByRole('button',{name:'Búsquedas',exact:true}).click();
 await page.locator('input[type=file]').setInputFiles([
 {name:'cards.csv',mimeType:'text/csv',buffer:Buffer.from('Title,Abstract,Author Keywords\nArtículo CSV para tarjetas,Resumen CSV completo,offshore wind; marine governance')},
 {name:'cards.ris',mimeType:'text/plain',buffer:Buffer.from('TY  - JOUR\nTI  - Artículo RIS para tarjetas\nAB  - Resumen RIS completo\nKW  - fisheries\nKW  - resilience\nER  - \n')},
 {name:'cards.bib',mimeType:'text/plain',buffer:Buffer.from('@article{test,title={Artículo Bib para tarjetas},abstract={Resumen Bib completo},keywords={SES; energy}}')}
 ]);
 await page.getByRole('button',{name:'Cribado',exact:true}).click();await page.getByRole('button',{name:'Revisar título y resumen (3)',exact:true}).click();
 const title=page.locator('.swipe-card h2');await expect(title).toHaveText('Artículo CSV para tarjetas');await expect(page.locator('.swipe-abstract')).toHaveText('Resumen CSV completo');await expect(page.locator('.swipe-keywords')).toContainText('marine governance');
 // Leer o seleccionar texto del abstract no debe clasificar el artículo.
 await drag(page,'.swipe-abstract',150);await expect(title).toHaveText('Artículo CSV para tarjetas');
 await drag(page,'.swipe-handle',150);await expect(title).toHaveText('Artículo RIS para tarjetas');await expect(page.locator('.swipe-keywords')).toContainText('fisheries');await expect(page.locator('.swipe-keywords')).toContainText('resilience');
 await drag(page,'.swipe-handle',-150);await expect(title).toHaveText('Artículo Bib para tarjetas');await expect(page.locator('.swipe-keywords')).toContainText('SES');
 await page.getByRole('button',{name:'Deshacer última decisión',exact:true}).click();await expect(title).toHaveText('Artículo RIS para tarjetas');
 await drag(page,'.swipe-handle',10,150);await expect(title).toHaveText('Artículo RIS para tarjetas');
 await drag(page,'.swipe-handle',45);await expect(title).toHaveText('Artículo RIS para tarjetas');
 await page.getByRole('button',{name:'Editar ficha',exact:true}).click();await page.getByLabel('Palabras clave',{exact:true}).fill('pesca; gobernanza');await page.getByRole('button',{name:'Modo tarjetas',exact:true}).click();await expect(page.locator('.swipe-keywords')).toContainText('gobernanza');
 const [backup]=await Promise.all([page.waitForEvent('download'),page.getByRole('button',{name:'Respaldo',exact:true}).click()]);const saved=JSON.parse(await fs.readFile(await backup.path(),'utf8')).projects.at(-1);
 expect(saved.records[0].screen).toBe('Incluir');expect(saved.records[1].screen).toBe('Pendiente');expect(saved.records[1].keywords).toBe('pesca; gobernanza');
});
