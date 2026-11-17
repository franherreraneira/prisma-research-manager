import React from 'react';
import {normalizeDOI} from './doi';
export function doiURL(value){let doi=normalizeDOI(value);try{doi=decodeURIComponent(doi)}catch{return ''}if(!/^10\.\d{4,9}\/\S+$/i.test(doi))return '';return `https://doi.org/${doi.split('/').map(encodeURIComponent).join('/')}`}
export function readingURL(value){try{const url=new URL(String(value||'').trim());return ['http:','https:'].includes(url.protocol)&&!url.username&&!url.password?url.href:''}catch{return ''}}
export function DocumentAccess({record}){
 const doi=doiURL(record.doi),reading=readingURL(record.documentUrl),search=String(record.title||'').trim();
 return <div className="document-access" role="group" aria-label="Acceso al documento"><div className="document-links">{doi&&<a className="btn primary" href={doi} target="_blank" rel="noopener noreferrer">Abrir artículo por DOI ↗</a>}{reading&&<a className="btn light" href={reading} target="_blank" rel="noopener noreferrer">Abrir enlace de lectura ↗</a>}{!doi&&!reading&&search&&<a className="btn light" href={`https://scholar.google.com/scholar?q=${encodeURIComponent(search)}`} target="_blank" rel="noopener noreferrer">Buscar artículo por título ↗</a>}</div><p className="fine">{doi?'El DOI abre la página del artículo; el texto completo puede requerir acceso del editor o de tu institución.':reading?'Enlace de lectura guardado en la ficha bibliográfica.':'Sin DOI válido ni enlace de lectura. Añádelos en Editar ficha; la búsqueda por título es una alternativa, no un enlace confirmado al texto completo.'}</p></div>
}
