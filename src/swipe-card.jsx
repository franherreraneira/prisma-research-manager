import {DocumentAccess} from './document-access';
import React,{useRef,useState} from 'react';
import {AbstractTranslation} from './abstract-translation';
export function SwipeCard({record,phase,onDecide,edit,onEdit,onUndo,canUndo}){
 const[drag,setDrag]=useState(0),start=useRef(null);const full=phase==='full';const enabled=!record.duplicateOf&&(!full||(record.screen==='Incluir'&&record.fullObtained!==false));
 const terms=Array.isArray(record.keywords)?record.keywords:String(record.keywords||'').split(/[;,\n|]/).map(x=>x.trim()).filter(Boolean);
 function decide(value){if(!enabled)return;onDecide(record.id,full?{full:value,reasons:value==='Excluir'?(record.reasons||[]):[]}:{screen:value,...(value!=='Incluir'?{full:'Pendiente',reasons:[]}:{})},full?'full':'title')}
 function down(e){if(!enabled||e.button!==0)return;start.current={x:e.clientX,y:e.clientY};e.currentTarget.setPointerCapture(e.pointerId)}
 function move(e){if(start.current){const dx=e.clientX-start.current.x,dy=e.clientY-start.current.y;setDrag(Math.abs(dx)>Math.abs(dy)?Math.max(-180,Math.min(180,dx)):0)}}
 function end(e){if(!start.current)return;const dx=e.clientX-start.current.x,dy=e.clientY-start.current.y;start.current=null;setDrag(0);if(Math.abs(dx)>=110&&Math.abs(dx)>Math.abs(dy)*1.5)decide(dx>0?'Incluir':'Excluir')}
 return <article className="swipe-card" style={{transform:`translateX(${drag*.25}px) rotate(${drag/70}deg)`}}>
 <div className="swipe-handle" onPointerDown={down} onPointerMove={move} onPointerUp={end} onPointerCancel={()=>{start.current=null;setDrag(0)}}><span>← Excluir</span><b>{drag>70?'INCLUIR →':drag< -70?'← EXCLUIR':'Desliza esta franja o usa los botones'}</b><span>Incluir →</span></div>
 <div className="swipe-content"><div className="swipe-meta"><span className={`pill chip ${record.duplicateOf?'amber':record[full?'full':'screen']==='Incluir'?'green':record[full?'full':'screen']==='Excluir'?'red':''}`}>{full?'Texto completo':'Título y resumen'} · {record[full?'full':'screen']||'Pendiente'}</span><div className="swipe-card-tools"><button className="btn light" disabled={!canUndo} onClick={onUndo}>Deshacer anterior</button><button className="btn light" onClick={onEdit}>Editar ficha</button></div></div><h2>{record.title||'Sin título'}</h2><p className="review-citation">{record.authors||'Sin autores'} · {record.year||'Sin año'} · {record.source||'Sin fuente'}</p><DocumentAccess record={record}/>
 <h3>Palabras clave</h3><div className="swipe-keywords">{terms.length?terms.map((term,i)=><span key={i}>{term}</span>):<p className="fine">Sin palabras clave informadas. Puedes añadirlas en Editar ficha.</p>}</div>
 <h3>Abstract / Resumen</h3><div className="swipe-abstract" tabIndex={0}>{record.abstract||'Sin abstract disponible. Abre Editar ficha para completarlo o recuperarlo desde DOI. No excluyas por la sola ausencia del resumen.'}</div><AbstractTranslation text={record.abstract}/>
 <label>Notas / justificación<textarea aria-label="Notas / justificación" rows={2} value={record.notes||''} onChange={e=>edit(record.id,{notes:e.target.value})}/></label></div>
 <div className="swipe-actions"><button className="swipe-exclude" disabled={!enabled} onClick={()=>decide('Excluir')}>← Excluir</button><button className="swipe-unsure" disabled={!enabled} onClick={()=>decide('Dudoso')}>? Dudoso</button><button className="swipe-include" disabled={!enabled} onClick={()=>decide('Incluir')}>Incluir →</button></div>
 <p className="swipe-caption">{full?'La inclusión es final. Si excluyes, selecciona un motivo arriba.':'Incluir pasa el artículo a texto completo; todavía no es la inclusión final.'} Puedes deshacer la última decisión. <a href="#review-options">Opciones de revisión</a></p>
 </article>
}
