import countries from 'i18n-iso-countries';
import es from 'i18n-iso-countries/langs/es.json' with {type:'json'};
import en from 'i18n-iso-countries/langs/en.json' with {type:'json'};
countries.registerLocale(es);countries.registerLocale(en);
const aliases={'eeuu':'US','ee. uu.':'US','u.s.a.':'US','uk':'GB','reino unido':'GB','south korea':'KR','corea del sur':'KR'};
function code(value){const v=value.trim();return aliases[v.toLowerCase()]||countries.getAlpha2Code(v,'es')||countries.getAlpha2Code(v,'en')||(countries.isValid(v.toUpperCase())?(v.length===2?v.toUpperCase():countries.alpha3ToAlpha2(v.toUpperCase())):undefined)}
export function geography(records){const places=new Map(),unmapped=new Map();let missing=0;
 for(const record of records){const text=record.integrationAnalysis?.country?.trim();if(!text){missing++;continue}const seen=new Set(),unknown=new Set();
 for(const part of text.split(/[;,\n|]+/).filter(x=>x.trim())){const whole=code(part);if(whole)seen.add(whole);else for(const item of part.split(/\s+(?:y|and)\s+/i)){const id=code(item);if(id)seen.add(id);else unknown.add(item.trim())}}
 for(const id of seen){if(!places.has(id))places.set(id,{id,name:countries.getName(id,'es'),records:[]});places.get(id).records.push(record)}
 for(const value of unknown)unmapped.set(value,(unmapped.get(value)||0)+1);
 }return{places:[...places.values()].sort((a,b)=>b.records.length-a.records.length||a.name.localeCompare(b.name)),unmapped:[...unmapped],missing};
}
export const numericCountry=id=>countries.numericToAlpha2(String(id).padStart(3,'0'));
export function chronology(records){const counts=new Map();let missing=0;for(const r of records){const year=String(r.year||'').trim();if(!/^\d{4}$/.test(year)||Number(year)<1500||Number(year)>new Date().getFullYear()+1){missing++;continue}counts.set(+year,(counts.get(+year)||0)+1)}const years=[...counts.keys()].sort((a,b)=>a-b);return{missing,rows:years.length?Array.from({length:years.at(-1)-years[0]+1},(_,i)=>({year:years[0]+i,count:counts.get(years[0]+i)||0})):[]}}
