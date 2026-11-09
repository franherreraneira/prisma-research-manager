import {Document,HeadingLevel,Packer,Paragraph,TextRun} from 'docx';
export async function manuscriptWord({title,journal,type,guide,sections,draft,reference}) {
 const paragraphs=text=>String(text||'').split(/\r?\n/).map(line=>new Paragraph({children:[new TextRun(line)],spacing:{after:160}}));
 const children=[
 new Paragraph({text:title,heading:HeadingLevel.TITLE}),
 ...paragraphs(`Revista objetivo: ${journal}\nTipo de artículo: ${type}\nGuía editorial: ${guide}`),
 ...(reference?paragraphs(reference):[]),
 new Paragraph({children:[new TextRun({text:'Borrador de trabajo. Revisar las normas editoriales antes del envío.',italics:true})]}),
 ...sections.filter(s=>s.id!=='title').flatMap(section=>[
 new Paragraph({text:section.title,heading:section.level===2?HeadingLevel.HEADING_2:HeadingLevel.HEADING_1}),
 ...paragraphs(draft[section.id]||`[Pendiente]\nOrientación: ${section.hint}`)
 ])
 ];
 const doc=new Document({creator:'PRISMA Research Manager',title,description:`${journal} · ${type}`,styles:{default:{document:{run:{font:'Times New Roman',size:24},paragraph:{spacing:{line:360,after:160}}}}},sections:[{properties:{page:{size:{width:11906,height:16838},margin:{top:1440,right:1440,bottom:1440,left:1440}}},children}]});
 return Packer.toBlob(doc);
}
