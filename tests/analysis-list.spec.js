import {test,expect} from './fixtures';
test('incluidos en cribado aparecen en lista, se actualizan y conservan análisis por artículo',async({page})=>{
 await page.getByRole('button',{name:'Cribado',exact:true}).click();
 // Cinco incluidos finales y uno que acaba de pasar título/resumen.
 await page.locator('.record').filter({hasText:'Floating turbine blade optimization'}).click();
 await page.locator('.decisions').first().getByRole('button',{name:'Incluir',exact:true}).click();
 await page.getByRole('button',{name:'Análisis por objetivos',exact:true}).click();
 const list=page.getByRole('list',{name:'Artículos incluidos para analizar'});
 await expect(list.getByRole('button')).toHaveCount(6);
 await list.getByRole('button').filter({hasText:'Floating turbine blade optimization'}).click();
 await expect(page.locator('.analysis-paper-title')).toHaveText('Floating turbine blade optimization');
 await expect(page.getByLabel('Artículo para análisis')).toHaveValue('d6');
 await page.getByLabel('País o región estudiada',{exact:true}).fill('Chile');
 await list.getByRole('button').filter({hasText:'Offshore wind and coastal fishing'}).click();
 await expect(page.getByLabel('País o región estudiada',{exact:true})).toHaveValue('');
 await page.getByLabel('Buscar artículo incluido').fill('blade');await expect(list.getByRole('button')).toHaveCount(1);
 await list.getByRole('button').click();await expect(page.getByLabel('País o región estudiada',{exact:true})).toHaveValue('Chile');
 await page.reload();await page.getByRole('button',{name:'Análisis por objetivos',exact:true}).click();
 await expect(list.getByRole('button')).toHaveCount(6);await list.getByRole('button').filter({hasText:'Floating turbine blade optimization'}).click();
 await expect(page.getByLabel('País o región estudiada',{exact:true})).toHaveValue('Chile');
 // El análisis preliminar no cambia la inclusión final ni los resultados.
 await page.getByRole('button',{name:'Resultados',exact:true}).click();await expect(page.getByText('Base: 5 artículos incluidos.',{exact:true})).toBeVisible();
 await page.getByRole('button',{name:'Cribado',exact:true}).click();await page.locator('.record').filter({hasText:'Floating turbine blade optimization'}).click();
 await expect(page.getByLabel('Notas / justificación')).toHaveValue('Datos simulados exclusivamente con fines didácticos');
 await page.locator('.decisions').first().getByRole('button',{name:'Excluir',exact:true}).click();
 await page.getByRole('button',{name:'Análisis por objetivos',exact:true}).click();await expect(list.getByRole('button')).toHaveCount(5);
 await expect(list).not.toContainText('Floating turbine blade optimization');
});
