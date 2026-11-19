export const finalIncluded=r=>!r.duplicateOf&&r.screen==='Incluir'&&r.fullObtained!==false&&r.full==='Incluir'&&r.fullReviewConfirmed===true;
export const fullDecisionRecorded=r=>r.fullReviewConfirmed===true&&(['Incluir','Excluir'].includes(r.full)||r.full==='Dudoso');
export const fullNeedsReview=r=>!r.duplicateOf&&r.screen==='Incluir'&&r.fullObtained!==false&&(!fullDecisionRecorded(r)||r.full==='Dudoso'||(r.full==='Excluir'&&!r.reasons?.length));
export function recordFullDecision(record,changes,at=new Date().toISOString()){
 const next={...changes};
 if(Object.hasOwn(changes,'full')){
  next.fullReviewConfirmed=['Incluir','Excluir','Dudoso'].includes(changes.full);
  next.fullDecisionAt=next.fullReviewConfirmed?at:null;
  next.fullDecisionHistory=[...(record.fullDecisionHistory||[]),{at,previous:record.full||'Pendiente',decision:changes.full,previousConfirmed:record.fullReviewConfirmed===true,notes:changes.fullNotes??record.fullNotes??'',reasons:changes.reasons??record.reasons??[]}];
 }
 if(changes.fullObtained===false)next.fullReviewConfirmed=false;
 return next;
}
