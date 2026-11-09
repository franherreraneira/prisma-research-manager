# PRISMA Research Manager · MVP 0.1

Aplicación web en español para organizar **varias revisiones sistemáticas**, registrar búsquedas y resultados bibliográficos, realizar cribado y clasificación por etapas, codificar categorías conceptuales configurables, visualizar patrones exploratorios y exportar libros Excel y diagramas PRISMA. **Incluye un proyecto DEMOSTRATIVO enteramente ficticio sobre eólica marina y sistemas socioecológicos (SES).**

## Funcionalidades

- Varias revisiones, cada una con pregunta, periodo, criterios y variables SES propios.
- Registro de cadenas de búsqueda, bases, fechas, filtros y número declarado de resultados.
- Importación de referencias bibliográficas **CSV, RIS y BibTeX**; alta manual de referencias. CSV reconoce encabezados de Scopus, Web of Science y español (Title/Article Title/Título, Authors/Author Full Names/Autores, Year/Publication Year/Año, DOI y Abstract/Resumen). Acepta coma, punto y coma y tabulaciones; UTF-8, UTF-16 con BOM y Windows-1252. Las filas deben tener título o DOI. Se informa si el formato o las columnas no son válidos.
- En Cribado → Nuevo registro, introduce un DOI o enlace doi.org y pulsa **Completar desde DOI**. Consulta Crossref y completa los campos vacíos. Si falta el abstract, busca en OpenAlex por el mismo DOI y reconstruye su texto. Informa la fuente del abstract o su ausencia; no todos los DOI tienen resumen disponible. Se conservan los campos manuales.
- Detección de **posibles** duplicados por DOI o título/año; confirmar en cribado.
- Cribado por título/resumen y texto completo, con estados Pendiente / Incluir / Excluir / Dudoso y códigos de exclusión configurables.
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

- La publicación en GitHub Pages aloja **solo la aplicación y sus datos de demostración**, no guarda ni sincroniza tus revisiones. Tus registros locales quedan en ese navegador/ordenador. Si borras los datos del navegador o usas otro equipo, necesitarás restaurar el archivo JSON.
- El diagrama implementado es una **representación simplificada de la ruta de registros en bases bibliográficas** y señala si el cribado está inconcluso. El reporte PRISMA 2020 completo puede requerir otras ramas, como búsquedas por otros métodos y distinción explícita entre registros, informes y estudios. Debes verificar estas situaciones antes de publicar un artículo.
- Los registros que figuran como duplicados se excluyen del cribado según el campo `Duplicado de`; confirma manualmente que sean la misma referencia.
- En el cribado de texto completo se guarda una razón principal por informe excluido.
- El contador de registros identificados se calcula desde las referencias realmente ingresadas, no desde la suma de resultados declarados en el registro de búsqueda, que puede diferir si las exportaciones no están completas.
- El importador BibTeX está pensado para formatos simples y no cubre todas las construcciones válidas (p. ej., llaves anidadas). Revisa la calidad de la importación antes del cribado.
- Los datos ficticios están marcados como demostración y no deben citarse como evidencia empírica.
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
