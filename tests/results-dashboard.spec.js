import {test,expect} from './fixtures';
import fs from 'node:fs/promises';
import {geography,chronology} from '../src/results-data';
test('normaliza países sin adivinar regiones y completa intervalos temporales',()=>{
 const rows=[{year:'2020',integrationAnalysis:{country:'Chile; CL; United Kingdom'}},{year:'2022',integrationAnalysis:{country:'Reino Unido; Europa'}},{year:'sin dato'}];
 const geo=geography(rows);expect(geo.places.map(p=>[p.id,p.records.length])).toEqual([['GB',2],['CL',1]]);expect(geo.unmapped).toEqual([['Europa',1]]);expect(geo.missing).toBe(1);
 expect(chronology(rows)).toEqual({missing:1,rows:[{year:2020,count:1},{year:2021,count:0},{year:2022,count:1}]});
});
test('resultados reflejan OE1–OE3 y prompt descargable del artículo',async({page})=>{
 await page.getByRole('button',{name:'Análisis por objetivos',exact:true}).click();
 await page.getByLabel('Año de publicación',{exact:true}).fill('2020');
 await page.getByLabel('País o región estudiada',{exact:true}).fill('Chile; CL; Reino Unido; Europa');
 await page.getByLabel('Relaciones explícitas entre componentes',{exact:true}).selectOption('Sí');
 await page.locator('.review-prompt summary').click();
 const prompt=page.getByLabel('Prompt de lectura por objetivos');await expect(prompt).toContainText('OE1:');await expect(prompt).toContainText('No confundas afiliación');
 const [file]=await Promise.all([page.waitForEvent('download'),page.getByRole('button',{name:'Descargar prompt',exact:true}).click()]);const content=await fs.readFile(await file.path(),'utf8');expect(content).toContain('TEXTO DEL ARTÍCULO');expect(content).toContain('E2/E3');
 await page.getByRole('button',{name:'Resultados',exact:true}).click();
 await expect(page.getByText('Sin geografía informada: 4.',{exact:false})).toBeVisible();
 await expect(page.getByRole('button',{name:'Chile: 1',exact:true})).toBeVisible();await expect(page.getByRole('button',{name:'Reino Unido: 1',exact:true})).toBeVisible();
 await expect(page.getByText('Europa: 1',{exact:true})).toBeVisible();
 await page.getByRole('button',{name:'Chile: 1 artículos',exact:true}).focus();await page.keyboard.press('Enter');await expect(page.getByRole('heading',{name:'Artículos · Chile'})).toBeVisible();
 await page.getByText('Ver datos de la serie temporal',{exact:true}).click();await expect(page.getByRole('table',{name:'Publicaciones por año'})).toContainText('2020');
 await page.getByText('Ver datos de interacciones',{exact:true}).click();await expect(page.getByRole('table',{name:'Indicadores socioecológicos'}).getByRole('row').filter({hasText:'Relaciones explícitas'})).toContainText('1');
 for(const [name,filename] of [['Descargar serie temporal PNG','serie_temporal'],['Descargar mapa de países PNG','mapa_paises']]){
  const [png]=await Promise.all([page.waitForEvent('download'),page.getByRole('button',{name,exact:true}).click()]);const bytes=await fs.readFile(await png.path());expect(png.suggestedFilename()).toContain(filename);expect(png.suggestedFilename()).toContain('_included.png');expect(bytes.subarray(0,8).toString('hex')).toBe('89504e470d0a1a0a');expect(bytes.readUInt32BE(16)).toBe(2400);expect(bytes.readUInt32BE(20)).toBeGreaterThan(700);
  const green=await page.evaluate(async data=>{const response=await fetch(`data:image/png;base64,${data}`);const bitmap=await createImageBitmap(await response.blob());const canvas=document.createElement('canvas');canvas.width=bitmap.width;canvas.height=bitmap.height;const context=canvas.getContext('2d');context.drawImage(bitmap,0,0);const pixels=context.getImageData(0,0,canvas.width,canvas.height).data;let count=0;for(let i=0;i<pixels.length;i+=4)if(pixels[i+1]>pixels[i]+15&&pixels[i+1]>pixels[i+2]+3)count++;bitmap.close();return count},bytes.toString('base64'));expect(green).toBeGreaterThan(500);
 }
 await page.getByLabel('Base de resultados').selectOption('corpus');await expect(page.getByText('Base: 10 registros sin duplicados.',{exact:true})).toBeVisible();
});
