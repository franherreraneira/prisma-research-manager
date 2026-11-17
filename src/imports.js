export function removeRecords(project,ids){
 const removed=new Set(ids);
 return {...project,records:project.records.filter(r=>!removed.has(r.id)).map(r=>removed.has(r.duplicateOf)?{...r,duplicateOf:''}:r)};
}
export function cleanDemoState(state){
 if(!state?.projects?.length||state.demoCleanupVersion===1)return state;
 const projects=state.projects.map(p=>{
  const ids=p.records.filter(r=>r.isDemo===true).map(r=>r.id);
  const cleaned=removeRecords(p,ids);
  return {...cleaned,searches:p.searches.filter(s=>!(p.id==='demo-ses'&&['s1','s2'].includes(s.id)&&s.notes==='Simulación didáctica')),title:p.id==='demo-ses'&&p.title==='Eólica marina desde la perspectiva SES'?'Mi revisión de eólica marina':p.title,description:p.description==='PROYECTO DEMOSTRATIVO. Todas las referencias, autores, DOI y resultados son ficticios.'?'':p.description};
 });
 return {...state,projects,demoCleanupVersion:1};
}
