export const CONCEPT_DIMENSIONS=['Ecológico','Social','Busca integración'];
export const conceptDimension=value=>['Integración','Interfaz'].includes(value)?'Busca integración':value;
export function conceptGroups(records){const groups=Object.fromEntries(CONCEPT_DIMENSIONS.map(d=>[d,new Map()]));
 for(const record of records)for(const item of record.conceptHighlights||[]){const dimension=conceptDimension(item.dimension);if(!groups[dimension]||!item.label?.trim())continue;const key=item.label.trim().normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/\s+/g,' '),map=groups[dimension];if(!map.has(key))map.set(key,{key,label:item.label.trim(),dimension,records:new Map()});const entry=map.get(key);if(!entry.records.has(record.id))entry.records.set(record.id,{record,evidence:[]});entry.records.get(record.id).evidence.push(item)}
 return CONCEPT_DIMENSIONS.map(d=>({dimension:d,concepts:[...groups[d].values()].map(x=>({...x,records:[...x.records.values()]})).sort((a,b)=>b.records.length-a.records.length||a.label.localeCompare(b.label))}));
}
