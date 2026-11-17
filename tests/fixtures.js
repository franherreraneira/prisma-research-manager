import {test as base,expect} from '@playwright/test';
import {demoProject} from './demo-project';
export const test=base.extend({page:async({page},use)=>{
 await page.goto(process.env.APP_URL||'http://127.0.0.1:5173');
 await page.getByRole('button',{name:'Cribado',exact:true}).waitFor();
 await page.evaluate(async project=>{const db=await new Promise(resolve=>{const req=indexedDB.open('prisma-research-manager');req.onsuccess=()=>resolve(req.result)});await new Promise(resolve=>{const tx=db.transaction('state','readwrite');tx.objectStore('state').put({projects:[project],active:project.id,demoCleanupVersion:1},'main');tx.oncomplete=()=>resolve()});db.close()},structuredClone(demoProject));
 await page.reload();
 await use(page);
}});
export {expect};
