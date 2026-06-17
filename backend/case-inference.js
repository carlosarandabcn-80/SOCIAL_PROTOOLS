const { academicFramework, selectAcademicPrinciples } = require("./academic-framework");
const { recommendResources } = require("./social-resources");

const variableLabels = {
  salud: "Salud",
  dependencia: "Dependencia",
  vulnerabilidad: "Vulnerabilidad social",
  contextoFamiliar: "Contexto familiar",
  redSocial: "Red social",
  situacionEconomica: "Situacion economica"
};

const healthIssueRules = [
  {
    id: "opioides",
    patterns: ["heroina", "heroína", "opioide", "opioides", "metadona"],
    label: "Trastornos debidos al uso de opioides",
    code: "6C43",
    chapter: "Trastornos mentales, del comportamiento y del neurodesarrollo",
    needs: [
      "Vinculacion sostenida a recurso especializado en drogodependencias.",
      "Acompanamiento social para adherencia, reduccion de danos y continuidad terapeutica.",
      "Intervencion sobre empleo, ingresos, vivienda y red familiar para reducir recaidas."
    ],
    prevention: {
      primary: "Educacion para la salud, prevencion comunitaria del consumo, informacion sobre riesgos y alternativas de ocio/red.",
      secondary: "Deteccion precoz de recaida, derivacion a CAD/UCA, seguimiento motivacional y coordinacion con atencion primaria.",
      tertiary: "Reduccion de danos, mantenimiento del tratamiento, comunidad terapeutica si procede, reinsercion sociolaboral y prevencion de recaidas."
    }
  },
  {
    id: "cannabis",
    patterns: ["cannabis", "hachis", "marihuana"],
    label: "Trastornos debidos al uso de cannabis",
    code: "6C41",
    chapter: "Trastornos mentales, del comportamiento y del neurodesarrollo",
    needs: [
      "Evaluar impacto funcional del consumo en sueño, estado de animo, rutinas y convivencia.",
      "Intervencion psicoeducativa y coordinacion con salud mental o adicciones si procede.",
      "Plan de habitos saludables y alternativas comunitarias."
    ],
    prevention: {
      primary: "Informacion preventiva sobre consumo, salud mental, sueño y toma de decisiones.",
      secondary: "Identificar agravamiento de sintomas, consumo problematico y situaciones de riesgo.",
      tertiary: "Apoyar abandono/reduccion, tratamiento especializado y reparacion de rutinas y vinculos."
    }
  },
  {
    id: "alcohol",
    patterns: ["alcohol", "alcoholismo", "dependencia del alcohol"],
    label: "Trastornos debidos al uso de alcohol",
    code: "6C40",
    chapter: "Trastornos mentales, del comportamiento y del neurodesarrollo",
    needs: [
      "Valoracion de consumo, conciencia de problema y repercusion familiar/social.",
      "Derivacion a recurso especializado y apoyo socioeducativo de adherencia.",
      "Trabajo familiar para limites, corresponsabilidad y prevencion de normalizacion del consumo."
    ],
    prevention: {
      primary: "Educacion familiar y comunitaria sobre riesgos del alcohol y habitos saludables.",
      secondary: "Cribado, deteccion temprana y derivacion antes de cronificacion o deterioro social.",
      tertiary: "Tratamiento especializado, prevencion de recaidas, apoyo familiar e insercion sociolaboral."
    }
  },
  {
    id: "ansiedad",
    patterns: ["ansiedad", "ansioso", "ansiosa"],
    label: "Trastorno de ansiedad generalizada / sintomas de ansiedad",
    code: "6B00",
    chapter: "Trastornos mentales, del comportamiento y del neurodesarrollo",
    needs: [
      "Apoyo emocional no clinico, reduccion de estresores sociales y mejora de red de apoyo.",
      "Coordinacion con atencion primaria/salud mental cuando exista afectacion funcional.",
      "Rutinas saludables, autocuidado y pautas de comunicacion familiar."
    ],
    prevention: {
      primary: "Promocion de bienestar emocional, redes de apoyo y habitos protectores.",
      secondary: "Deteccion de agravamiento, insomnio, somatizacion o aislamiento.",
      tertiary: "Acompanamiento para adherencia a tratamiento indicado y reduccion de impacto familiar/social."
    }
  },
  {
    id: "depresion",
    patterns: ["depresion", "depresión", "apatia", "apatía"],
    label: "Trastorno depresivo / sintomas depresivos",
    code: "6A70",
    chapter: "Trastornos mentales, del comportamiento y del neurodesarrollo",
    needs: [
      "Valorar aislamiento, perdida de actividad significativa y riesgo social asociado.",
      "Activacion conductual socioeducativa y reconexion con apoyos formales/informales.",
      "Derivacion sanitaria si hay ideacion autolesiva, deterioro intenso o sintomas persistentes."
    ],
    prevention: {
      primary: "Promover vinculos, participacion y factores protectores de salud mental.",
      secondary: "Detectar sintomas persistentes y barreras de acceso a ayuda profesional.",
      tertiary: "Sostener tratamiento, prevenir recaidas y reconstruir proyecto cotidiano."
    }
  },
  {
    id: "insomnio",
    patterns: ["insomnio", "sueno", "sueño"],
    label: "Trastornos de insomnio",
    code: "7A0Z",
    chapter: "Trastornos del sueño y la vigilia",
    needs: [
      "Educacion para la salud sobre sueño, rutinas y consumo de sustancias.",
      "Explorar relacion con ansiedad, depresion, consumo y convivencia familiar.",
      "Coordinar con atencion primaria si persiste o deteriora funcionamiento."
    ],
    prevention: {
      primary: "Higiene del sueño y reduccion de factores ambientales/consumo.",
      secondary: "Seguimiento temprano de empeoramiento y repercusion funcional.",
      tertiary: "Apoyo a tratamiento indicado y recuperacion de rutinas."
    }
  },
  {
    id: "artrosis",
    patterns: ["artrosis", "osteoartrosis", "osteoartritis"],
    label: "Osteoartrosis / osteoartritis",
    code: "FA0Z",
    chapter: "Enfermedades del sistema musculoesqueletico o del tejido conjuntivo",
    needs: [
      "Valorar dolor, movilidad, sobrecarga de cuidados y limitaciones en actividades diarias.",
      "Promover accesibilidad, adaptaciones domesticas y apoyo a autonomia.",
      "Coordinar con recursos sanitarios y sociales si limita cuidado familiar o autocuidado."
    ],
    prevention: {
      primary: "Promocion de actividad adaptada, ergonomia y autocuidado.",
      secondary: "Deteccion de perdida funcional, dolor persistente y barreras domesticas.",
      tertiary: "Adaptaciones, rehabilitacion indicada, apoyo en cuidados y prevencion de dependencia."
    }
  }
];

function normalize(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function detectFamilyHealth(caseData = {}) {
  if (caseData.familyHealthApplies === false) {
    return {
      enabled: false,
      detected: [],
      members: [],
      assignment: []
    };
  }

  const explicitIssues = (caseData.familyHealthIssues || []).map((issue) => {
    const matched = healthIssueRules.find(
      (rule) =>
        rule.code === issue.code ||
        rule.id === issue.id ||
        normalize(rule.label) === normalize(issue.label)
    );
    if (matched) return { ...matched, person: issue.person, role: issue.role };
    return {
      id: issue.id || `explicit-${issue.code || issue.label}`,
      label: issue.label || "Problema de salud pendiente de clasificacion",
      code: issue.code || "CIE-11 pendiente",
      chapter: issue.chapter || "Pendiente de confirmacion CIE-11",
      person: issue.person,
      role: issue.role,
      needs: [
        "Confirmar informacion disponible, fuente y alcance funcional antes de formular conclusiones.",
        "Valorar impacto en autonomia, cuidados, convivencia, empleo, estudios y acceso a recursos.",
        "Coordinar, si procede, con atencion primaria, salud mental, servicios sociales o recurso especializado."
      ],
      prevention: {
        primary: "Promocion de salud, informacion comprensible y reduccion de factores sociales de riesgo.",
        secondary: "Deteccion temprana de agravamiento, barreras de acceso y necesidades de apoyo.",
        tertiary: "Acompanamiento para continuidad de cuidados, adherencia indicada y reduccion de dano social."
      }
    };
  });

  const sources = [
    caseData.familyHealthProblems,
    caseData.context,
    caseData.indications,
    ...(caseData.familyHealthIssues || []).map((issue) => `${issue.person || ""} ${issue.code || ""} ${issue.label || ""}`),
    ...(caseData.family?.members || []).map((member) => `${member.name || ""} ${member.role || ""} ${member.notes || ""}`)
  ];
  const text = normalize(sources.filter(Boolean).join(" "));
  const detectedByKey = new Map();

  explicitIssues.forEach((issue) => {
    detectedByKey.set(`${issue.code}-${normalize(issue.label)}`, issue);
  });

  healthIssueRules.forEach((rule) => {
    if (rule.patterns.some((pattern) => text.includes(normalize(pattern)))) {
      detectedByKey.set(`${rule.code}-${normalize(rule.label)}`, rule);
    }
  });
  const detected = [...detectedByKey.values()];

  const members = [];
  const raw = String(sources.filter(Boolean).join(" "));
  const memberHints = [
    { who: "Persona usuaria", patterns: ["varon", "varón", "persona usuaria", "usuario", "45"] },
    { who: "Padre", patterns: ["padre"] },
    { who: "Madre", patterns: ["madre"] },
    { who: "Hermano", patterns: ["hermano"] }
  ];
  memberHints.forEach((member) => {
    const memberText = normalize(raw);
    if (member.patterns.some((pattern) => memberText.includes(normalize(pattern)))) members.push(member.who);
  });

  const explicitAssignment = explicitIssues.map((issue) => ({
    person: issue.person || "Unidad familiar",
    issueId: issue.id,
    code: issue.code,
    label: issue.label
  }));

  const inferredAssignment = detected.map((issue) => {
    if (explicitAssignment.some((item) => item.code === issue.code && item.label === issue.label)) return null;
    const id = issue.id;
    let person = "Unidad familiar";
    if (["opioides", "cannabis", "depresion", "insomnio"].includes(id)) person = "Persona usuaria";
    if (id === "artrosis") person = "Padre";
    if (id === "ansiedad" && normalize(raw).includes("madre")) person = "Madre / persona usuaria si consta en el relato";
    if (id === "alcohol") person = "Hermano";
    return { person, issueId: issue.id, code: issue.code, label: issue.label };
  }).filter(Boolean);
  const assignment = [...explicitAssignment, ...inferredAssignment];

  return {
    enabled: Boolean(caseData.includePreventionProgram || caseData.familyHealthProblems || explicitIssues.length),
    detected,
    members: [...new Set([...members, ...explicitIssues.map((issue) => issue.person).filter(Boolean)])],
    assignment
  };
}

function activeVariables(variables = {}) {
  return Object.entries(variables)
    .filter(([, variable]) => variable?.active)
    .map(([key, variable]) => ({ key, label: variableLabels[key] || key, ...variable }));
}

function infer(caseData = {}) {
  const variables = caseData.variables || {};
  const recognitions = caseData.recognitions || {};
  const socialProfile = caseData.socialProfile || {};
  const active = activeVariables(variables);
  const averageSeverity = active.length
    ? Math.round(active.reduce((sum, item) => sum + Number(item.severity || 0), 0) / active.length)
    : 0;
  const findings = [];
  let priorityScore = averageSeverity;

  const isActive = (key) => Boolean(variables[key]?.active);
  const severity = (key) => Number(variables[key]?.severity || 0);
  const dualDiagnosis = caseData.dualDiagnosis || {};
  const dualCodes = (dualDiagnosis.diagnoses || []).filter(Boolean);

  if (isActive("vulnerabilidad") && isActive("redSocial") && severity("redSocial") >= 65) {
    findings.push({
      id: "aislamiento-vulnerabilidad",
      level: "alto",
      text:
        "La combinacion de vulnerabilidad social y red social fragil incrementa riesgo de aislamiento, discontinuidad de apoyos y dependencia institucional."
    });
    priorityScore += 15;
  }

  if (isActive("salud") && isActive("dependencia")) {
    findings.push({
      id: "salud-dependencia",
      level: "medio",
      text:
        "La coexistencia de necesidad de salud y dependencia exige coordinacion sociosanitaria, apoyos graduados y proteccion de autonomia personal."
    });
    priorityScore += 12;
  }

  if (dualDiagnosis.applies) {
    findings.push({
      id: "patologia-dual",
      level: dualCodes.length >= 2 ? "alto" : "medio",
      text:
        "La patologia dual o diagnostico combinado requiere abordaje integrado, coordinacion sociosanitaria y especial cautela para no fragmentar la intervencion entre salud mental, adicciones, red y recursos sociales."
    });
    priorityScore += dualCodes.length >= 2 ? 16 : 9;
  }

  if (isActive("situacionEconomica") && severity("situacionEconomica") >= 70) {
    findings.push({
      id: "precariedad",
      level: "alto",
      text:
        "La precariedad economica opera como determinante social que puede limitar adherencia, participacion y acceso efectivo a derechos."
    });
    priorityScore += 12;
  }

  if (caseData.tools?.sociogram?.applies && Number(caseData.tools.sociogram.isolation || 0) >= 70) {
    findings.push({
      id: "sociograma-aislamiento",
      level: "alto",
      text:
        "El sociograma apunta a aislamiento social relevante; conviene priorizar reconstruccion de red, referentes y espacios comunitarios seguros."
    });
    priorityScore += 14;
  }

  if (caseData.tools?.genogram?.applies && Number(caseData.tools.genogram.conflict || 0) >= 60) {
    findings.push({
      id: "genograma-conflicto",
      level: "medio",
      text:
        "El genograma muestra tension familiar significativa; el plan debe diferenciar apoyo disponible, vinculos de riesgo y limites de intervencion."
    });
    priorityScore += 10;
  }

  if (recognitions.vulnerabilityCertificate || ["grave", "emergencia"].includes(recognitions.vulnerabilityLevel)) {
    findings.push({
      id: "vulnerabilidad-reconocida",
      level: recognitions.vulnerabilityLevel === "emergencia" ? "alto" : "medio",
      text:
        "La existencia de certificado, informe o nivel de vulnerabilidad reconocido refuerza la necesidad de intervencion coordinada, acceso a prestaciones y seguimiento institucional."
    });
    priorityScore += recognitions.vulnerabilityLevel === "emergencia" ? 16 : 10;
  }

  if (recognitions.disabilityRecognized || Number(recognitions.disabilityPercent || 0) >= 33) {
    findings.push({
      id: "discapacidad-reconocida",
      level: Number(recognitions.disabilityPercent || 0) >= 65 ? "alto" : "medio",
      text:
        "La discapacidad reconocida exige lectura de accesibilidad, ajustes razonables, apoyos para la autonomia y proteccion frente a barreras sociales."
    });
    priorityScore += Number(recognitions.disabilityPercent || 0) >= 65 ? 14 : 8;
  }

  if (recognitions.dependencyRecognized || recognitions.dependencyGrade) {
    findings.push({
      id: "dependencia-reconocida",
      level: ["grado_ii", "grado_iii"].includes(recognitions.dependencyGrade) ? "alto" : "medio",
      text:
        "La dependencia reconocida orienta el caso hacia apoyos graduados, continuidad de cuidados, respiro familiar y coordinacion con el sistema de autonomia personal."
    });
    priorityScore += recognitions.dependencyGrade === "grado_iii" ? 18 : recognitions.dependencyGrade === "grado_ii" ? 14 : 9;
  }

  if (["irregular", "sin_documentacion", "asilo"].includes(socialProfile.administrativeStatus)) {
    findings.push({
      id: "situacion-administrativa",
      level: socialProfile.administrativeStatus === "irregular" ? "alto" : "medio",
      text:
        "La situacion administrativa exige cautela profesional, orientacion a derechos, acompanamiento documental y coordinacion con recursos especializados en inclusion."
    });
    priorityScore += socialProfile.administrativeStatus === "irregular" ? 15 : 10;
  }

  if (["sin_permiso", "denegado", "caducado"].includes(socialProfile.residencePermit)) {
    findings.push({
      id: "permiso-residencia-trabajo",
      level: "alto",
      text:
        "La ausencia, caducidad o denegacion del permiso de residencia/trabajo puede bloquear empleo formal, prestaciones, vivienda y continuidad del itinerario."
    });
    priorityScore += 13;
  }

  if (["desempleo_larga_duracion", "sin_prestacion", "economia_informal"].includes(socialProfile.employmentStatus)) {
    findings.push({
      id: "desempleo-vulnerabilidad",
      level: socialProfile.employmentStatus === "sin_prestacion" ? "alto" : "medio",
      text:
        "La situacion laboral requiere un itinerario sociolaboral realista, coordinado con prestaciones, salud y recuperacion de rutinas."
    });
    priorityScore += socialProfile.employmentStatus === "sin_prestacion" ? 14 : 10;
  }

  if (["sin_ingresos", "deudas", "ingresos_bajos"].includes(socialProfile.incomeStatus)) {
    findings.push({
      id: "ingresos-insuficientes",
      level: socialProfile.incomeStatus === "sin_ingresos" ? "alto" : "medio",
      text:
        "Los ingresos insuficientes o inexistentes actuan como determinante social de salud y pueden comprometer adherencia, vivienda, alimentacion y participacion."
    });
    priorityScore += socialProfile.incomeStatus === "sin_ingresos" ? 15 : 9;
  }

  if (["sin_estudios", "no_homologados"].includes(socialProfile.educationLevel)) {
    findings.push({
      id: "formacion-barrera",
      level: "medio",
      text:
        "La ausencia de estudios acreditados o la falta de homologacion orienta a acciones de alfabetizacion, acreditacion de competencias, formacion ocupacional y acompanamiento."
    });
    priorityScore += 6;
  }

  const priority =
    priorityScore >= 82 ? "Alta" : priorityScore >= 58 ? "Media-alta" : priorityScore >= 35 ? "Media" : "Preventiva";

  const recommendedResources = recommendResources(caseData.city || "Madrid", variables).slice(0, 6);

  return {
    active,
    averageSeverity,
    findings,
    priority,
    priorityScore: Math.min(100, priorityScore),
    recommendedResources
  };
}

function validation(caseData = {}) {
  const warnings = [];
  const dualCount = (caseData.dualDiagnosis?.diagnoses || []).filter(Boolean).length;
  if (!caseData.person?.name && !caseData.person?.code) warnings.push("Falta identificacion o codigo de caso.");
  if (!caseData.person?.age || Number(caseData.person.age) <= 0) warnings.push("Falta edad o etapa vital de la persona.");
  if (!caseData.diagnosis?.code && !(caseData.dualDiagnosis?.applies && dualCount === 2)) {
    warnings.push("Falta seleccionar patologia CIE-11.");
  }
  if (caseData.dualDiagnosis?.applies && dualCount < 2) {
    warnings.push("Patologia dual activada: faltan dos codigos CIE-11 completos.");
  }
  if (!caseData.city) warnings.push("Falta seleccionar ciudad.");
  if (!activeVariables(caseData.variables).length) warnings.push("Faltan variables por definir.");
  if (caseData.recognitions?.disabilityRecognized && !caseData.recognitions?.disabilityPercent) {
    warnings.push("Discapacidad reconocida marcada sin porcentaje registrado.");
  }
  if (caseData.recognitions?.dependencyRecognized && !caseData.recognitions?.dependencyGrade) {
    warnings.push("Dependencia reconocida marcada sin grado o situacion administrativa.");
  }
  const toolLabels = {
    genogram: "genograma",
    sociogram: "sociograma",
    resourceMap: "mapa de recursos"
  };
  Object.entries(toolLabels).forEach(([tool, label]) => {
    if (caseData.tools?.[tool]?.applies && caseData.tools?.[tool]?.evaluated === false) {
      warnings.push(`Herramienta activa pendiente de evaluar: ${label}.`);
    }
  });
  return warnings;
}

function lifeStage(ageValue) {
  const age = Number(ageValue);
  if (!Number.isFinite(age) || age <= 0) return "no registrada";
  if (age < 12) return "infancia";
  if (age < 18) return "adolescencia";
  if (age < 30) return "juventud";
  if (age < 65) return "adultez";
  return "vejez";
}

function asList(values = []) {
  return values.filter(Boolean).map((value) => String(value));
}

function dualDiagnosisSummary(dualDiagnosis = {}) {
  if (!dualDiagnosis.applies) return "";
  const codes = (dualDiagnosis.diagnoses || [])
    .filter(Boolean)
    .map((diagnosis) => `${diagnosis.code} - ${diagnosis.title}`)
    .join(" + ");
  return [codes || "codigos CIE-11 pendientes", dualDiagnosis.notes ? `observaciones: ${dualDiagnosis.notes}` : ""]
    .filter(Boolean)
    .join("; ");
}

function buildProfessionalSynthesis(caseData = {}, inference = {}, familyHealth = {}, academicPrinciples = []) {
  const active = inference.active?.map((item) => item.label).join(", ") || "sin dimensiones activas suficientes";
  const dualSummary = dualDiagnosisSummary(caseData.dualDiagnosis);
  const profile = caseData.socialProfile || {};
  const recognitions = caseData.recognitions || {};
  const administrativeBarrier = [
    profile.administrativeStatusLabel,
    profile.residencePermitLabel,
    profile.employmentStatusLabel,
    profile.incomeStatusLabel
  ]
    .filter(Boolean)
    .join("; ");
  const supportMap = [
    caseData.tools?.genogram?.applies ? "genograma" : "",
    caseData.tools?.sociogram?.applies ? "sociograma" : "",
    caseData.tools?.resourceMap?.applies ? "mapa de recursos" : ""
  ]
    .filter(Boolean)
    .join(", ");
  const academicAxis = academicPrinciples.map((principle) => principle.source.replace(/^Tema /, "T")).join("; ");

  return [
    {
      title: "Formulacion provisional del caso",
      text:
        `El caso se formula como una situacion de analisis socioeducativo provisional con prioridad ${String(inference.priority || "preventiva").toLowerCase()} ` +
        `y una puntuacion orientativa de ${inference.priorityScore || 0}/100. Las dimensiones activas son: ${active}. ` +
        `${dualSummary ? `Consta patologia dual o diagnostico combinado (${dualSummary}), que debe interpretarse con especial cautela clinica y social. ` : ""}` +
        `La finalidad no es cerrar un diagnostico sanitario, sino ordenar necesidades, apoyos, barreras y decisiones educativas verificables.`
    },
    {
      title: "Hipotesis socioeducativa",
      text:
        `La hipotesis principal situa la vulnerabilidad como resultado de la interaccion entre salud, dependencia, red de apoyo, condiciones materiales y acceso efectivo a derechos. ` +
        `${administrativeBarrier ? `El perfil administrativo, formativo, laboral o economico registrado (${administrativeBarrier}) puede actuar como determinante social de salud y exclusion. ` : ""}` +
        `${familyHealth.detected?.length ? `La salud de la unidad familiar introduce necesidades diferenciadas de cuidado, prevencion y coordinacion. ` : ""}` +
        `La intervencion debe evitar explicaciones individualizantes y trabajar sobre entornos, recursos, accesibilidad y participacion.`
    },
    {
      title: "Logica de intervencion",
      text:
        `La propuesta se organiza en acogida, diagnostico psicosocial operativo, plan individualizado y seguimiento evaluable. ` +
        `${supportMap ? `Las herramientas activas (${supportMap}) deben utilizarse para contrastar red, vinculos, aislamiento, recursos disponibles y barreras reales. ` : ""}` +
        `El itinerario debe combinar educacion para la salud, acompanamiento a derechos, activacion comunitaria, coordinacion sociosanitaria y objetivos pequenos, medibles y revisables.`
    },
    {
      title: "Criterio academico y prudencia profesional",
      text:
        `La lectura se alinea con la asignatura Salud, Dependencia y Vulnerabilidad Social del Grado de Educacion Social de UNIR, especialmente con ${academicAxis || "los temas de salud integral, derecho a la salud, prevencion y dependencia"}. ` +
        `El informe debe considerarse una base academica de trabajo: requiere entrevista, consentimiento informado, contraste documental, participacion de la persona usuaria y derivacion especializada cuando existan riesgos clinicos, violencia, emergencia social o desproteccion.`
    }
  ];
}

function buildInterventionProgram(caseData = {}, inference = {}, familyHealth = {}) {
  const variables = caseData.variables || {};
  const profile = caseData.socialProfile || {};
  const recognitions = caseData.recognitions || {};
  const stage = lifeStage(caseData.person?.age);
  const selectedResources = caseData.tools?.resourceMap?.selected || [];
  const academicPrinciples = selectAcademicPrinciples(caseData);
  const highPriority = ["Alta", "Media-alta"].includes(inference.priority);
  const hasDualDiagnosis = Boolean(caseData.dualDiagnosis?.applies);
  const needsHealth = Boolean(variables.salud?.active || caseData.diagnosis?.code || hasDualDiagnosis || familyHealth.detected?.length);
  const needsNetwork = Boolean(variables.redSocial?.active || caseData.tools?.sociogram?.applies);
  const needsEmployment = ["desempleo_larga_duracion", "sin_prestacion", "economia_informal", "empleo_precario"].includes(
    profile.employmentStatus
  );
  const needsRights = Boolean(
    ["irregular", "sin_documentacion", "asilo"].includes(profile.administrativeStatus) ||
      ["sin_permiso", "denegado", "caducado"].includes(profile.residencePermit) ||
      caseData.person?.nationalStatus === "apatrida"
  );
  const needsDependency = Boolean(
    variables.dependencia?.active ||
      recognitions.dependencyRecognized ||
      recognitions.dependencyGrade ||
      recognitions.disabilityRecognized
  );

  const objectives = asList([
    "Construir una alianza socioeducativa segura, con consentimiento, privacidad y lenguaje no patologizante.",
    `Ajustar el plan al ciclo vital (${stage}) y a las condiciones reales de vivienda, ingresos, red y territorio.`,
    needsHealth ? "Traducir el diagnostico o indicios de salud en apoyos cotidianos, educacion para la salud y coordinacion prudente." : "",
    hasDualDiagnosis ? "Integrar patologia dual sin fragmentar el caso: salud mental, consumo, red social, adherencia, dano social y recursos especializados." : "",
    needsRights ? "Reducir barreras juridico-administrativas y garantizar acompanamiento a derechos basicos sin discriminacion." : "",
    needsDependency ? "Revisar apoyos de autonomia, accesibilidad, cuidados, reconocimiento de dependencia/discapacidad y continuidad comunitaria." : "",
    needsNetwork ? "Fortalecer red informal y formal mediante sociograma, referentes seguros y participacion comunitaria." : "",
    needsEmployment ? "Activar un itinerario sociolaboral graduado que combine estabilizacion, formacion, competencias y empleo protegido o normalizado segun proceda." : ""
  ]);

  const methodology = asList([
    "Entrevista social semiestructurada y observacion profesional diferenciando hechos, relato, hipotesis e indicios.",
    "Genograma y sociograma para valorar apoyos, conflictos, aislamiento y sobrecarga familiar.",
    "Mapa de recursos para asignar servicios institucionales, tercer sector y apoyos comunitarios del territorio.",
    "Educacion para la salud basada en habilidades: informacion comprensible, autocuidado posible, rutinas y reduccion de danos.",
    hasDualDiagnosis ? "Plan coordinado de patologia dual con derivacion prudente, reduccion de danos, continuidad de vinculo y seguimiento compartido." : "",
    "Coordinacion interprofesional con servicios sociales, atencion primaria, salud mental, empleo, vivienda o dependencia segun necesidades.",
    highPriority ? "Seguimiento intensivo inicial y plan de contingencia ante emergencia social, violencia, ideacion autolesiva o perdida residencial." : "Seguimiento quincenal o mensual con objetivos observables y revision de barreras."
  ]);

  const prevention = {
    primary: asList([
      "Promover entornos protectores, informacion accesible, vinculos comunitarios y habitos saludables sin culpabilizacion.",
      "Reforzar competencias personales y sociales: gestion de citas, comunicacion con servicios, autocuidado, economia domestica y participacion.",
      hasDualDiagnosis ? "Trabajar prevencion de consumo de riesgo, estigma, aislamiento y abandono temprano de recursos." : "",
      needsRights ? "Orientar sobre empadronamiento, documentacion, interpretacion linguistica y acceso normalizado a servicios." : ""
    ]),
    secondary: asList([
      "Detectar precozmente agravamiento de salud, aislamiento, sobrecarga, perdida de vivienda, endeudamiento o abandono de itinerarios.",
      "Definir senales de alerta y responsables de contacto, incluyendo persona usuaria, referente social y recurso comunitario.",
      hasDualDiagnosis ? "Identificar recaidas, consumo problematizado, descompensacion emocional, no asistencia a citas y rupturas de apoyo." : "",
      familyHealth.detected?.length ? "Separar necesidades de cada miembro familiar para evitar invisibilizar cuidados o cargar el problema en una sola persona." : ""
    ]),
    tertiary: asList([
      "Sostener adherencia a recursos indicados, rehabilitacion social, reduccion de danos y recuperacion de proyecto cotidiano.",
      "Prevenir recaidas sociales: aislamiento, ruptura de red, perdida de ingresos, interrupcion formativa/laboral o institucionalizacion evitable.",
      hasDualDiagnosis ? "Coordinar recuperacion psicosocial, reduccion de danos y recursos especializados evitando culpabilizacion o exclusion por recaidas." : "",
      needsDependency ? "Ajustar apoyos y accesibilidad para permanencia comunitaria y descanso de personas cuidadoras." : ""
    ])
  };

  const selectedResourceNames = selectedResources
    .map((resource) => (typeof resource === "string" ? resource : resource?.name))
    .filter(Boolean);
  const resourceNames = selectedResourceNames.length
    ? selectedResourceNames
    : (inference.recommendedResources || []).map((resource) => resource.name).filter(Boolean);
  const phaseMeta = [
    {
      timeframe: highPriority ? "0-72 horas y primera entrevista" : "Primera semana",
      focus: "seguridad, vinculo y consentimiento"
    },
    {
      timeframe: "Semana 1-2",
      focus: "diagnostico psicosocial operativo"
    },
    {
      timeframe: highPriority ? "Semanas 2-4" : "Semanas 2-6",
      focus: "plan individualizado y activacion de recursos"
    },
    {
      timeframe: highPriority ? "Revision semanal inicial y evaluacion a 30 dias" : "Revision quincenal o mensual y evaluacion a 60-90 dias",
      focus: "seguimiento, evaluacion y ajuste"
    }
  ];
  const phases = academicFramework.interventionModel.map((phase, index) => {
    const phaseActions = asList([
      index === 0 ? "Validar demanda, urgencias, privacidad, consentimiento informado y expectativas de la persona usuaria." : "",
      index === 0 && highPriority
        ? "Explorar riesgo inmediato: emergencia social, violencia, perdida residencial, ideacion autolesiva, desproteccion o necesidad sanitaria urgente."
        : "",
      index === 0 && needsRights ? "Comprobar empadronamiento, documentacion disponible, interpretacion linguistica y barreras de acceso a servicios." : "",
      index === 0 && needsHealth ? "Diferenciar diagnostico confirmado, indicios, relato de la persona y necesidades de apoyo sin emitir juicio clinico." : "",
      index === 1 ? "Cruzar CIE-11, variables activas, vivienda, empleo, estudios, origen, derechos, ingresos y apoyos reconocidos." : "",
      index === 1 && caseData.tools?.genogram?.applies ? "Analizar genograma: parentesco, apoyos, conflictos, cuidados, sobrecargas y salud asociada a familiares." : "",
      index === 1 && caseData.tools?.sociogram?.applies ? "Analizar sociograma: nodos seguros, vinculos de riesgo, intensidad relacional, aislamiento y espacios comunitarios posibles." : "",
      index === 1 && familyHealth.detected?.length ? "Separar necesidades de salud de cada miembro familiar y traducirlas en apoyos, prevencion y coordinacion." : "",
      index === 2 ? "Pactar objetivos pequenos, medibles y revisables con responsables, recursos, plazos y criterios de prioridad." : "",
      index === 2 && resourceNames.length ? `Activar o valorar recursos priorizados: ${resourceNames.slice(0, 4).join(", ")}.` : "",
      index === 2 && needsHealth ? "Incorporar educacion para la salud: comprension, autocuidado posible, reduccion de danos, adherencia indicada y comunicacion clara." : "",
      index === 2 && needsDependency ? "Revisar reconocimiento de dependencia/discapacidad, apoyos efectivos, accesibilidad, cuidados y respiro familiar." : "",
      index === 2 && needsEmployment ? "Disenar itinerario sociolaboral progresivo: estabilizacion, competencias, formacion, intermediacion y seguimiento." : "",
      index === 3 ? "Revisar indicadores, reformular hipotesis y documentar cambios en autonomia, red, salud cotidiana y acceso a derechos." : "",
      index === 3 && highPriority ? "Mantener plan de contingencia y coordinacion interprofesional hasta estabilizar riesgos principales." : "",
      index === 3 ? "Cerrar o reformular el plan con participacion de la persona usuaria, registrando avances, barreras y nuevas derivaciones." : ""
    ]);
    return {
      ...phase,
      timeframe: phaseMeta[index]?.timeframe || "Plazo ajustable",
      focus: phaseMeta[index]?.focus || "intervencion socioeducativa",
      actions: phaseActions
    };
  });

  const indicators = asList([
    "Asistencia a citas y continuidad de contacto con referente profesional.",
    "Numero y calidad de apoyos seguros identificados en sociograma.",
    "Acceso efectivo a recursos seleccionados y barreras encontradas.",
    "Cambios en vivienda, ingresos, documentacion, empleo/formacion o prestaciones.",
    "Autonomia percibida y funcionamiento cotidiano.",
    "Reduccion de riesgos: aislamiento, sobrecarga, consumo, violencia, perdida residencial o abandono del plan."
  ]);

  const cautions = asList([
    "El informe es provisional y debe revisarse con entrevista, contraste documental y consentimiento informado.",
    "No formula diagnostico clinico; trabaja con diagnostico confirmado, indicios o informacion no disponible segun conste.",
    "Evita inferencias moralizantes: prioriza determinantes sociales, derechos, apoyos, accesibilidad y participacion.",
    "Ante riesgo vital, violencia, desproteccion grave o emergencia social/sanitaria, activar circuito profesional correspondiente."
  ]);

  return {
    title: "Programa provisional de intervencion psicosocial",
    objectives,
    methodology,
    prevention,
    phases,
    indicators,
    cautions,
    assignedResources: selectedResources.length ? selectedResources : inference.recommendedResources || [],
    academicPrinciples
  };
}

function generateStructuredReport(caseData = {}) {
  const inference = infer(caseData);
  const warnings = validation(caseData);
  const familyHealth = detectFamilyHealth(caseData);
  const interventionProgram = buildInterventionProgram(caseData, inference, familyHealth);
  const academicPrinciples = interventionProgram.academicPrinciples;
  const professionalSynthesis = buildProfessionalSynthesis(caseData, inference, familyHealth, academicPrinciples);
  const activeLabels = inference.active.map((item) => item.label).join(", ") || "sin variables activas";
  const diagnosisStatus = caseData.diagnosisStatus || "sin informacion clinica suficiente";
  const recognitions = caseData.recognitions || {};
  const socialProfile = caseData.socialProfile || {};
  const person = caseData.person || {};
  const dualSummary = dualDiagnosisSummary(caseData.dualDiagnosis);
  const recognitionSummary = [
    recognitions.vulnerabilityCertificate ? "vulnerabilidad reconocida" : "",
    recognitions.vulnerabilityLevel ? `nivel ${recognitions.vulnerabilityLevel}` : "",
    recognitions.disabilityRecognized ? `discapacidad ${recognitions.disabilityPercent || "sin porcentaje registrado"}` : "",
    recognitions.dependencyRecognized || recognitions.dependencyGrade ? `dependencia ${recognitions.dependencyGrade || "reconocida"}` : ""
  ]
    .filter(Boolean)
    .join(", ");
  const personSummary = [
    person.age ? `edad: ${person.age}` : "",
    person.originCountry ? `pais de origen: ${person.originCountry}` : "",
    person.nationalStatusLabel ? `nacionalidad/apatridia: ${person.nationalStatusLabel}` : "",
    person.language ? `idioma habitual: ${person.language}` : "",
    person.yearsInSpainLabel ? `tiempo en Espana: ${person.yearsInSpainLabel}` : ""
  ]
    .filter(Boolean)
    .join("; ");
  const socialProfileSummary = [
    socialProfile.administrativeStatusLabel ? `situacion administrativa: ${socialProfile.administrativeStatusLabel}` : "",
    socialProfile.residencePermitLabel ? `permiso: ${socialProfile.residencePermitLabel}` : "",
    socialProfile.employmentStatusLabel ? `empleo: ${socialProfile.employmentStatusLabel}` : "",
    socialProfile.profession ? `profesion/ocupacion: ${socialProfile.profession}` : "",
    socialProfile.educationLevelLabel ? `estudios: ${socialProfile.educationLevelLabel}` : "",
    socialProfile.incomeStatusLabel ? `ingresos/prestaciones: ${socialProfile.incomeStatusLabel}` : "",
    socialProfile.barriers ? `barreras: ${socialProfile.barriers}` : ""
  ]
    .filter(Boolean)
    .join("; ");

  const globalDiagnosis =
    `El caso se interpreta desde una perspectiva de salud integral, dependencia y vulnerabilidad social. ` +
    `Constan como dimensiones activas: ${activeLabels}. ${recognitionSummary ? `Reconocimientos administrativos registrados: ${recognitionSummary}. ` : ""}` +
    `${personSummary ? `Datos personales y trayectoria registrados: ${personSummary}. ` : ""}` +
    `${dualSummary ? `Patologia dual o diagnostico combinado registrado: ${dualSummary}. ` : ""}` +
    `${socialProfileSummary ? `Perfil social registrado: ${socialProfileSummary}. ` : ""}` +
    `El diagnostico clinico figura como ${diagnosisStatus}; por tanto, la intervencion socioeducativa no sustituye valoracion sanitaria y se centra en apoyos, derechos, autonomia y reduccion de barreras.`;

  const professionalObservations = [
    `La lectura del caso exige articular factores individuales, familiares, comunitarios e institucionales, siguiendo un enfoque de determinantes sociales de la salud.`,
    `La prioridad ${inference.priority.toLowerCase()} se justifica por la intensidad media de las variables activas y por las relaciones detectadas entre red, vulnerabilidad, dependencia y situacion economica.`,
    dualSummary
      ? `La patologia dual debe formularse como hipotesis operativa o diagnostico sanitario registrado segun conste; desde Educacion Social se traduce en apoyos, reduccion de barreras, continuidad de vinculo y coordinacion especializada.`
      : "",
    `El programa se alinea con ${academicPrinciples.map((principle) => principle.source.replace(/^Tema /, "T")).join("; ")}.`,
    familyHealth.detected.length
      ? `En la unidad familiar se detectan varios problemas de salud que requieren analisis ecosistemico y programa de prevencion por niveles: ${familyHealth.detected.map((item) => item.label).join(", ")}.`
      : "",
    ...inference.findings.map((finding) => finding.text)
  ].filter(Boolean);

  const objectives = [
    "Completar una valoracion socioeducativa integral con consentimiento informado y delimitacion clara del rol profesional.",
    "Reducir barreras de acceso a derechos, recursos y apoyos comunitarios en el territorio seleccionado.",
    "Fortalecer autonomia personal, red de apoyo y continuidad de acompanamiento mediante objetivos verificables."
  ];

  if (caseData.variables?.dependencia?.active) {
    objectives.push("Identificar apoyos para actividades de la vida diaria, cuidados, accesibilidad y respiro familiar si procede.");
  }
  if (caseData.dualDiagnosis?.applies) {
    objectives.push("Planificar un abordaje integrado de patologia dual con cautela clinica, reduccion de danos, coordinacion sociosanitaria y sostenimiento de red.");
  }
  if (recognitions.dependencyRecognized || recognitions.dependencyGrade) {
    objectives.push("Revisar el encaje entre grado de dependencia reconocido, apoyos efectivos y posibles barreras de acceso a servicios.");
  }
  if (recognitions.disabilityRecognized) {
    objectives.push("Garantizar ajustes razonables, accesibilidad y participacion social desde un enfoque de derechos.");
  }
  if (caseData.variables?.situacionEconomica?.active) {
    objectives.push("Activar itinerario de estabilizacion economica, prestaciones y orientacion sociolaboral.");
  }
  if (["irregular", "sin_documentacion", "asilo"].includes(socialProfile.administrativeStatus) || ["sin_permiso", "denegado", "caducado"].includes(socialProfile.residencePermit)) {
    objectives.push("Ordenar un itinerario de regularizacion documental, empadronamiento, orientacion juridico-social y acceso no discriminatorio a derechos basicos.");
  }
  if (person.nationalStatus === "apatrida") {
    objectives.push("Contrastar la situacion de apatridia o ausencia de nacionalidad efectiva y orientar a recurso juridico-social especializado.");
  }
  if (["desempleo_larga_duracion", "sin_prestacion", "economia_informal", "empleo_precario"].includes(socialProfile.employmentStatus)) {
    objectives.push("Disenar un plan sociolaboral progresivo que combine estabilizacion personal, competencias, formacion, intermediacion y seguimiento.");
  }
  if (["sin_estudios", "no_homologados"].includes(socialProfile.educationLevel)) {
    objectives.push("Valorar alfabetizacion, homologacion, acreditacion de competencias o formacion ocupacional ajustada al momento vital y de salud.");
  }
  if (familyHealth.detected.length) {
    objectives.push("Diferenciar las necesidades de atencion social de cada miembro de la unidad familiar y ordenar apoyos por prevencion primaria, secundaria y terciaria.");
  }

  const strategies = [
    "Entrevista socioeducativa centrada en la persona, evitando lenguaje estigmatizante o culpabilizador.",
    "Plan de accion por fases: acogida, diagnostico social operativo, activacion de recursos y seguimiento.",
    "Coordinacion con servicios sociales de atencion primaria como eje de acceso a derechos y derivaciones.",
    "Educacion para la salud: comprension de la situacion, autocuidado posible, apoyos cotidianos y comunicacion clara.",
    "Itinerario individualizado: documentacion, prestaciones, vivienda, salud, red de apoyo, formacion/empleo y revision periodica de avances."
  ];

  const recommendations = [
    "Registrar evidencias observables y diferenciar hechos, relatos, hipotesis e indicios.",
    "Revisar el plan cada 15 dias si la prioridad es media-alta o alta; mensual si es preventiva o media.",
    "Incluir a la persona usuaria en la toma de decisiones y pactar objetivos comprensibles, medibles y realistas.",
    "Evitar conclusiones clinicas no acreditadas: formular indicios, necesidades de apoyo y derivaciones, manteniendo el diagnostico sanitario en su ambito propio.",
    familyHealth.detected.length
      ? "En actividades academicas tipo foro, fundamentar la respuesta distinguiendo caracteristicas de salud, CIE-11, necesidades sociales y prevencion primaria/secundaria/terciaria."
      : ""
  ].filter(Boolean);

  return {
    title: "Informe provisional de intervención psicosocial",
    warnings,
    priority: inference.priority,
    priorityScore: inference.priorityScore,
    globalDiagnosis,
    crossAnalysis: inference.findings,
    professionalObservations,
    objectives,
    strategies,
    recommendations,
    professionalSynthesis,
    interventionProgram,
    resources: inference.recommendedResources,
    familyHealthAnalysis: familyHealth,
    conditionalTools: {
      genogram: caseData.tools?.genogram?.applies ? caseData.tools.genogram : null,
      sociogram: caseData.tools?.sociogram?.applies ? caseData.tools.sociogram : null,
      resourceMap: caseData.tools?.resourceMap?.applies ? inference.recommendedResources : null
    },
    academicBasis: academicPrinciples,
    evidenceSources: academicFramework.evidenceSources,
    educationalContext: academicFramework.educationalContext,
    inference
  };
}

module.exports = { generateStructuredReport, infer, validation, variableLabels };
