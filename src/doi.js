export function normalizeDOI(value) {
  return String(value || '').trim().replace(/^https?:\/\/(?:dx\.)?doi\.org\//i, '').replace(/^doi:\s*/i, '').trim().toLowerCase();
}
export async function lookupDOI(value) {
  const doi = normalizeDOI(value);
  if (!/^10\.\d{4,9}\/\S+$/i.test(doi)) throw new Error('Introduce un DOI válido, por ejemplo 10.1038/nphys1170 o su enlace doi.org.');
  let response;
  try {
    response = await fetch(`https://api.crossref.org/works/${encodeURIComponent(doi)}`, {signal: AbortSignal.timeout(15000)});
  } catch {
    throw new Error('No se pudo conectar con Crossref. Inténtalo de nuevo o completa la ficha manualmente.');
  }
  if (response.status === 404) throw new Error('DOI no encontrado en Crossref. Comprueba el DOI o completa la ficha manualmente.');
  if (!response.ok) throw new Error('Crossref no está disponible en este momento. Inténtalo más tarde.');
  const {message: work} = await response.json();
  if (!work?.title?.[0]) throw new Error('El DOI no contiene un título bibliográfico utilizable.');
  const document = new DOMParser().parseFromString(work.abstract || '', 'text/html');
  const abstract = document.body.textContent.trim();
  return {
    doi, title: work.title[0],
    authors: (work.author || []).map(a => [a.given, a.family].filter(Boolean).join(' ') || a.name || '').filter(Boolean).join('; '),
    year: String((work.published || work['published-print'] || work['published-online'] || work.issued)?.['date-parts']?.[0]?.[0] || ''),
    source: work['container-title']?.[0] || 'Crossref', abstract
  };
}
