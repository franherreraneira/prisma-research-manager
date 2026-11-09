import {test,expect} from '@playwright/test';
test('importa CSV Scopus, WoS y Excel conservando metadatos y abstract',async({page})=>{
 await page.goto(process.env.APP_URL||'http://127.0.0.1:5173');
 await page.getByRole('button',{name:'Nueva revisión'}).click();
 await page.getByRole('button',{name:'Búsquedas',exact:true}).click();
 const spanish='\uFEFFsep=;\r\nTítulo;Autores;Año;DOI;Resumen\r\nEstudio español;María Pérez;2022;doi:10.1234/es;Resumen en español';
 await page.locator('input[type=file]').setInputFiles([
 {name:'scopus.csv',mimeType:'text/csv',buffer:Buffer.from('Authors,Title,Year,Source title,DOI,Abstract\n"García, Ana",Estudio Scopus,2024,Marine Policy,https://doi.org/10.1234/test,"Un resumen, con coma\ny dos líneas"')},
 {name:'wos.csv',mimeType:'text/csv',buffer:Buffer.from('Article Title\tAuthor Full Names\tPublication Year\tSource Title\tDOI\tAbstract\nEstudio WoS\tJuan Pérez\t2023\tOcean Journal\t10.1234/wos\tResumen WoS')},
 {name:'excel.csv',mimeType:'text/csv',buffer:Buffer.from(spanish,'utf16le')}
 ]);
 await expect(page.getByRole('status')).toContainText('3 registros importados');
 await page.getByRole('button',{name:'Cribado',exact:true}).click();
 await expect(page.locator('.record')).toHaveCount(3);
 await page.locator('.record').filter({hasText:'Estudio Scopus'}).click();
 await expect(page.getByLabel('Autores',{exact:true})).toHaveValue('García, Ana');
 await expect(page.getByLabel('Año',{exact:true})).toHaveValue('2024');
 await expect(page.getByLabel('Fuente',{exact:true})).toHaveValue('Marine Policy');
 await expect(page.getByLabel('DOI',{exact:true})).toHaveValue('10.1234/test');
 await expect(page.getByRole('textbox',{name:'Resumen',exact:true})).toHaveValue('Un resumen, con coma\ny dos líneas');
 await page.locator('.record').filter({hasText:'Estudio WoS'}).click();
 await expect(page.getByRole('textbox',{name:'Resumen',exact:true})).toHaveValue('Resumen WoS');
 await page.locator('.record').filter({hasText:'Estudio español'}).click();
 await expect(page.getByLabel('Autores',{exact:true})).toHaveValue('María Pérez');
 await expect(page.getByLabel('DOI',{exact:true})).toHaveValue('10.1234/es');
 await page.getByRole('button',{name:'Búsquedas',exact:true}).click();
 for(const contents of ['foo,bar\nuno,dos','Title,DOI\n"Título roto,10.1234/a']){
 await page.locator('input[type=file]').setInputFiles({name:'invalid.csv',mimeType:'text/csv',buffer:Buffer.from(contents)});
 await expect(page.getByRole('status')).toContainText('0 registros importados');
 await expect(page.getByRole('status')).toContainText(contents.startsWith('foo')?'No se reconoce':'CSV mal formado');
 }
 await page.getByRole('button',{name:'Cribado',exact:true}).click();
 await expect(page.locator('.record')).toHaveCount(3);
});
