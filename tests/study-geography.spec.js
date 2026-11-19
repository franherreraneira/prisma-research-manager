import {test,expect} from './fixtures';
import {geography} from '../src/results-data';
import fs from 'node:fs/promises';
import ExcelJS from 'exceljs';
test('áreas marinas se cuentan sin inferir países ni duplicar un artículo',()=>{
 const data=geography([{id:'a',integrationAnalysis:{marineAreas:'Mar del Norte; MAR DEL NORTE; océano Atlántico'}},{id:'b',integrationAnalysis:{marineAreas:'Mar del Norte'}}]);expect(data.places).toHaveLength(0);expect(data.missing).toBe(2);expect(data.marineAreas).toEqual([{name:'Mar del Norte',count:2},{name:'océano Atlántico',count:1}]);
});
test('varios países y mares se conservan por artículo y llegan a resultados y exportaciones',async({page})=>{
 await page.getByRole('button',{name:'Análisis por objetivos',exact:true}).click();
 await page.getByLabel('País o región estudiada',{exact:true}).fill('Chile');
 await page.getByRole('button',{name:'+ Añadir otro país estudiado',exact:true}).click();await page.getByLabel('País estudiado 2',{exact:true}).fill('España');
 await page.getByRole('button',{name:'+ Añadir otro país estudiado',exact:true}).click();await page.getByLabel('País estudiado 3',{exact:true}).fill('Reino Unido');
 await page.getByRole('button',{name:'Quitar país 2',exact:true}).click();await expect(page.getByLabel('País estudiado 2',{exact:true})).toHaveValue('Reino Unido');
 await page.getByLabel('Mares, océanos o regiones marinas estudiadas',{exact:true}).fill('Mar del Norte; océano Atlántico');
 await page.getByLabel('Artículo para análisis',{exact:true}).selectOption('d2');await expect(page.getByLabel('Mares, océanos o regiones marinas estudiadas',{exact:true})).toHaveValue('');await page.getByLabel('País o región estudiada',{exact:true}).fill('Reino Unido');await page.getByLabel('Mares, océanos o regiones marinas estudiadas',{exact:true}).fill('Mar del Norte; MAR DEL NORTE');
 await page.reload();await page.getByRole('button',{name:'Análisis por objetivos',exact:true}).click();await expect(page.getByLabel('País o región estudiada',{exact:true})).toHaveValue('Chile');await expect(page.getByLabel('País estudiado 2',{exact:true})).toHaveValue('Reino Unido');await expect(page.getByLabel('Mares, océanos o regiones marinas estudiadas',{exact:true})).toHaveValue('Mar del Norte; océano Atlántico');
 await page.getByRole('button',{name:'Resultados',exact:true}).click();await expect(page.getByRole('button',{name:'Chile: 1',exact:true})).toBeVisible();await expect(page.getByRole('button',{name:'Reino Unido: 2',exact:true})).toBeVisible();const marine=page.getByRole('region',{name:'Áreas marinas estudiadas',exact:true});await expect(marine).toContainText('Mar del Norte: 2');await expect(marine).toContainText('océano Atlántico: 1');
 const [backup]=await Promise.all([page.waitForEvent('download'),page.getByRole('button',{name:'Respaldo',exact:true}).click()]);const record=JSON.parse(await fs.readFile(await backup.path(),'utf8')).projects[0].records[0];expect(record.integrationAnalysis.country).toBe('Chile; Reino Unido');expect(record.integrationAnalysis.marineAreas).toBe('Mar del Norte; océano Atlántico');expect(record.notes).toBe('Datos simulados exclusivamente con fines didácticos');
 await page.locator('.nav').getByRole('button',{name:'Exportar',exact:true}).click();const [file]=await Promise.all([page.waitForEvent('download'),page.getByRole('button',{name:'XLSX',exact:true}).click()]);const wb=new ExcelJS.Workbook();await wb.xlsx.readFile(await file.path());const sheet=wb.getWorksheet('Análisis por objetivos'),headers=sheet.getRow(1).values;expect(sheet.getRow(2).getCell(headers.indexOf('País o región estudiada')).value).toBe('Chile; Reino Unido');expect(sheet.getRow(2).getCell(headers.indexOf('Mares, océanos o regiones marinas estudiadas')).value).toBe('Mar del Norte; océano Atlántico');
});
