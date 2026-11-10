import React,{useMemo,useState} from 'react';
import {normalizeDOI} from './doi';
export function findDuplicates(records){
 const doiIndex=new Map(),titleIndex=new Map(),matches=[];
 const titleKey=title=>String(title||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^\p{L}\p{N}]/gu,'');
 for(const record of records){
  if(record.duplicateOf)continue;
  const doi=normalizeDOI(record.doi),title=titleKey(record.title),year=String(record.year||'').trim();
  const usable=title.length>=12&&title!=='sintitulo'&&year;
  const key=usable?`${title}:${year}`:null;
  let original=doi?doiIndex.get(doi):null,reason='Mismo DOI';
  if(!original&&key){original=(titleIndex.get(key)||[]).find(other=>!(doi&&normalizeDOI(other.doi)&&doi!==normalizeDOI(other.doi)));reason='Mismo título y año'}
  if(original){matches.push({record,original,reason});continue}
  if(doi)doiIndex.set(doi,record);
  if(key)titleIndex.set(key,[...(titleIndex.get(key)||[]),record]);
 }
 return matches;
}
export function DuplicateFinder({project,update,onOpenRecord}){
 const[open,setOpen]=useState(false),[selected,setSelected]=useState([]),[notice,setNotice]=useState('');
 const matches=useMemo(()=>findDuplicates(project.records),[project.records]);
 const chosen=matches.filter(m=>selected.includes(m.record.id));
 function mark(){if(!chosen.length)return;const pairs=new Map(chosen.map(m=>[m.record.id,m.original.id]));update(p=>({...p,records:p.records.map(r=>pairs.has(r.id)?{...r,duplicateOf:pairs.get(r.id)}:r)}));setSelected([]);setNotice(`${chosen.length} registros marcados como posibles duplicados. No se eliminó ningún registro.`)}
 return <div className="duplicatefinder"><button className="btn light" onClick={()=>{setOpen(true);setSelected([]);setNotice('')}}>Buscar duplicados</button>{open&&<div className="panel"><div className="sectionhead"><h3>Revisión de posibles duplicados</h3><button className="btn light" onClick={()=>setOpen(false)}>Cerrar búsqueda de duplicados</button></div><p>Se revisa toda la revisión activa, incluidos registros fuera del filtro. Coincidencia por DOI normalizado o título y año; DOI distintos no se emparejan solo por título. Los registros ya marcados se omiten.</p><p>La primera referencia coincidente se propone como original. Comprueba cuál conservar: marcar un duplicado lo excluye de los conteos de cribado, sin borrarlo. Puedes corregir «Duplicado de» en su ficha.</p><p aria-live="polite">{matches.length} posibles duplicados por revisar · {project.records.filter(r=>r.duplicateOf).length} ya marcados</p>{notice&&<p role="status">{notice}</p>}
 {matches.length>0?<><div className="bulktools"><label className="inlinecheck"><input type="checkbox" aria-label="Seleccionar todos los posibles duplicados" checked={chosen.length===matches.length} onChange={e=>setSelected(e.target.checked?matches.map(m=>m.record.id):[])}/> Seleccionar coincidencias</label><button className="btn primary" disabled={!chosen.length} onClick={mark}>Marcar seleccionados como duplicados ({chosen.length})</button></div><div className="tablewrap"><table><thead><tr><th>Seleccionar</th><th>Posible duplicado</th><th>Original propuesto</th><th>Coincidencia</th></tr></thead><tbody>{matches.map(m=><tr key={m.record.id}><td><input type="checkbox" aria-label={`Marcar duplicado: ${m.record.title||'Sin título'}`} checked={selected.includes(m.record.id)} onChange={e=>setSelected(ids=>e.target.checked?[...ids,m.record.id]:ids.filter(id=>id!==m.record.id))}/></td><td><button className="btn light" onClick={()=>onOpenRecord(m.record.id)}>{m.record.title||'Sin título'}</button><p className="fine">{m.record.authors} · {m.record.year} · {m.record.doi||'Sin DOI'}</p></td><td><button className="btn light" onClick={()=>onOpenRecord(m.original.id)}>{m.original.title||'Sin título'}</button><p className="fine">{m.original.authors} · {m.original.year} · {m.original.doi||'Sin DOI'}</p></td><td>{m.reason}</td></tr>)}</tbody></table></div></>:<p>No se encontraron nuevas coincidencias. Esta búsqueda no detecta títulos traducidos ni todas las variantes bibliográficas.</p>}
 </div>}</div>
}
