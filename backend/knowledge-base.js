const resources = {
  Madrid: [
    {
      name: "Centros de Servicios Sociales municipales",
      type: "Atencion social primaria",
      fit: ["vulnerabilidad", "exclusion", "dependencia", "renta", "familia"],
      description:
        "Puerta de entrada para valoracion social, plan de intervencion, prestaciones, ayuda a domicilio, emergencia social y derivacion comunitaria.",
      url: "https://www.madrid.es/portales/munimadrid/es/Inicio/Servicios-sociales-y-salud/Servicios-sociales/"
    },
    {
      name: "SAMUR Social",
      type: "Emergencia social",
      fit: ["sinhogarismo", "emergencia", "aislamiento", "exclusion"],
      description:
        "Recurso municipal para situaciones de urgencia social, calle, perdida brusca de alojamiento o desproteccion severa.",
      url: "https://www.madrid.es/portales/munimadrid/es/Inicio/Servicios-sociales-y-salud/Servicios-sociales/SAMUR-Social/"
    },
    {
      name: "Madrid Salud - Instituto de Adicciones",
      type: "Coordinacion sociosanitaria",
      fit: ["adiccion", "consumo", "familia", "jovenes"],
      description:
        "Red municipal para prevencion, orientacion y tratamiento de adicciones; util para coordinacion, reinsercion y trabajo socioeducativo familiar.",
      url: "https://madridsalud.es/"
    },
    {
      name: "Agencia para el Empleo de Madrid",
      type: "Insercion sociolaboral",
      fit: ["empleo", "precariedad", "autonomia", "formacion"],
      description:
        "Itinerarios de orientacion, formacion y mejora de empleabilidad para reforzar autonomia economica y movilidad social.",
      url: "https://www.madrid.es/portales/munimadrid/es/Inicio/Actividad-economica-y-hacienda/Empleo/"
    },
    {
      name: "Oficinas de atencion a la discapacidad y dependencia",
      type: "Autonomia personal",
      fit: ["discapacidad", "dependencia", "cuidados", "accesibilidad"],
      description:
        "Orientacion administrativa sobre reconocimiento de discapacidad, dependencia, apoyos, accesibilidad y recursos de proximidad.",
      url: "https://www.comunidad.madrid/servicios/asuntos-sociales/dependencia"
    }
  ],
  Barcelona: [
    {
      name: "Centres de Serveis Socials",
      type: "Atencion social primaria",
      fit: ["vulnerabilidad", "exclusion", "dependencia", "renta", "familia"],
      description:
        "Primer nivel de atencion social para diagnostico social, acompanamiento, prestaciones, red comunitaria y derivaciones especializadas.",
      url: "https://ajuntament.barcelona.cat/serveissocials/"
    },
    {
      name: "Servei d'Atencio Domiciliaria y Teleassistencia",
      type: "Apoyo en el domicilio",
      fit: ["dependencia", "cuidados", "mayores", "autonomia"],
      description:
        "Apoyos para mantener la vida cotidiana en el entorno habitual y prevenir aislamiento o institucionalizacion evitable.",
      url: "https://ajuntament.barcelona.cat/serveissocials/"
    },
    {
      name: "Barcelona Activa",
      type: "Insercion sociolaboral",
      fit: ["empleo", "precariedad", "formacion", "autonomia"],
      description:
        "Orientacion laboral, formacion y programas de mejora competencial para reforzar autonomia economica e inclusion.",
      url: "https://www.barcelonactiva.cat/"
    },
    {
      name: "Xarxa d'Atencio a les Drogodependencies",
      type: "Coordinacion sociosanitaria",
      fit: ["adiccion", "consumo", "familia", "jovenes"],
      description:
        "Dispositivos de atencion a drogodependencias; se recomienda coordinacion desde el rol socioeducativo sin sustituir la intervencion sanitaria.",
      url: "https://drogues.gencat.cat/"
    },
    {
      name: "XAPSLL - Red de atencion a personas sin hogar",
      type: "Inclusion residencial",
      fit: ["sinhogarismo", "vivienda", "exclusion", "emergencia"],
      description:
        "Red de entidades y servicios para alojamiento, acompanamiento social y reduccion de danos asociados a la exclusion residencial.",
      url: "https://ajuntament.barcelona.cat/serveissocials/"
    }
  ],
  Bilbao: [
    {
      name: "Servicios Sociales Municipales de Bilbao",
      type: "Atencion social primaria",
      fit: ["vulnerabilidad", "exclusion", "dependencia", "renta", "familia"],
      description:
        "Puerta de entrada municipal para valoracion social, apoyos de proximidad, prestaciones, dependencia y derivacion comunitaria.",
      url: "https://www.bilbao.eus/"
    },
    {
      name: "Lanbide - Servicio Vasco de Empleo",
      type: "Insercion sociolaboral",
      fit: ["empleo", "precariedad", "formacion", "autonomia"],
      description:
        "Orientacion laboral, formacion, intermediacion y apoyo a itinerarios de inclusion sociolaboral.",
      url: "https://www.lanbide.euskadi.eus/"
    },
    {
      name: "Gobierno Vasco - Servicios Sociales y Dependencia",
      type: "Autonomia personal",
      fit: ["dependencia", "discapacidad", "cuidados", "autonomia"],
      description:
        "Informacion sobre derechos, dependencia, discapacidad, envejecimiento, apoyo a familias y red de servicios sociales.",
      url: "https://www.euskadi.eus/servicios-sociales/"
    },
    {
      name: "Red de inclusion y recursos comunitarios de Bilbao",
      type: "Inclusion comunitaria",
      fit: ["exclusion", "sinhogarismo", "vivienda", "emergencia", "vulnerabilidad"],
      description:
        "Base de derivacion para situaciones de exclusion residencial, urgencia social, acompanamiento y participacion comunitaria.",
      url: "https://www.bilbao.eus/"
    }
  ],
  Valencia: [
    {
      name: "Centros Municipales de Servicios Sociales de Valencia",
      type: "Atencion social primaria",
      fit: ["vulnerabilidad", "exclusion", "dependencia", "renta", "familia"],
      description:
        "Primer nivel municipal para informacion, valoracion, diagnostico social, intervencion familiar y derivaciones.",
      url: "https://www.valencia.es/"
    },
    {
      name: "Labora - Servicio Valenciano de Empleo",
      type: "Insercion sociolaboral",
      fit: ["empleo", "precariedad", "formacion", "autonomia"],
      description:
        "Orientacion, formacion y programas de empleo para sostener autonomia economica y movilidad social.",
      url: "https://labora.gva.es/"
    },
    {
      name: "Generalitat Valenciana - Dependencia",
      type: "Autonomia personal",
      fit: ["dependencia", "discapacidad", "cuidados", "autonomia"],
      description:
        "Informacion sobre reconocimiento de dependencia, catalogo de servicios, prestaciones y apoyos para vida cotidiana.",
      url: "https://inclusio.gva.es/"
    },
    {
      name: "Vivienda y emergencia residencial",
      type: "Inclusion residencial",
      fit: ["exclusion", "sinhogarismo", "vivienda", "emergencia"],
      description:
        "Recurso de orientacion para riesgo residencial, emergencia social y coordinacion con servicios municipales.",
      url: "https://www.valencia.es/"
    }
  ]
};

const unirSources = [
  {
    id: "T1",
    title: "Fundamentos de la estructura social",
    evidence:
      "La estructura social se analiza desde individuos, grupos, macroestructura, microestructura, infraestructura, superestructura y desigualdad.",
    operationalRule:
      "Toda necesidad individual debe conectarse con relaciones, instituciones y condiciones materiales antes de proponer apoyos."
  },
  {
    id: "T2",
    title: "Perspectivas teoricas sobre la estructura social",
    evidence:
      "Durkheim, Parsons, Marx, Weber, Bourdieu y Bauman permiten leer cohesion, conflicto, poder, estatus, capitales y liquidez social.",
    operationalRule:
      "Combinar cohesion social, conflicto estructural, estatus y capital social/cultural para evitar explicaciones individualizantes."
  },
  {
    id: "T3",
    title: "Procesos de movilidad social",
    evidence:
      "La movilidad social y el cambio social explican ascensos, descensos, adscripcion de clase y barreras en trayectorias vitales.",
    operationalRule:
      "Detectar barreras de movilidad y proponer itinerarios de acceso a educacion, empleo, redes y recursos comunitarios."
  },
  {
    id: "T4",
    title: "Movilidad social y proceso de logro",
    evidence:
      "El logro de estatus depende de educacion, origen social, capital cultural, capital social y estructura de oportunidades.",
    operationalRule:
      "Traducir el diagnostico en objetivos alcanzables que amplien oportunidades, no solo en adaptaciones personales."
  },
  {
    id: "T5",
    title: "Estructura social contemporanea",
    evidence:
      "Globalizacion, democracia, familia, educacion, salud y brecha digital organizan desigualdades contemporaneas.",
    operationalRule:
      "Valorar brecha digital, apoyos familiares, acceso educativo, salud social y desigualdad territorial en la priorizacion."
  },
  {
    id: "T6",
    title: "Trabajo y empleo en sociedades contemporaneas",
    evidence:
      "El trabajo estructura ingresos, identidad, relaciones sociales y posicion social; la precariedad aumenta vulnerabilidad.",
    operationalRule:
      "Incluir empleabilidad, rutinas, competencias, adaptaciones y reconocimiento de derechos cuando haya riesgo laboral."
  },
  {
    id: "T7",
    title: "Estilos de vida, valores y creencias",
    evidence:
      "Los estilos de vida y el habitus influyen en practicas, aspiraciones, consumos, redes y pertenencia social.",
    operationalRule:
      "Acompanamiento centrado en la persona: pactar acciones culturalmente significativas y no imponer modelos normativos."
  },
  {
    id: "T8",
    title: "Estructura social y conflictos internacionales",
    evidence:
      "Los conflictos, movimientos sociales, economia sumergida y crisis ecologicas reorganizan oportunidades y riesgos.",
    operationalRule:
      "Considerar migracion, inseguridad, violencia, economia informal y crisis de contexto como factores estructurales."
  }
];

const theoryRules = [
  {
    id: "dependencia-autonomia",
    label: "Dependencia -> autonomia personal",
    triggers: ["dependencia", "discapacidad", "cuidados", "movilidad", "cognitivo", "autonomia"],
    dimensions: ["dependence", "autonomy"],
    action:
      "Priorizar apoyos graduados para actividades de la vida diaria, toma de decisiones, accesibilidad y permanencia en entorno comunitario."
  },
  {
    id: "vulnerabilidad-redes",
    label: "Vulnerabilidad -> red comunitaria",
    triggers: ["vulnerabilidad", "renta", "paro", "precariedad", "soledad", "familia", "red"],
    dimensions: ["vulnerability", "networks"],
    action:
      "Activar redes formales e informales, prestaciones, acompanamiento de proximidad y referentes comunitarios estables."
  },
  {
    id: "exclusion-inclusion",
    label: "Exclusion -> inclusion activa",
    triggers: ["exclusion", "sinhogar", "vivienda", "estigma", "migracion", "violencia"],
    dimensions: ["exclusion", "structural"],
    action:
      "Trabajar acceso a derechos, vivienda, documentacion, participacion comunitaria y reduccion de estigma."
  },
  {
    id: "capitales-bourdieu",
    label: "Capital social y cultural -> oportunidades",
    triggers: ["educacion", "formacion", "empleo", "capital", "clase", "estudios"],
    dimensions: ["educationEmployment", "networks"],
    action:
      "Aumentar capital cultural, social y competencial mediante itinerarios formativos, mentorias y conexiones con recursos."
  },
  {
    id: "precariedad-bauman",
    label: "Incertidumbre contemporanea -> apoyos flexibles",
    triggers: ["temporal", "precariedad", "inestable", "ansiedad", "liquida", "cambio"],
    dimensions: ["vulnerability", "educationEmployment"],
    action:
      "Secuenciar objetivos breves, revisables y realistas que reduzcan incertidumbre y sostengan rutinas significativas."
  },
  {
    id: "desigualdad-estructural",
    label: "Desigualdad -> no culpabilizacion",
    triggers: ["desigualdad", "pobreza", "brecha", "barrio", "origen", "genero"],
    dimensions: ["structural", "vulnerability"],
    action:
      "Explicar el caso desde barreras institucionales y desigualdad de oportunidades, evitando atribuciones moralizantes."
  }
];

const diagnosisProfiles = [
  {
    id: "mental-health",
    label: "Salud mental o malestar psicosocial",
    codes: [/^6A/i, /^6B/i],
    terms: ["depres", "ansiedad", "psicos", "bipolar", "estres", "trauma", "suic", "autoles", "salud mental"],
    socialNeeds: ["rutinas significativas", "red de apoyo", "participacion comunitaria", "reduccion de estigma"],
    risks: ["aislamiento", "interrupcion formativa o laboral", "estigma", "sobrecarga familiar"],
    protections: ["referente profesional estable", "vinculos cotidianos", "actividad estructurada", "acceso a derechos"],
    dependencyHint: "Puede requerir apoyos intermitentes para organizacion cotidiana, toma de decisiones y vinculacion comunitaria.",
    vulnerabilityHint: "La vulnerabilidad aumenta si hay soledad, precariedad, baja red familiar, vivienda insegura o estigma."
  },
  {
    id: "substance-use",
    label: "Consumo problematico o adicciones",
    codes: [/^6C/i],
    terms: ["adic", "alcohol", "cocaina", "cocaína", "cannabis", "juego", "ludopat", "consumo", "sustancia"],
    socialNeeds: ["reduccion de danos", "apoyo familiar", "alternativas de ocio", "reinsercion sociolaboral"],
    risks: ["ruptura de redes", "deuda", "conflicto familiar", "perdida de empleo o vivienda"],
    protections: ["motivacion al cambio", "red no consumidora", "recurso especializado", "plan de ocio saludable"],
    dependencyHint: "Puede haber dependencia social y funcional vinculada a rutinas de consumo, economia informal o perdida de autonomia.",
    vulnerabilityHint: "La vulnerabilidad se expresa en deterioro de redes, estigma, precariedad economica y riesgo de exclusion."
  },
  {
    id: "neurodevelopment",
    label: "Neurodesarrollo, discapacidad o aprendizaje",
    codes: [/^6A0/i, /^6A0Z/i, /^LD/i],
    terms: ["tea", "autismo", "tdah", "discapacidad", "intelectual", "aprendizaje", "desarrollo", "neurodesarrollo"],
    socialNeeds: ["apoyos educativos", "accesibilidad cognitiva", "participacion familiar", "habilidades para la autonomia"],
    risks: ["barrera educativa", "sobrecarga de cuidados", "dependencia institucional", "aislamiento"],
    protections: ["adaptaciones", "familia implicada", "apoyo escolar", "entorno accesible"],
    dependencyHint: "Requiere valorar apoyos graduados para autonomia personal, comunicacion, aprendizaje y vida comunitaria.",
    vulnerabilityHint: "La vulnerabilidad depende de barreras institucionales, accesibilidad, recursos familiares y capital social disponible."
  },
  {
    id: "cognitive-ageing",
    label: "Deterioro cognitivo, envejecimiento o dependencia",
    codes: [/^8A/i, /^8B/i, /^8D/i],
    terms: ["demencia", "alzheimer", "deterioro", "mayor", "dependencia", "cuidador", "cuidadora", "movilidad reducida"],
    socialNeeds: ["apoyo a cuidadores", "permanencia en domicilio", "prevencion de aislamiento", "teleasistencia"],
    risks: ["sobrecarga familiar", "soledad", "caidas", "perdida de autonomia"],
    protections: ["red vecinal", "servicio de ayuda a domicilio", "adaptacion del hogar", "seguimiento comunitario"],
    dependencyHint: "La dimension de dependencia es central: apoyos cotidianos, accesibilidad, seguridad y decisiones anticipadas.",
    vulnerabilityHint: "La vulnerabilidad aumenta con soledad, bajos ingresos, vivienda no adaptada y fragilidad de la red de cuidados."
  },
  {
    id: "chronic-health",
    label: "Condicion cronica con impacto social",
    codes: [/^BA/i, /^CA/i, /^DB/i, /^FA/i, /^MG/i],
    terms: ["cronica", "crónica", "dolor", "fatiga", "diabetes", "cardio", "respiratoria", "cancer", "cáncer"],
    socialNeeds: ["adaptacion de rutinas", "accesibilidad", "coordinacion sociosanitaria", "continuidad formativa o laboral"],
    risks: ["abandono laboral", "empobrecimiento", "dependencia sobrevenida", "aislamiento"],
    protections: ["autogestion cotidiana", "red familiar", "adaptaciones laborales", "servicios de proximidad"],
    dependencyHint: "Puede requerir apoyos variables para mantener vida independiente y participacion social.",
    vulnerabilityHint: "La vulnerabilidad se agrava si la condicion cronica se combina con empleo precario o baja red de apoyo."
  }
];

const pilots = [
  {
    title: "Ansiedad, empleo precario y aislamiento",
    input:
      "6B00 ansiedad generalizada. Mujer de 24 anos en Madrid, contrato temporal, vive en habitacion alquilada, baja red familiar y abandono reciente de estudios."
  },
  {
    title: "Dependencia sobrevenida y cuidadora familiar",
    input:
      "6D80 demencia debida a la enfermedad de Alzheimer. Hombre de 78 anos en Barcelona, vive con su hija cuidadora, barreras en vivienda y escasa red vecinal."
  },
  {
    title: "Consumo problematico y exclusion residencial",
    input:
      "6C40 consumo problematico de alcohol. Hombre de 41 anos en Madrid, desempleo de larga duracion, deuda, conflicto familiar y riesgo de sinhogarismo."
  },
  {
    title: "Neurodesarrollo y transicion a vida adulta",
    input:
      "6A02 trastorno del espectro autista. Joven de 19 anos en Barcelona, finaliza FP basica, dificultades de participacion social y familia con sobrecarga."
  }
];

module.exports = {
  diagnosisProfiles,
  pilots,
  resources,
  theoryRules,
  unirSources
};
