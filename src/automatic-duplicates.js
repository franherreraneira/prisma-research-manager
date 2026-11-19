import {normalizeDOI} from './doi';
export const validDOI=value=>{const doi=normalizeDOI(value);return /^10\.\d{4,9}\/\S+$/i.test(doi)?doi:''};
export function automaticDuplicates(records){
 const byDOI=new Map(),byTitle=new Map(),titleDOIs=new Map();
 const norm=value=>String(value||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^\p{L}\p{N}]/gu,'');
 const titleKey=r=>norm(r.title).length>=12&&norm(r.authors)&&/^\d{4}$/.test(String(r.year||''))?`${norm(r.title)}:${r.year}:${norm(r.authors)}`:'';let changed=false;
 // Preserve previously reviewed records as the preferred original.
 const score=r=>(r.screen&&r.screen!=='Pendiente'?10:0)+(r.full&&r.full!=='Pendiente'?20:0)+(r.notes?1:0);
 for(const r of records){if(r.duplicateOf)continue;const doi=validDOI(r.doi),key=titleKey(r);if(doi){const old=byDOI.get(doi);if(!old||score(r)>score(old))byDOI.set(doi,r)}if(key){if(doi){if(!titleDOIs.has(key))titleDOIs.set(key,new Set());titleDOIs.get(key).add(doi)}const old=byTitle.get(key);if(!old||score(r)>score(old))byTitle.set(key,r)}}
 const rows=records.map(r=>{const doi=validDOI(r.doi);let original=byDOI.get(doi);if(!original){const key=titleKey(r),titleOriginal=titleDOIs.get(key)?.size>1?null:byTitle.get(key);if(titleOriginal&&!(doi&&validDOI(titleOriginal.doi)&&doi!==validDOI(titleOriginal.doi)))original=titleOriginal;}if(!original||original.id===r.id||r.duplicateOf||r.duplicateOverride||!['Pendiente',undefined,''].includes(r.screen)||!['Pendiente',undefined,''].includes(r.full))return r;changed=true;return {...r,duplicateOf:original.id,duplicateDetection:{method:doi&&doi===validDOI(original.doi)?'DOI idéntico normalizado':'Título, año y autores idénticos',doi,automatic:true}}});
 if(!changed)return records;
 const index=new Map(rows.map(r=>[r.id,r]));return rows.map(r=>{if(!r.duplicateDetection?.automatic||!r.duplicateOf)return r;let id=r.duplicateOf;const seen=new Set([r.id]);while(index.get(id)?.duplicateOf&&!seen.has(id)){seen.add(id);id=index.get(id).duplicateOf}return id===r.duplicateOf?r:{...r,duplicateOf:id}});
}
export function applyAutomaticDuplicates(state){let changed=false;const projects=state.projects.map(p=>{const records=automaticDuplicates(p.records);if(records===p.records)return p;changed=true;return {...p,records}});return changed?{...state,projects}:state}
