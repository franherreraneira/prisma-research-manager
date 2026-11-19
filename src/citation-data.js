import {normalizeDOI} from './doi';
export const citationDOI=r=>{const doi=normalizeDOI(r.doi);return /^10\.\d{4,9}\/\S+$/i.test(doi)?doi:''};
export function localCitation(record){
 const authors=String(record.authors||'').split(/;|\s+and\s+/i).map(x=>x.trim()).filter(Boolean),warnings=[];
 const author=authors.map(name=>{const comma=name.indexOf(',');return comma>0?{family:name.slice(0,comma).trim(),given:name.slice(comma+1).trim()}:{literal:name}});
 if(authors.some(name=>!name.includes(',')))warnings.push('Verifica la forma de los nombres de autor: el registro no separa apellidos y nombres.');
 if(!authors.length)warnings.push('Faltan autores.');if(!/^\d{4}$/.test(String(record.year||'')))warnings.push('Falta el año de publicación.');if(!record.journal)warnings.push('Falta el nombre de la revista.');
 const data={id:record.id,type:'article-journal',title:record.title==='Sin título'?'':record.title||'',author,'container-title':record.journal||'',volume:record.volume||'',issue:record.issue||'',page:record.articleNumber?'':record.pages||'',number:record.articleNumber||'',DOI:citationDOI(record)};
 if(/^\d{4}$/.test(String(record.year||'')))data.issued={'date-parts':[[Number(record.year)]]};
 return {data,warnings};
}
export async function fetchCitation(doi,signal){
 const response=await fetch(`https://api.crossref.org/works/${encodeURIComponent(doi)}`,{signal});if(!response.ok)throw new Error('No se pudo completar la referencia desde Crossref.');
 const {message:w}=await response.json();if(normalizeDOI(w?.DOI)!==doi||!w?.title?.[0])throw new Error('Los metadatos no permiten verificar la referencia del DOI.');
 return {doi,retrievedAt:new Date().toISOString(),source:'Crossref',data:{id:doi,type:({'journal-article':'article-journal',book:'book','book-chapter':'chapter','proceedings-article':'paper-conference'}[w.type]||'article-journal'),title:w.title[0],author:(w.author||[]).map(a=>a.family?{family:a.family,given:a.given||'',...(a.suffix?{suffix:a.suffix}:{})}:{literal:a.name||a.given||''}).filter(a=>a.family||a.literal),'container-title':w['container-title']?.[0]||'',volume:w.volume||'',issue:w.issue||'',page:w['article-number']?'':w.page||'',number:w['article-number']||'',publisher:w.publisher||'',DOI:doi,issued:w.published||w['published-print']||w['published-online']||w.issued}};
}
