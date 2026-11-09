import Papa from 'papaparse';
import {normalizeDOI} from './doi';
const key = value => String(value).replace(/^\uFEFF/, '').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/g, '');
const aliases = {
 title: ['title','article title','document title','primary title','titulo','titulo del articulo','TI','T1'],
 authors: ['authors','author','author full names','autores','autor','AU','AF','A1'],
 year: ['year','publication year','pub year','ano','ano de publicacion','fecha de publicacion','PY','Y1'],
 doi: ['doi','document doi','article doi','DO','identificador doi'],
 abstract: ['abstract','abstract note','abstracts','resumen','resumo','AB','N2'],
 source: ['source','database','base de datos','fuente','source title','publication title','journal','journal title','revista','SO','JO','T2']
};
export function mapBibliographicFields(row) {
 const fields = new Map(Object.entries(row).map(([name,value])=>[key(name),value]));
 return Object.fromEntries(Object.entries(aliases).map(([name,names])=>[name,names.map(alias=>fields.get(key(alias))).find(value=>String(value??'').trim())||'']));
}
export function normalizeRecord(row) {
 const o=mapBibliographicFields(row);
 return {id:crypto.randomUUID(),title:String(o.title||'Sin título').trim(),authors:String(o.authors).trim(),year:String(o.year).match(/\d{4}/)?.[0]||'',source:String(o.source||'Importación').trim(),doi:normalizeDOI(o.doi),abstract:String(o.abstract).trim(),screen:'Pendiente',full:'Pendiente',reasons:[],fullObtained:true,codes:[],method:'Sin codificar',ses:'Sin codificar',notes:'',isDemo:false};
}
export function parseCSV(input) {
 let text=String(input).replace(/^\uFEFF/,'');
 const separator=text.match(/^sep=(.)\s*\r?\n/i);
 if(separator)text=text.slice(separator[0].length);
 if(!text.trim())throw new Error('El CSV está vacío.');
 const parsed=Papa.parse(text,{header:true,skipEmptyLines:'greedy',delimiter:separator?.[1]||'',delimitersToGuess:[',',';','\t','|'],transformHeader:header=>header.trim()});
 const serious=parsed.errors.filter(error=>error.code!=='UndetectableDelimiter');
 if(serious.length){const error=serious[0];throw new Error(`CSV mal formado${Number.isInteger(error.row)?` en la fila de datos ${error.row+1}`:''}: revisa las comillas y el separador (${error.code}).`)}
 const headers=parsed.meta.fields||[];
 if(!headers.some(header=>[...aliases.title,...aliases.doi].some(alias=>key(alias)===key(header))))throw new Error('No se reconoce una columna de título o DOI. Usa Title, Article Title, Título o DOI en la primera fila.');
 const valid=parsed.data.filter(row=>{const fields=mapBibliographicFields(row);return String(fields.title||fields.doi).trim()});
 if(valid.length!==parsed.data.length)throw new Error('Hay filas sin título ni DOI. Corrige o elimina esas filas antes de importar.');
 if(!valid.length)throw new Error('El CSV contiene encabezados, pero no referencias.');
 return valid.map(normalizeRecord);
}
export async function readBibliographicFile(file) {
 const bytes=new Uint8Array(await file.arrayBuffer());
 let encoding='utf-8';
 if(bytes[0]===0xff&&bytes[1]===0xfe)encoding='utf-16le';
 else if(bytes[0]===0xfe&&bytes[1]===0xff)encoding='utf-16be';
 try{return new TextDecoder(encoding,{fatal:true}).decode(bytes)}catch{return new TextDecoder('windows-1252').decode(bytes)}
}
