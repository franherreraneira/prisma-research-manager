import React,{useEffect,useRef,useState} from 'react';
const serialize=rows=>rows.filter(value=>value.trim()).join('; ');
const parse=value=>String(value||'').split(';').map(value=>value.trim()).filter(Boolean);
export function StudyCountries({value='',onChange}){
 const container=useRef(null);const[rows,setRows]=useState(()=>parse(value).length?parse(value):['']);
 useEffect(()=>{if(serialize(rows)!==value){const next=parse(value);setRows(next.length?next:[''])}},[value]);
 function change(index,value){const next=rows.map((text,i)=>i===index?value:text);setRows(next);onChange(serialize(next))}
 function remove(index){const next=rows.filter((_,i)=>i!==index);setRows(next.length?next:['']);onChange(serialize(next))}
 return <div className="study-countries" ref={container}><p className="fine">Añade una fila por país. También se conservan las etiquetas geográficas que ya habías registrado.</p>{rows.map((country,i)=><div className="study-country-row" key={i}><label>{i===0?'País o región estudiada':`País estudiado ${i+1}`}<input aria-label={i===0?'País o región estudiada':`País estudiado ${i+1}`} value={country} placeholder="Ej.: Chile" onChange={e=>change(i,e.target.value)}/></label>{rows.length>1&&<button className="btn light" onClick={()=>remove(i)} aria-label={`Quitar país ${i+1}`}>Quitar</button>}</div>)}<button className="btn light" onClick={()=>{setRows(current=>[...current,'']);requestAnimationFrame(()=>{const inputs=container.current?.querySelectorAll('input');inputs?.[inputs.length-1]?.focus()})}}>+ Añadir otro país estudiado</button><p className="fine">Si el estudio abarca un mar u océano y no identifica países, deja estos campos vacíos y registra el área marina abajo. No deduzcas países a partir del océano ni de la afiliación de los autores.</p></div>;
}
