import {download,esc} from './utils';
// Rasterize a standalone SVG, with a caption and source notes, at 2× resolution.
export async function exportFigurePNG(svg,{title,subtitle,notes=[],filename}){
 if(!svg)throw new Error('El gráfico todavía no está disponible.');
 const bounds=svg.getBoundingClientRect(),view=svg.viewBox?.baseVal;
 const sourceWidth=view?.width||bounds.width,sourceHeight=view?.height||bounds.height;
 if(!sourceWidth||!sourceHeight)throw new Error('Espera a que el gráfico termine de cargar.');
 const width=1200,padding=40,figureWidth=width-padding*2,figureHeight=sourceHeight/sourceWidth*figureWidth;
 const clone=svg.cloneNode(true),originals=[svg,...svg.querySelectorAll('*')],copies=[clone,...clone.querySelectorAll('*')];
 originals.forEach((node,i)=>{const copy=copies[i],style=getComputedStyle(node);for(const property of ['fill','stroke','stroke-width','stroke-dasharray','opacity','font-size','font-weight','text-anchor','dominant-baseline'])copy.style.setProperty(property,style.getPropertyValue(property));copy.style.fontFamily='Arial, sans-serif';copy.removeAttribute('tabindex');copy.removeAttribute('class')});
 clone.setAttribute('xmlns','http://www.w3.org/2000/svg');clone.setAttribute('viewBox',`0 0 ${sourceWidth} ${sourceHeight}`);clone.setAttribute('width',String(figureWidth));clone.setAttribute('height',String(figureHeight));clone.setAttribute('x',String(padding));clone.setAttribute('y','120');clone.style.width=`${figureWidth}px`;clone.style.height=`${figureHeight}px`;clone.style.maxHeight='none';
 const canvas=document.createElement('canvas'),context=canvas.getContext('2d');if(!context)throw new Error('No se pudo preparar la imagen.');
 function lines(text,size){context.font=`${size}px Arial`;const rows=[];let row='';for(const word of String(text).split(/\s+/)){const next=row?`${row} ${word}`:word;if(context.measureText(next).width>figureWidth&&row){rows.push(row);row=word}else row=next}if(row)rows.push(row);return rows}
 const titleLines=lines(title,25),subLines=lines(subtitle,16);const headerHeight=30+titleLines.length*32+subLines.length*23+20;
 clone.setAttribute('y',String(headerHeight));let y=30;
 const text=(value,size,color)=>`<text x="${padding}" y="${y}" font-family="Arial, sans-serif" font-size="${size}" fill="${color}">${esc(value)}</text>`;
 let caption='';for(const row of titleLines){y+=28;caption+=text(row,25,'#143447')}for(const row of subLines){y+=23;caption+=text(row,16,'#516477')}
 y=headerHeight+figureHeight+28;let footer='';for(const note of notes)for(const row of lines(note,15)){footer+=text(row,15,'#516477');y+=22}
 const height=Math.ceil(y+padding),xml=`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><rect width="100%" height="100%" fill="white"/>${caption}${new XMLSerializer().serializeToString(clone)}${footer}</svg>`;
 const url=URL.createObjectURL(new Blob([xml],{type:'image/svg+xml;charset=utf-8'}));
 try{const image=new Image();await new Promise((resolve,reject)=>{image.onload=resolve;image.onerror=()=>reject(new Error('No se pudo generar el PNG.'));image.src=url});canvas.width=width*2;canvas.height=height*2;context.fillStyle='white';context.fillRect(0,0,canvas.width,canvas.height);context.drawImage(image,0,0,canvas.width,canvas.height);const blob=await new Promise(resolve=>canvas.toBlob(resolve,'image/png'));if(!blob)throw new Error('No se pudo guardar la imagen.');download(blob,filename)}finally{URL.revokeObjectURL(url)}
}
