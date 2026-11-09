import {test,expect} from '@playwright/test';
import ExcelJS from 'exceljs';
import fs from 'node:fs/promises';
test('importación, cribado, SES, persistencia y exportaciones',async({page})=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(process.env.APP_URL||'http://127.0.0.1:5173');
 await page.getByRole('button',{name:'Nueva revisión'}).click();
 await page.getByLabel('Título de la revisión',{exact:true}).fill('Verificación PRISMA');
 await page.getByRole('button',{name:'Búsquedas',exact:true}).click();
 await page.locator('input[type=file]').setInputFiles([
 {name:'sample.csv',mimeType:'text/csv',buffer:Buffer.from('title,authors,year,doi\nEstudio CSV,Ana,2024,10.123/csv\nEstudio CSV,Ana,2024,https://doi.org/10.123/csv')},
 {name:'sample.ris',mimeType:'text/plain',buffer:Buffer.from('TY  - JOUR\nTI  - Estudio RIS\nAU  - Luis\nPY  - 2023\nER  - ')},
 {name:'sample.bib',mimeType:'text/plain',buffer:Buffer.from('@article{a,title={Estudio BibTeX},author={Eva},year={2022}}')}
 ]);
 await expect(page.getByRole('status')).toContainText('4 registros importados; 1 posibles duplicados');
 await page.getByRole('button',{name:'Cribado',exact:true}).click();
 await expect(page.locator('.record')).toHaveCount(4);
 await page.locator('.record').filter({hasText:'Estudio CSV'}).first().click();
 await page.locator('.decisions').first().getByRole('button',{name:'Incluir',exact:true}).click();
 await page.locator('.decisions').nth(1).getByRole('button',{name:'Incluir',exact:true}).click();
 await page.locator('.record').filter({hasText:'Estudio RIS'}).click();
 await page.locator('.decisions').first().getByRole('button',{name:'Excluir',exact:true}).click();
 await page.locator('.record').filter({hasText:'Estudio BibTeX'}).click();
 await page.locator('.decisions').first().getByRole('button',{name:'Incluir',exact:true}).click();
 await page.locator('.decisions').nth(1).getByRole('button',{name:'Excluir',exact:true}).click();
 await page.getByLabel('Razón principal de exclusión').count().catch(()=>0);
 await page.locator('.reasons select').selectOption('E2');
 await page.getByRole('button',{name:'Extracción SES',exact:true}).click();
 const row=page.locator('tbody tr');await expect(row).toHaveCount(1);
 await row.locator('select').nth(0).selectOption('Explícito');
 await row.locator('select').nth(1).selectOption('Mixta');
 await row.locator('input[type=checkbox]').first().check();
 await page.reload();await page.getByRole('button',{name:'Extracción SES',exact:true}).click();
 await expect(page.locator('tbody tr select').first()).toHaveValue('Explícito');
 await expect(page.locator('tbody input[type=checkbox]').first()).toBeChecked();
 await page.locator('.nav').getByRole('button',{name:'Exportar',exact:true}).click();
 await expect(page.locator('.svgpreview')).toContainText('Estudios incluidos en la síntesis: n = 1');
 await expect(page.locator('.svgpreview')).toContainText('cribado concluido');
 const [xlsx]=await Promise.all([page.waitForEvent('download'),page.getByRole('button',{name:'XLSX',exact:true}).click()]);
 const wb=new ExcelJS.Workbook();await wb.xlsx.readFile(await xlsx.path());
 expect(wb.worksheets).toHaveLength(7);expect(wb.getWorksheet('Registros').rowCount).toBe(5);
 expect(wb.getWorksheet('Extracción SES').getRow(2).getCell(5).value).toBe('Explícito');
 expect(wb.getWorksheet('Extracción SES').getRow(2).getCell(6).value).toBe(1);
 for(const format of ['SVG','PNG']){
 const [file]=await Promise.all([page.waitForEvent('download'),page.getByRole('button',{name:`Descargar ${format}`}).click()]);
 const bytes=await fs.readFile(await file.path());
 if(format==='SVG')expect(bytes.toString()).toContain('Estudios incluidos en la síntesis: n = 1');
 else expect(bytes.subarray(1,4).toString()).toBe('PNG');
 }
 await page.getByRole('button',{name:'Cribado',exact:true}).click();
 await page.locator('.record').filter({hasText:'Estudio CSV'}).first().click();
 await page.locator('.decisions').first().getByRole('button',{name:'Excluir',exact:true}).click();
 await page.getByRole('button',{name:'Extracción SES',exact:true}).click();
 await expect(page.locator('tbody tr')).toHaveCount(0);
 expect(errors).toEqual([]);
});
