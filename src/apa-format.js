import {Cite} from '@citation-js/core';
import '@citation-js/plugin-csl';
export function formatAPA(data){const cite=new Cite([data]);return {text:cite.format('bibliography',{format:'text',template:'apa',lang:'es-ES'}).trim(),html:cite.format('bibliography',{format:'html',template:'apa',lang:'es-ES'}).trim(),short:cite.format('citation',{format:'text',template:'apa',lang:'es-ES'}).trim()}}
