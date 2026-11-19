import React from 'react';
export function ScreeningNotes({record}){
 const notes=record.notes||'';
 return <section className="screening-notes" role="region" aria-label="Justificación registrada en el cribado"><h3>Justificación registrada en el cribado</h3>{notes.trim()?<div className="screening-notes-text">{notes}</div>:<p className="muted">Este artículo todavía no tiene notas de cribado.</p>}<p className="fine">Nota original del artículo seleccionado. Puedes actualizarla en «Cribado», en «Notas / justificación».</p></section>;
}
