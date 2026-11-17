# PRISMA Research Manager · MVP 0.1

Aplicación web en español para organizar **varias revisiones sistemáticas**, registrar búsquedas y resultados bibliográficos, realizar cribado y clasificación por etapas, codificar categorías conceptuales configurables, visualizar patrones exploratorios y exportar libros Excel y diagramas PRISMA. **Inicia con una revisión vacía, sin referencias precargadas.**

## Funcionalidades

- **Modo tarjetas para cribado**: título, abstract y palabras clave; deslizar la franja superior a derecha para incluir o izquierda para excluir, botones grandes y opción Dudoso. Entra desde una cola de pendientes o Modo tarjetas. El avance automático se activa al entrar y puede desactivarse en Opciones de revisión. Deshacer y vista editable disponibles; una exclusión a texto completo requiere motivo antes de avanzar. El abstract es desplazable sin clasificar por accidente.
- Keywords conservadas de CSV (incluidos Author Keywords), RIS (KW) y BibTeX (keywords), editables en la ficha y exportadas a Registros en Excel. Los archivos que no las incluyen se muestran sin palabras clave; no se inventan ni derivan del abstract.


- Cribado enfocado en lectura y decisión: colas de pendientes para título/resumen y texto completo, abstract antes de los metadatos, criterios compactos con coincidencias visibles, navegación anterior/siguiente y avance automático opcional. Atajos I/E/D fuera de campos de edición y deshacer de la última decisión de la sesión. Una exclusión a texto completo sin motivo permanece pendiente; con avance automático espera el motivo. La vista completa conserva la edición de ambas etapas. Diseño adaptable a móvil.


- Gestión de bases bibliográficas en **Búsquedas**: cada nueva importación tiene un ID de carga, archivo, fecha y conteo. Permite eliminar una carga concreta con confirmación, aunque haya varios archivos con el mismo nombre, o vaciar todos los registros de la revisión activa. Repara marcas de duplicados que apunten a registros borrados. Conserva búsquedas documentadas, protocolo y manuscrito.
- Las cargas antiguas sin trazabilidad se muestran como registros sin archivo identificado (pueden incluir altas manuales); no se infiere el archivo desde la revista. El respaldo JSON conserva la trazabilidad y Excel añade ID de carga y archivo de origen a Registros.


- Diseño de revisión orientado a OE1 (distribución temporal/geográfica), OE2 (componentes y relaciones) y OE3 (niveles sectorial, multidimensional e integrado y vacíos). Los objetivos y el alcance de los estudios sectoriales se editan en Configuración. Se conservan las preguntas personalizadas y se actualiza la pregunta demostrativa anterior.
- Ficha por artículo incluido en Extracción SES: geografía, componentes, relaciones y dirección, retroalimentación, transformación, nivel justificado, disciplinas, construcción del conocimiento, evidencia/páginas y vacíos. No asigna niveles ni reclasifica el cribado automáticamente. Los campos se exportan al Excel y al respaldo JSON.
- Resultados: conteos de niveles, retroalimentación y cobertura geográfica con datos faltantes explícitos. Las etiquetas geográficas se muestran como fueron ingresadas; deben normalizarse para análisis finales. La coherencia entre E2/E3 y la inclusión de estudios sectoriales queda señalada, sin cambiar criterios previos.


- Tercera pestaña **Manuscrito** centrada en revisión sistemática para **Ecology and Society**. Modelos principales: Lasseur, Holstead y Huitema (2025), DOI 10.5751/ES-16390-300336, y Wintergalen y colegas (2022), DOI 10.5751/ES-13471-270346. Ambos publicados como Research. Métodos de búsqueda, selección y codificación explícitos; resultados por ejes conceptuales; plan de figuras y tablas con fuentes y páginas. Ambio/Socrate (DOI 10.1007/s13280-025-02299-2) queda como referencia visual complementaria para Sankey y sunburst. El plan se exporta a Word/Markdown, sin generar nuevos diagramas automáticamente. Se conservan texto y planes anteriores; todo se incluye en el respaldo JSON.


- Varias revisiones, cada una con pregunta, periodo, criterios y variables SES propios.
- Registro de cadenas de búsqueda, bases, fechas, filtros y número declarado de resultados.
- Importación de referencias bibliográficas **CSV, RIS y BibTeX**; alta manual de referencias. CSV reconoce encabezados de Scopus, Web of Science y español (Title/Article Title/Título, Authors/Author Full Names/Autores, Year/Publication Year/Año, DOI y Abstract/Resumen). Acepta coma, punto y coma y tabulaciones; UTF-8, UTF-16 con BOM y Windows-1252. Las filas deben tener título o DOI. Se informa si el formato o las columnas no son válidos.
- En Cribado → Nuevo registro, introduce un DOI o enlace doi.org y pulsa **Completar desde DOI**. Consulta Crossref y completa los campos vacíos. Si falta el abstract, busca en OpenAlex por el mismo DOI y reconstruye su texto. Informa la fuente del abstract o su ausencia; no todos los DOI tienen resumen disponible. Se conservan los campos manuales.
- Detección de **posibles** duplicados por DOI o título/año; confirmar en cribado.
- Criterios de inclusión y exclusión visibles encima de las decisiones de ambas etapas, con palabras/frases clave configurables (separadas por punto y coma). Se indican coincidencias en título/resumen sin decidir automáticamente; se guardan en JSON y en la hoja Criterios de Excel.
- Cribado por título/resumen y texto completo, con estados Pendiente / Incluir / Excluir / Dudoso y códigos de exclusión configurables.
- Filtro **Duplicados** junto a Pendientes, Incluidos y Excluidos: muestra los registros marcados y permite búsqueda, revisión y selección múltiple. Los otros filtros de estado omiten duplicados; Todos los conserva visibles.
- Botón **Traducir al español** bajo el resumen de cada registro: abre Google Translate en otra pestaña con detección de idioma, conserva el texto original y divide resúmenes largos en partes. La traducción se realiza en el servicio externo, no dentro de la aplicación.
- **Buscar duplicados** en Cribado: analiza los registros existentes de la revisión por DOI normalizado o título/año, muestra pares y motivos y permite marcar solo los seleccionados sin borrarlos. Omite los ya marcados; DOI distintos no se agrupan solo por título. Las sugerencias se pueden deshacer en «Duplicado de».
- Selección múltiple en Cribado: casillas individuales, seleccionar todos los resultados del filtro actual y eliminar seleccionados con confirmación. La selección se limpia al cambiar de filtro, pestaña o revisión.
- Matriz de extracción SES editable y gráficos de frecuencias por categoría, metodología y año.
- Exportación **SVG/PNG** del diagrama de flujo PRISMA simplificado, y **XLSX** con siete hojas.
- Respaldo/restauración de todas las revisiones en **JSON**.
- Persistencia local en **IndexedDB** del navegador (sin servidor ni cuenta).

## Uso local

Requiere Node.js 20 o 22.

```bash
npm install
npm run dev
```

Abre la dirección local que muestre Vite (habitualmente http://localhost:5173). Para compilar:

```bash
npm run build
npm run preview
```

## Publicar mediante GitHub Pages

1. Crea un repositorio vacío, por ejemplo `prisma-research-manager`, en tu cuenta de GitHub.
2. Sube **el contenido de esta carpeta** a la rama `main` (no subir `node_modules`).
3. Ve a **Settings → Pages → Build and deployment**, y elige **GitHub Actions** como fuente.
4. El flujo `.github/workflows/deploy.yml` compilará con Vite y publicará automáticamente al hacer push a `main`.
5. Abre el enlace que informa el despliegue del workflow.

Para subir desde terminal en la carpeta descomprimida:

```bash
git init
git add .
git commit -m "Primera versión PRISMA Research Manager"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/prisma-research-manager.git
git push -u origin main
```

Sustituye `TU_USUARIO` por tu cuenta y crea antes el repositorio remoto. Repositorio del proyecto: https://github.com/franherreraneira/prisma-research-manager.

## Flujo de trabajo sugerido

1. **Configuración**: define pregunta, periodo, códigos de exclusión y variables SES.
2. **Búsquedas**: registra cadenas, fecha, filtros e importa CSV/RIS/BibTeX de tus bases.
3. **Cribado**: verifica posibles duplicados y registra decisiones por etapa, con razones de exclusión a texto completo.
4. **Extracción SES**: codifica los artículos incluidos.
5. **Resultados**: examina frecuencias y evolución temporal, que **no** son un metaanálisis de efectos.
6. **Exportar**: obtiene el diagrama, el Excel y una copia JSON que te permite continuar en otro equipo.

## Privacidad y límites metodológicos

- La publicación en GitHub Pages aloja **solo la aplicación**, no guarda ni sincroniza tus revisiones. Tus registros locales quedan en ese navegador/ordenador. Si borras los datos del navegador o usas otro equipo, necesitarás restaurar el archivo JSON.
- El diagrama implementado es una **representación simplificada de la ruta de registros en bases bibliográficas** y señala si el cribado está inconcluso. El reporte PRISMA 2020 completo puede requerir otras ramas, como búsquedas por otros métodos y distinción explícita entre registros, informes y estudios. Debes verificar estas situaciones antes de publicar un artículo.
- Los registros que figuran como duplicados se excluyen del cribado según el campo `Duplicado de`; confirma manualmente que sean la misma referencia.
- En el cribado de texto completo se guarda una razón principal por informe excluido.
- El contador de registros identificados se calcula desde las referencias realmente ingresadas, no desde la suma de resultados declarados en el registro de búsqueda, que puede diferir si las exportaciones no están completas.
- El importador BibTeX está pensado para formatos simples y no cubre todas las construcciones válidas (p. ej., llaves anidadas). Revisa la calidad de la importación antes del cribado.
- La actualización retira referencias marcadas `isDemo` de las instalaciones anteriores; conserva registros reales, criterios, extracción propia y manuscritos. Las referencias sintéticas utilizadas por las pruebas están en tests y no se precargan en producción.
- Esta primera versión es **individual**: no incluye doble cribado independiente, control de versiones colaborativo, análisis estadístico de efectos ni sincronización en la nube.

## Estado de verificación

Verificado en Chromium con Playwright: importación CSV/RIS/BibTeX, detección y revisión de duplicados, cribado por ambas etapas, codificación SES, persistencia tras recargar, Excel con siete hojas y contenido de extracción, y descargas SVG/PNG. La compilación de producción con Vite también pasó.

```bash
npm ci
npx playwright install chromium
npm test
npm run build
```

El workflow ejecuta las pruebas antes de compilar y desplegar. Publicado en https://franherreraneira.github.io/prisma-research-manager/ con GitHub Pages y despliegue automático desde `main`.

Correcciones respecto del ZIP original: los posibles duplicados aparecen en el listado para revisarlos; cambiar una inclusión a otra decisión limpia el estado de texto completo; la extracción y Excel requieren inclusión válida en ambas etapas y texto recuperado.

## Licencia y referencias

Código de ejemplo para fines académicos. PRISMA 2020: https://www.prisma-statement.org/prisma-2020-flow-diagram
