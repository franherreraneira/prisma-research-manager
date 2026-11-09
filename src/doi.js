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
  let abstract = document.body.textContent.trim();
  let abstractSource = abstract ? 'Crossref' : '';
  let abstractLookupFailed = false;
  if (!abstract) {
    try {
      const extra = await fetch(`https://api.openalex.org/works/https://doi.org/${encodeURIComponent(doi)}`, {signal: AbortSignal.timeout(12000)});
      if (extra.ok) {
        const work = await extra.json();
        if (normalizeDOI(work.doi) === doi && work.abstract_inverted_index) {
          const words = [];
          for (const [word, positions] of Object.entries(work.abstract_inverted_index)) {
            for (const position of positions) if (Number.isInteger(position) && position >= 0 && position < 100000) words[position] = word;
          }
          abstract = words.join(' ').trim();
          if (abstract) abstractSource = 'OpenAlex';
        }
      } else if (extra.status !== 404) abstractLookupFailed = true;
    } catch {
      abstractLookupFailed = true;
    }
  }
  return {
    doi, title: work.title[0],
    authors: (work.author || []).map(a => [a.given, a.family].filter(Boolean).join(' ') || a.name || '').filter(Boolean).join('; '),
    year: String((work.published || work['published-print'] || work['published-online'] || work.issued)?.['date-parts']?.[0]?.[0] || ''),
    source: work['container-title']?.[0] || 'Crossref', abstract, abstractSource, abstractLookupFailed
  };
}
