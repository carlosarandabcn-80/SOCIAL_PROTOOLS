const academicFramework = {
  course: "Salud, Dependencia y Vulnerabilidad Social",
  educationalContext:
    "Aplicacion desarrollada en entorno educativo de UNIR para apoyar el estudio de casos en Educacion Social. El informe es provisional, academico y orientativo; no sustituye entrevista profesional, diagnostico clinico ni resolucion administrativa.",
  activityFocus:
    "El informe provisional debe responder como una actividad aplicada de Educacion Social: caracterizar el caso, fundamentar necesidades, diferenciar salud/dependencia/vulnerabilidad, proponer prevencion por niveles y disenar un itinerario prudente, evaluable y coordinado.",
  principles: [
    {
      id: "salud-integral",
      source: "Tema 1. Bases conceptuales de salud, dependencia y vulnerabilidad social",
      axis: "salud integral y determinantes",
      rule:
        "La salud se interpreta como proceso biopsicosocial, comunitario y dinamico; el diagnostico CIE-11 orienta, pero no sustituye la lectura de condiciones de vida, red y derechos.",
      reportUse:
        "Traducir sintomas o diagnosticos en necesidades de funcionamiento, participacion, apoyo cotidiano y reduccion de barreras."
    },
    {
      id: "ciclo-vital",
      source: "Tema 2. Salud y ciclo vital",
      axis: "etapa vital",
      rule:
        "La intervencion debe adaptarse a infancia, adolescencia, adultez, envejecimiento y transiciones familiares.",
      reportUse:
        "Ajustar objetivos a edad, autonomia esperable, duelos, crianza, estudios, empleo, cuidados y proyecto vital."
    },
    {
      id: "derecho-salud",
      source: "Tema 3. Derecho a la salud",
      axis: "derechos y accesibilidad",
      rule:
        "Las necesidades deben traducirse en disponibilidad, accesibilidad, aceptabilidad, calidad, participacion y responsabilidad institucional.",
      reportUse:
        "Identificar barreras administrativas, economicas, linguisticas, territoriales o de trato, y proponer acciones de acompanamiento a derechos."
    },
    {
      id: "epidemiologia-prevencion",
      source: "Tema 4. Epidemiologia y salud publica",
      axis: "riesgo, proteccion y prevencion",
      rule:
        "Los factores de riesgo y proteccion se valoran contextualizando historia natural, prevencion primaria, secundaria y terciaria.",
      reportUse:
        "Diferenciar promocion, deteccion temprana, reduccion de danos, rehabilitacion y prevencion de recaidas o cronificacion social."
    },
    {
      id: "organizacion-sanitaria",
      source: "Tema 5. Organizacion sanitaria",
      axis: "coordinacion sociosanitaria",
      rule:
        "La accion socioeducativa coordina recursos sociales, sanitarios y comunitarios sin invadir funciones clinicas.",
      reportUse:
        "Proponer derivaciones prudentes, continuidad asistencial, trabajo en red y roles profesionales claros."
    },
    {
      id: "educacion-salud",
      source: "Tema 6. Educacion para la salud",
      axis: "competencias y alfabetizacion en salud",
      rule:
        "Las estrategias deben fortalecer comprension, autocuidado posible, comunicacion, toma de decisiones y habilidades para la vida.",
      reportUse:
        "Incluir acciones psicoeducativas, pactadas y culturalmente comprensibles, nunca culpabilizadoras."
    },
    {
      id: "promocion-salud",
      source: "Tema 7. Promocion de la salud",
      axis: "entornos y comunidad",
      rule:
        "La promocion de la salud requiere entornos favorables, participacion comunitaria y reorientacion de servicios hacia prevencion.",
      reportUse:
        "Activar red comunitaria, espacios de pertenencia, apoyo mutuo y recursos de proximidad."
    },
    {
      id: "diversidad-funcional",
      source: "Tema 8. Salud, enfermedades y diversidad funcional",
      axis: "funcionamiento y apoyos",
      rule:
        "La diversidad funcional se aborda desde accesibilidad, apoyos, autonomia, ajustes razonables y calidad de vida.",
      reportUse:
        "Evitar una mirada deficitaria y formular apoyos ambientales, sociales, educativos o laborales."
    },
    {
      id: "colectivos-especificos",
      source: "Tema 9. Salud y colectivos especificos",
      axis: "interseccionalidad",
      rule:
        "Genero, migracion, refugio, privacion de libertad, infancia, mayores u otros colectivos requieren lectura interseccional y no estigmatizante.",
      reportUse:
        "Incorporar origen, idioma, situacion administrativa, discriminacion, violencia, cultura, red y barreras de acceso."
    },
    {
      id: "dependencia-autonomia",
      source: "Tema 10. Salud y dependencia",
      axis: "SAAD, BVD, PIA y autonomia",
      rule:
        "La dependencia se valora por apoyos necesarios para actividades de la vida diaria, entorno, cuidados, participacion y permanencia comunitaria.",
      reportUse:
        "Si hay dependencia o discapacidad, revisar reconocimiento, grado, apoyos efectivos, respiro familiar, accesibilidad y Programa Individual de Atencion si procede."
    }
  ],
  interventionModel: [
    {
      phase: "1. Acogida, vinculo y contrato socioeducativo",
      goal:
        "Construir seguridad, consentimiento informado, delimitacion del rol y primera hipotesis de necesidades.",
      indicators: ["identificacion protegida", "demanda formulada", "riesgos inmediatos descartados o activados"]
    },
    {
      phase: "2. Diagnostico psicosocial operativo",
      goal:
        "Integrar CIE-11, red, genograma, sociograma, recursos, vivienda, ingresos, empleo, estudios, origen, derechos y apoyos.",
      indicators: ["variables activas", "red mapeada", "barreras y protecciones diferenciadas"]
    },
    {
      phase: "3. Plan individualizado de intervencion",
      goal:
        "Ordenar objetivos SMART, recursos, acompanamiento, educacion para la salud y coordinacion interinstitucional.",
      indicators: ["objetivos pactados", "recursos asignados", "responsables y plazos"]
    },
    {
      phase: "4. Seguimiento, evaluacion y ajuste",
      goal:
        "Medir cambios en autonomia, bienestar, acceso a derechos, red y participacion, ajustando el plan con cautela.",
      indicators: ["revision periodica", "indicadores de avance", "nuevas barreras detectadas"]
    }
  ],
  evidenceSources: [
    {
      id: "who-sdh-2025",
      title: "OMS - determinantes sociales de la salud y equidad",
      url: "https://www.who.int/health-topics/social-determinants-of-health",
      note:
        "Fundamenta que las condiciones de vida, trabajo, edad, recursos y poder influyen en desigualdades evitables de salud."
    },
    {
      id: "who-ottawa",
      title: "OMS - Carta de Ottawa para la Promocion de la Salud",
      url: "https://www.who.int/teams/health-promotion/enhanced-wellbeing/first-global-conference",
      note:
        "Aporta acciones de promocion: politicas saludables, entornos favorables, accion comunitaria, habilidades personales y reorientacion de servicios."
    },
    {
      id: "who-icf",
      title: "OMS - Clasificacion Internacional del Funcionamiento, la Discapacidad y la Salud (CIF/ICF)",
      url: "https://www.who.int/standards/classifications/international-classification-of-functioning-disability-and-health",
      note:
        "Permite describir funcionamiento, discapacidad y factores ambientales, evitando reducir el caso al diagnostico."
    },
    {
      id: "ohchr-health",
      title: "ACNUDH - derecho a la salud",
      url: "https://www.ohchr.org/es/topic/health",
      note:
        "Situa disponibilidad, accesibilidad, aceptabilidad, calidad, participacion y responsabilidad como criterios de analisis."
    },
    {
      id: "boe-ley-dependencia",
      title: "BOE - Ley 39/2006 de promocion de la autonomia personal y atencion a la dependencia",
      url: "https://www.boe.es/buscar/act.php?id=BOE-A-2006-21990",
      note:
        "Marco estatal del SAAD, autonomia personal, permanencia en entorno, colaboracion sociosanitaria y participacion del tercer sector."
    },
    {
      id: "boe-bvd",
      title: "BOE - Real Decreto 174/2011, Baremo de Valoracion de la Dependencia",
      url: "https://www.boe.es/buscar/doc.php?id=BOE-A-2011-3174",
      note:
        "Regula el baremo que acredita grados de dependencia y orienta servicios, prestaciones y apoyos."
    },
    {
      id: "sanidad-salud-mental-2025",
      title: "Ministerio de Sanidad - Plan de Accion de Salud Mental 2025-2027",
      url: "https://www.sanidad.gob.es/areas/calidadAsistencial/estrategias/saludMental/docs/Plan_accion_salud_mental_2025_27.pdf",
      note:
        "Actualiza el enfoque comunitario, biopsicosocial, basado en derechos y determinantes sociales en salud mental."
    }
  ]
};

function selectAcademicPrinciples(caseData = {}) {
  const principles = academicFramework.principles;
  const variables = caseData.variables || {};
  const profile = caseData.socialProfile || {};
  const recognitions = caseData.recognitions || {};
  const selected = new Set(["salud-integral", "derecho-salud", "epidemiologia-prevencion"]);

  if (caseData.person?.age) selected.add("ciclo-vital");
  if (variables.redSocial?.active || caseData.tools?.sociogram?.applies) selected.add("promocion-salud");
  if (variables.dependencia?.active || recognitions.dependencyRecognized || recognitions.dependencyGrade) {
    selected.add("dependencia-autonomia");
    selected.add("diversidad-funcional");
  }
  if (recognitions.disabilityRecognized || Number(recognitions.disabilityPercent || 0) >= 33) {
    selected.add("diversidad-funcional");
  }
  if (variables.salud?.active || caseData.diagnosis?.code) selected.add("organizacion-sanitaria");
  if (variables.vulnerabilidad?.active || variables.situacionEconomica?.active) selected.add("educacion-salud");
  if (
    caseData.person?.originCountry ||
    caseData.person?.nationalStatus === "apatrida" ||
    ["irregular", "sin_documentacion", "asilo"].includes(profile.administrativeStatus)
  ) {
    selected.add("colectivos-especificos");
  }

  return principles.filter((principle) => selected.has(principle.id));
}

module.exports = { academicFramework, selectAcademicPrinciples };
