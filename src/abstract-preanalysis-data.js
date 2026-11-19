import {finalIncluded} from './review-workflow';
import countries from 'i18n-iso-countries';
import es from 'i18n-iso-countries/langs/es.json' with {type:'json'};
import en from 'i18n-iso-countries/langs/en.json' with {type:'json'};
countries.registerLocale(es);countries.registerLocale(en);
const names=[];
for(const lang of ['es','en'])for(const [code,labels] of Object.entries(countries.getNames(lang,{select:'all'})))for(const label of labels)if(label.length>=4)names.push({code,label});
const fold=s=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
export function abstractSuggestions(record){
 const abstract=record.abstract||'',sentences=abstract.match(/[^.!?]+[.!?]?/g)||[],found=new Map();
 for(const {code,label} of names){const key=fold(label).replace(/[.*+?^${}()|[\]\\]/g,'\\$&');const pattern=new RegExp(`(^|[^\\p{L}])${key}([^\\p{L}]|$)`,'u');const evidence=sentences.find(s=>pattern.test(fold(s)));if(evidence&&!found.has(code))found.set(code,{code,country:countries.getName(code,'es'),evidence:evidence.trim()})}
 const years=[...new Set(abstract.match(/\b(?:19|20)\d{2}\b/g)||[])];
 const year=/^\d{4}$/.test(String(record.year||''))?String(record.year):'';
 return {version:1,abstract,metadataYear:year,countries:[...found.values()],mentionedYears:years};
}

export function preparePreanalysis(state){let changed=false;const projects=state.projects.map(p=>{let updated=false;const records=p.records.map(r=>{if(!finalIncluded(r)||(r.preAnalysis?.version===1&&r.preAnalysis.abstract===(r.abstract||'')&&r.preAnalysis.metadataYear===(/^\d{4}$/.test(String(r.year||''))?String(r.year):'')))return r;updated=true;return {...r,preAnalysis:abstractSuggestions(r)}});if(!updated)return p;changed=true;return {...p,records}});return changed?{...state,projects}:state}
