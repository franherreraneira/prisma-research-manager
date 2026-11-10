import React from 'react';
export function translationParts(value,limit=3500){
 const text=String(value||'').trim(),parts=[];
 let remaining=text;
 while(remaining.length>limit){let cut=remaining.lastIndexOf(' ',limit);if(cut<limit/2)cut=limit;parts.push(remaining.slice(0,cut));remaining=remaining.slice(cut).trimStart()}
 if(remaining)parts.push(remaining);
 return parts;
}
export function AbstractTranslation({text}){
 const parts=translationParts(text);
 return <div className="abstract-translation"><div className="actions">{parts.length?parts.map((part,index)=><a className="btn light" key={index} href={`https://translate.google.com/?sl=auto&tl=es&text=${encodeURIComponent(part)}&op=translate`} target="_blank" rel="noopener noreferrer">{parts.length===1?'Traducir al español':`Traducir al español · parte ${index+1} de ${parts.length}`}</a>):<button className="btn light" disabled>Traducir al español</button>}</div><p className="fine">{parts.length?'Abre Google Translate en otra pestaña con el texto del abstract. El resumen original se conserva.':'Añade o recupera un resumen para traducirlo.'}{parts.length>1?' El texto se divide en partes para enviarlo completo.':''}</p></div>
}
