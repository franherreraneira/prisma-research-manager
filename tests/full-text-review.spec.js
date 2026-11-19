import {test,expect} from './fixtures';
import {stats} from '../src/utils';
import {automaticDuplicates} from '../src/automatic-duplicates';
import {abstractSuggestions} from '../src/abstract-preanalysis-data';
import fs from 'node:fs/promises';
import ExcelJS from 'exceljs';
test('conteos distinguen pendientes, decisiones históricas y confirmadas',()=>{
 const base={screen:'Incluir',fullObtained:true};
 const s=stats({reasons:[],records:[{...base,full:'Pendiente'},{...base,full:'Incluir'},{...base,full:'Incluir',fullReviewConfirmed:true},{...base,full:'Dudoso',fullReviewConfirmed:true}]});
 expect(s.assessed).toBe(2);expect(s.included).toBe(1);expect(s.legacy).toBe(1);expect(s.pending).toBe(3);
});
test('duplicados automáticos no borran ni reemplazan decisiones y respetan correcciones',()=>{
 const original={id:'a',doi:'10.1234/a',screen:'Incluir',full:'Pendiente',notes:'Conservar'};
 const rows=[original,{id:'b',doi:'https://doi.org/10.1234/A',screen:'Pendiente'},{id:'c',doi:'10.1234/a',screen:'Incluir',notes:'Ya revisado'},{id:'d',doi:'10.1234/a',screen:'Pendiente',duplicateOverride:true}];
 const result=automaticDuplicates(rows);expect(result).toHaveLength(4);expect(result[0]).toEqual(original);expect(result[1].duplicateOf).toBe('a');expect(result[2].duplicateOf).toBeUndefined();expect(result[3].duplicateOf).toBeUndefined();
 const dates=abstractSuggestions({year:2024,abstract:'A study in Chile between 2010 and 2020.'});expect(dates.metadataYear).toBe('2024');expect(dates.mentionedYears).toEqual(['2010','2020']);expect(dates.countries.map(c=>c.country)).toContain('Chile');
});
test('confirma decisión anterior sin borrar notas, guarda historial y valida geografía',async({page})=>{
 await page.evaluate(async()=>{const db=await new Promise(resolve=>{const req=indexedDB.open('prisma-research-manager');req.onsuccess=()=>resolve(req.result)});const state=await new Promise(resolve=>{const r=db.transaction('state').objectStore('state').get('main');r.onsuccess=()=>resolve(r.result)});const record=state.projects[0].records[0];delete record.fullReviewConfirmed;record.abstract='This study examines offshore wind in Chile between 2010 and 2020.';record.notes='Mi nota previa intacta';await new Promise(resolve=>{const tx=db.transaction('state','readwrite');tx.objectStore('state').put(state,'main');tx.oncomplete=resolve});db.close()});
 await page.reload();await page.getByRole('button',{name:'Texto completo',exact:true}).click();
 await expect(page.getByRole('list',{name:'Artículos para lectura completa'}).getByRole('button')).toHaveCount(1);
 await expect(page.getByText('Mi nota previa intacta',{exact:false})).toBeVisible();
 await expect(page.getByRole('button',{name:'Incluir en la síntesis',exact:true})).toBeDisabled();
 await page.getByLabel('Justificación de texto completo').fill('Cumple los criterios después de leer.');
 await page.getByLabel('He leído el texto completo y contrastado los criterios').check();
 await page.getByRole('button',{name:'Incluir en la síntesis',exact:true}).click();
 await page.getByLabel('Mostrar textos completos').selectOption('included');
 await page.getByRole('list',{name:'Artículos para lectura completa'}).getByRole('button').filter({hasText:'Offshore wind and coastal fishing communities'}).click();
 await expect(page.locator('.abstract-preanalysis')).toContainText('Chile');await expect(page.locator('.abstract-preanalysis')).toContainText('Año de publicación: 2023');
 await expect(page.locator('.abstract-preanalysis')).toContainText('2010, 2020');
 await page.getByLabel('País estudiado: Chile',{exact:true}).check();await page.getByRole('button',{name:'Confirmar países como lugares estudiados'}).click();
 await page.getByRole('button',{name:'Análisis por objetivos',exact:true}).click();await expect(page.getByLabel('País o región estudiada',{exact:true})).toHaveValue('Chile');
 const [file]=await Promise.all([page.waitForEvent('download'),page.getByRole('button',{name:'Respaldo',exact:true}).click()]);
 const state=JSON.parse(await fs.readFile(await file.path(),'utf8'));const record=state.projects[0].records[0];expect(record.notes).toBe('Mi nota previa intacta');expect(record.full).toBe('Incluir');expect(record.fullReviewConfirmed).toBe(true);expect(record.fullDecisionHistory[0].previous).toBe('Incluir');expect(record.fullDecisionHistory[0].previousConfirmed).toBe(false);expect(record.preAnalysis.metadataYear).toBe('2023');expect(record.integrationAnalysis.country).toBe('Chile');
 await page.locator('.nav').getByRole('button',{name:'Exportar',exact:true}).click();const [xlsx]=await Promise.all([page.waitForEvent('download'),page.getByRole('button',{name:'XLSX',exact:true}).click()]);const wb=new ExcelJS.Workbook();await wb.xlsx.readFile(await xlsx.path());const sheet=wb.getWorksheet('Registros'),headers=sheet.getRow(1).values;expect(sheet.getRow(2).getCell(headers.indexOf('Justificación texto completo')).value).toBe('Cumple los criterios después de leer.');expect(sheet.getRow(2).getCell(headers.indexOf('Decisión final confirmada')).value).toBe('Sí');
 await page.reload();await page.getByRole('button',{name:'Texto completo',exact:true}).click();await page.getByLabel('Mostrar textos completos').selectOption('included');await expect(page.getByRole('list',{name:'Artículos para lectura completa'}).getByRole('button')).toHaveCount(5);
});
