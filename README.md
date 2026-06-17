# Laboratorio de Intervencion Psicosocial

Aplicacion web local para estudiar casos psicosociales desde el Grado de Educacion Social, con enfoque en salud, dependencia y vulnerabilidad social. La herramienta organiza la ficha del caso, CIE-11, familia, red social, recursos territoriales e informe profesional provisional.

El razonamiento esta implementado como un motor de reglas socioeducativas alineado con la asignatura Salud, Dependencia y Vulnerabilidad Social de UNIR. La salida es academica, prudente y orientativa: no sustituye diagnostico clinico, resolucion administrativa ni valoracion profesional.

## Funcionalidades principales

- Autocompletado CIE-11 MMS en espanol `2026-01`, generado desde la tabulacion oficial de la OMS.
- Patologia dual opcional con dos codigos CIE-11 y observaciones cautelares.
- Identificacion integral: privacidad, edad, origen, situacion administrativa, empleo, estudios, ingresos, vivienda y barreras.
- Reconocimientos: vulnerabilidad, discapacidad, dependencia, apoyos y prestaciones.
- Genograma, sociograma draggable y mapa real de recursos por ciudad.
- Recursos estructurados para Madrid, Barcelona y Sevilla.
- Informe web y exportacion PDF con sintesis profesional, objetivos, metodologia, prevencion, itinerario, fuentes y contexto UNIR.
- Accesibilidad digital: salto al contenido, alto contraste, subrayado de enlaces, texto grande, espaciado, foco lector y reduccion de movimiento.

## Arquitectura

- `frontend/index.html`: estructura UX por pasos.
- `frontend/app.js`: estado del caso, CIE-11, patologia dual, genograma, sociograma, recursos, accesibilidad e informe.
- `frontend/styles.css`: interfaz academica profesional.
- `backend/case-inference.js`: reglas condicionales, validacion e informe estructurado.
- `backend/social-resources.js`: recursos por ciudad, categoria y tipo.
- `backend/academic-framework.js`: marco teorico de Salud, Dependencia y Vulnerabilidad Social.
- `backend/icd11.js`: busqueda y seleccion de patologias CIE-11.
- `scripts/prepare-icd11.js`: descarga la tabulacion oficial CIE-11 MMS en espanol de la OMS y genera `data/icd11-es-2026.json.gz`.
- `data/icd11-es-2026.json.gz`: indice local compacto generado en ejecucion, con codigos, titulos y capitulos. El backend tambien admite `data/icd11-es-2026.json` completo en desarrollo local.

## Ejecutar

```powershell
npm run prepare:icd11
.\start-app.ps1
```

Despues abre:

```text
http://localhost:4173
```

Si no ejecutas `npm run prepare:icd11`, la aplicacion genera el indice automaticamente en la primera consulta CIE-11 siempre que tenga conexion a internet.

## Despliegue en GitHub

Este proyecto funciona como aplicacion Node local. Para publicarlo en GitHub:

1. Sube el contenido del repositorio.
2. Ejecuta `npm run prepare:icd11` si quieres preparar la base antes de iniciar.
3. Ejecuta `npm start` en local o en un entorno Node compatible.
4. Abre `http://localhost:4173`.

## GitHub Pages

La carpeta `docs/` contiene una version estatica para GitHub Pages. Se genera con:

```powershell
npm run build:pages
```

En GitHub Pages configura la rama `main` y la carpeta `/docs`. La URL publica queda en:

```text
https://carlosarandabcn-80.github.io/SOCIAL_PROTOOLS/
```

En modo Pages no se ejecuta el servidor Node; el navegador usa `static-engine.js` con recursos sociales y motor de informe integrados.

La aplicacion no almacena datos del caso. Exporta el PDF al finalizar cada sesion si necesitas conservar el trabajo.

## Limite etico

La herramienta ofrece orientacion socioeducativa y no sustituye diagnostico ni tratamiento clinico. Los recursos incluidos son una base piloto y conviene verificar disponibilidad, requisitos y vias de acceso antes de usarlos en un caso real.

## Autor

Carlos Aranda Sanchez (2026).
