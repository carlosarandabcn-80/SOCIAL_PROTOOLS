const {
  diagnosisProfiles,
  pilots,
  resources,
  theoryRules,
  unirSources
} = require("./knowledge-base");

const ETHICAL_NOTE =
  "Esta herramienta ofrece orientacion socioeducativa y no sustituye diagnostico ni tratamiento clinico. Ante riesgo vital, violencia, desproteccion grave o emergencia sanitaria, debe activarse el circuito profesional correspondiente.";

function normalize(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function compact(value) {
  return String(value || "").replace(/\s+/g, " ").trim();
}

function uniq(values) {
  return [...new Set(values.filter(Boolean))];
}

function scoreFromTerms(text, terms) {
  return terms.reduce((count, term) => (text.includes(normalize(term)) ? count + 1 : count), 0);
}

function extractCode(input) {
  const match = compact(input).match(/\b([A-Z0-9]{1,2}[A-Z]?\d{1,2}(?:\.\d+)?[A-Z]?)\b/i);
  return match ? match[1].toUpperCase() : "";
}

function detectContext(raw, preferredCity) {
  const text = normalize(raw);
  const city =
    preferredCity ||
    (text.includes("valencia") || text.includes("valencia") ? "Valencia" : "") ||
    (text.includes("bilbao") ? "Bilbao" : "") ||
    (text.includes("barcelona") ? "Barcelona" : "") ||
    (text.includes("madrid") ? "Madrid" : "") ||
    "Madrid";
  return {
    city,
    age:
      (raw.match(/\b(\d{1,3})\s*(anos|años|a\.)\b/i) || [])[1] ||
      (raw.match(/\b(\d{1,3})\s*(?:y\/o\s*)?(?:anos|años)?\b/) || [])[1] ||
      "",
    housingRisk: /sinhogar|calle|desahuc|habitacion|habitación|vivienda|alquiler|sin hogar/.test(text),
    lowIncome: /paro|desemple|sin ingresos|renta|pobreza|precar|deuda|temporal/.test(text),
    weakNetwork: /soledad|aisla|sin red|baja red|familia lejos|conflicto familiar|escasa red/.test(text),
    educationEmployment: /empleo|trabajo|laboral|estudios|fp|universidad|formacion|formación|escuela/.test(text),
    caregiver: /cuidador|cuidadora|familia|hija|hijo|madre|padre|sobrecarga/.test(text),
    migrationOrDiscrimination: /migr|racis|genero|género|violencia|documentacion|documentación|estigma/.test(text),
    missingInfo: compact(raw).length < 28
  };
}

function summarizeSociogram(sociogram = {}) {
  const nodes = Array.isArray(sociogram.nodes) ? sociogram.nodes : [];
  const active = nodes.filter((node) => compact(node.name));
  const support = active.filter((node) => node.valence !== "risk" && Number(node.strength || 0) >= 55);
  const risk = active.filter((node) => node.valence === "risk" || Number(node.strength || 0) <= 25);
  const institutional = active.filter((node) => node.type === "institucional");
  const informal = active.filter((node) => ["familiar", "amistad", "comunitario", "vecinal"].includes(node.type));
  const averageStrength = active.length
    ? Math.round(active.reduce((sum, node) => sum + Number(node.strength || 0), 0) / active.length)
    : 0;

  return {
    nodes: active,
    supportCount: support.length,
    riskCount: risk.length,
    institutionalCount: institutional.length,
    informalCount: informal.length,
    averageStrength,
    weak: active.length === 0 || support.length < 2 || averageStrength < 45,
    protective: support.length >= 3 && risk.length === 0 && averageStrength >= 60
  };
}

function matchProfiles(raw, code) {
  const text = normalize(raw);
  const matches = diagnosisProfiles
    .map((profile) => {
      const codeHit = code && profile.codes.some((regex) => regex.test(code));
      const termHits = scoreFromTerms(text, profile.terms);
      return { profile, weight: (codeHit ? 3 : 0) + termHits };
    })
    .filter((item) => item.weight > 0)
    .sort((a, b) => b.weight - a.weight);

  if (matches.length) return matches.slice(0, 2).map((item) => item.profile);
  return [
    {
      id: "generic",
      label: "Diagnostico o condicion con impacto socioeducativo",
      socialNeeds: ["valoracion social", "red de apoyo", "autonomia personal", "acceso a recursos"],
      risks: ["aislamiento", "precariedad", "barrera institucional", "estigma"],
      protections: ["acompanamiento profesional", "red comunitaria", "participacion", "informacion accesible"],
      dependencyHint: "Debe valorarse si la condicion limita decisiones, actividades cotidianas o participacion social.",
      vulnerabilityHint: "La vulnerabilidad depende de ingresos, vivienda, redes, accesibilidad y posicion social."
    }
  ];
}

function computeDimensions(raw, profiles, context, sociogramSummary = {}) {
  const text = normalize(raw);
  const dimensions = {
    dependence: 22,
    vulnerability: 28,
    exclusion: 18,
    autonomy: 32,
    structural: 30,
    networks: 24,
    educationEmployment: 18
  };

  const boost = (key, value) => {
    dimensions[key] = Math.min(100, dimensions[key] + value);
  };

  for (const profile of profiles) {
    if (["neurodevelopment", "cognitive-ageing", "chronic-health"].includes(profile.id)) boost("dependence", 22);
    if (["mental-health", "substance-use"].includes(profile.id)) boost("vulnerability", 18);
    if (profile.id === "substance-use") boost("exclusion", 14);
    if (profile.id === "mental-health") boost("networks", 12);
    if (profile.id === "neurodevelopment") boost("educationEmployment", 12);
  }

  if (/depend|discap|cuidad|movilidad|deterioro|mayor|autonomia/.test(text)) boost("dependence", 24);
  if (/paro|pobre|precar|renta|deuda|temporal|sin ingresos/.test(text)) boost("vulnerability", 24);
  if (/sinhogar|calle|desahuc|exclusion|vivienda|estigma|violencia/.test(text)) boost("exclusion", 26);
  if (/aisla|soledad|sin red|baja red|conflicto familiar/.test(text)) boost("networks", 24);
  if (/barrio|brecha|migr|genero|origen|documentacion|clase/.test(text)) boost("structural", 18);
  if (context.educationEmployment) boost("educationEmployment", 20);
  if (context.housingRisk) boost("exclusion", 16);
  if (context.weakNetwork) boost("networks", 16);
  if (context.caregiver) boost("dependence", 8);
  if (sociogramSummary.weak) {
    boost("networks", 24);
    boost("vulnerability", 12);
  }
  if (sociogramSummary.riskCount >= 2) {
    boost("networks", 16);
    boost("exclusion", 8);
  }
  if (sociogramSummary.institutionalCount === 0 && sociogramSummary.nodes?.length) boost("structural", 8);
  if (sociogramSummary.protective) {
    dimensions.vulnerability = Math.max(10, dimensions.vulnerability - 10);
    dimensions.networks = Math.max(10, dimensions.networks - 12);
  }

  dimensions.autonomy = Math.max(15, 100 - Math.round((dimensions.dependence + dimensions.vulnerability) / 2) + 22);
  return dimensions;
}

function classifyPriority(dimensions, context) {
  const max = Math.max(dimensions.vulnerability, dimensions.exclusion, dimensions.dependence);
  if (max >= 78 || (context.housingRisk && context.lowIncome)) return "Alta";
  if (max >= 55 || context.weakNetwork || context.caregiver) return "Media";
  return "Preventiva";
}

function activeRules(raw, dimensions) {
  const text = normalize(raw);
  const fromText = theoryRules.filter((rule) => rule.triggers.some((trigger) => text.includes(normalize(trigger))));
  const fromScores = theoryRules.filter((rule) =>
    rule.dimensions.some((dimension) => dimensions[dimension] >= 55)
  );
  return uniq([...fromText, ...fromScores].map((rule) => rule.id)).map((id) =>
    theoryRules.find((rule) => rule.id === id)
  );
}

function buildInterpretation(profiles, context, dimensions, diagnosis) {
  const profileLabel = profiles.map((profile) => profile.label).join(" + ");
  const official = diagnosis?.title ? `Codigo CIE-11 seleccionado: ${diagnosis.code} - ${diagnosis.title}. ` : "";
  const territorial = context.city ? ` en ${context.city}` : "";
  const structural =
    dimensions.structural >= 55
      ? " Se interpreta tambien como una situacion atravesada por desigualdad estructural y barreras de oportunidad."
      : " Se evita reducir el caso al diagnostico: se observan apoyos, redes y condiciones de vida.";
  return `${official}El caso se lee como ${profileLabel}${territorial}. La traduccion socioeducativa no es clinica: identifica necesidades de autonomia, inclusion, redes y acceso a derechos.${structural}`;
}

function buildNeeds(profiles, context, dimensions) {
  const needs = profiles.flatMap((profile) => profile.socialNeeds);
  if (dimensions.dependence >= 55) needs.push("apoyos para autonomia personal", "adaptacion del entorno cotidiano");
  if (dimensions.vulnerability >= 55) needs.push("acompanamiento social de proximidad", "acceso a prestaciones y derechos");
  if (dimensions.exclusion >= 55) needs.push("inclusion residencial o comunitaria", "reduccion de estigma");
  if (dimensions.networks >= 55) needs.push("fortalecimiento de redes familiares, vecinales y comunitarias");
  if (context.educationEmployment) needs.push("itinerario formativo-laboral ajustado");
  if (context.missingInfo) needs.push("entrevista social inicial para completar informacion");
  return uniq(needs).slice(0, 9);
}

function buildRisks(profiles, context, dimensions) {
  const risks = profiles.flatMap((profile) => profile.risks);
  if (context.housingRisk) risks.push("inseguridad residencial");
  if (context.lowIncome) risks.push("precariedad economica");
  if (context.weakNetwork) risks.push("debilidad de capital social");
  if (context.caregiver) risks.push("sobrecarga de cuidados");
  if (dimensions.structural >= 55) risks.push("barrera institucional o territorial");
  return uniq(risks).slice(0, 8);
}

function buildProtections(profiles, context, sociogramSummary = {}) {
  const protections = profiles.flatMap((profile) => profile.protections);
  if (context.caregiver) protections.push("familia cuidadora identificada");
  if (context.educationEmployment) protections.push("posible itinerario de formacion o empleo");
  if (sociogramSummary.supportCount >= 2) protections.push("red de apoyo significativa identificada en sociograma");
  if (sociogramSummary.institutionalCount > 0) protections.push("apoyo institucional ya conectado");
  protections.push("servicios sociales de proximidad", "plan de seguimiento socioeducativo");
  return uniq(protections).slice(0, 8);
}

function buildObjectives(priority, context, dimensions) {
  const urgency = priority === "Alta" ? "primeras 72 horas" : priority === "Media" ? "primeras 2 semanas" : "primer mes";
  const objectives = [
    `Completar una valoracion socioeducativa integral en ${urgency}, incorporando vivienda, ingresos, red, autonomia y barreras de acceso.`,
    "Pactar con la persona 3 metas de autonomia cotidiana medibles y revisarlas cada 15 dias.",
    "Activar al menos 2 apoyos comunitarios o institucionales pertinentes sin desplazar la toma de decisiones de la persona."
  ];
  if (dimensions.educationEmployment >= 45 || context.educationEmployment) {
    objectives.push("Disenar un itinerario formativo-laboral realista con una accion concreta de acceso o permanencia en 30 dias.");
  }
  if (dimensions.networks >= 55) {
    objectives.push("Reconstruir una red minima de apoyo con un referente formal y un vinculo informal seguro en 4 semanas.");
  }
  return objectives;
}

function buildPlan(priority, rules, context, dimensions, sociogramSummary = {}) {
  const plan = [
    {
      phase: "1. Acogida y delimitacion",
      actions: [
        "Explicar limites del rol socioeducativo y obtener consentimiento para coordinar recursos.",
        "Diferenciar necesidades sanitarias, sociales, educativas, laborales y comunitarias."
      ]
    },
    {
      phase: "2. Diagnostico social operativo",
      actions: [
        "Mapear red familiar, vecinal, institucional y digital.",
        "Valorar barreras de movilidad social: ingresos, formacion, empleo, vivienda, estigma y accesibilidad."
      ]
    },
    {
      phase: "3. Plan de apoyos",
      actions: rules.length
        ? rules.slice(0, 4).map((rule) => rule.action)
        : ["Realizar valoracion integral persona-entorno antes de definir apoyos, evitando una lectura exclusivamente individual del diagnostico."]
    },
    {
      phase: "4. Seguimiento",
      actions: [
        priority === "Alta"
          ? "Revisar semanalmente hasta estabilizar vivienda, ingresos, red o seguridad."
          : "Revisar quincenalmente avances, barreras y ajustes del itinerario.",
        "Registrar indicadores de autonomia, participacion, red y acceso a derechos."
      ]
    }
  ];

  if (context.missingInfo) {
    plan[1].actions.push("Simular hipotesis de intervencion solo como borrador y sustituirlas por datos reales en entrevista.");
  }
  if (dimensions.dependence >= 65) {
    plan[2].actions.push("Solicitar valoracion de dependencia/discapacidad o revisar apoyos ya reconocidos, si procede.");
  }
  if (sociogramSummary.weak) {
    plan[2].actions.push("Construir un sociograma minimo con dos apoyos seguros y un recurso institucional de referencia.");
  }
  return plan;
}

function buildStrategies(context, priority) {
  const strategies = [
    "Entrevista motivacional socioeducativa centrada en preferencias, no en imposicion de conductas.",
    "Acompanamiento por objetivos breves para reducir incertidumbre y aumentar control percibido.",
    "Coordinacion con servicios sociales como eje, y con recursos sanitarios solo desde derivacion o trabajo en red.",
    "Lenguaje no estigmatizante: hablar de barreras, apoyos y derechos antes que de deficit personal."
  ];
  if (context.weakNetwork) strategies.push("Mapa de red: identificar vinculos seguros, vinculos a reparar y espacios comunitarios de baja exigencia.");
  if (priority === "Alta") strategies.push("Plan de contingencia con contactos, recurso de urgencia social y senales de alarma.");
  return strategies;
}

function selectResources(dimensions, context, profiles) {
  const tags = [];
  if (dimensions.dependence >= 50) tags.push("dependencia", "discapacidad", "cuidados", "autonomia");
  if (dimensions.vulnerability >= 50) tags.push("vulnerabilidad", "renta", "familia");
  if (dimensions.exclusion >= 50 || context.housingRisk) tags.push("exclusion", "sinhogarismo", "vivienda", "emergencia");
  if (dimensions.educationEmployment >= 45 || context.educationEmployment) tags.push("empleo", "formacion", "precariedad");
  if (profiles.some((profile) => profile.id === "substance-use")) tags.push("adiccion", "consumo");
  if (!tags.length) tags.push("vulnerabilidad", "autonomia");

  const rank = (resource) => resource.fit.filter((item) => tags.includes(item)).length;
  const selectCity = (city) =>
    resources[city]
      .map((resource) => ({ ...resource, score: rank(resource) }))
      .filter((resource) => resource.score > 0 || resource.type === "Atencion social primaria")
      .sort((a, b) => b.score - a.score)
      .slice(0, 4)
      .map(({ score, ...resource }) => resource);

  return Object.keys(resources).reduce((selected, city) => {
    selected[city] = selectCity(city);
    return selected;
  }, {});
}

function buildJustification(rules, profiles) {
  const ruleLabels = rules.slice(0, 5).map((rule) => rule.label).join("; ");
  const sourceTitles = unirSources.map((source) => source.id).join(", ");
  return `Decision basada en reglas derivadas de materiales UNIR (${sourceTitles}). Perfil detectado: ${profiles
    .map((profile) => profile.label)
    .join(" + ")}. Reglas aplicadas: ${ruleLabels || "valoracion social integral y enfoque de autonomia"}.`;
}

function analyzeCase(input) {
  const payload = typeof input === "object" && input !== null ? input : { input };
  const diagnosis = payload.diagnosis || {};
  const contextText = compact(payload.context || payload.input || "");
  const selectedDiagnosisText = compact([diagnosis.code, diagnosis.title, diagnosis.chapter].filter(Boolean).join(" "));
  const raw = compact([selectedDiagnosisText, contextText, payload.city].filter(Boolean).join(". "));
  const simulatedInput = raw;
  const code = compact(diagnosis.code) || extractCode(simulatedInput);
  const context = detectContext(simulatedInput, payload.city);
  const sociogramSummary = summarizeSociogram(payload.sociogram);
  const profiles = matchProfiles(simulatedInput, code);
  const dimensions = computeDimensions(simulatedInput, profiles, context, sociogramSummary);
  const priority = classifyPriority(dimensions, context);
  const rules = activeRules(simulatedInput, dimensions);

  return {
    diagnostico: code
      ? `${code} - ${diagnosis.title || profiles.map((profile) => profile.label).join(" + ")}`
      : profiles.map((profile) => profile.label).join(" + "),
    cie11_seleccionado: diagnosis.code
      ? {
          code: diagnosis.code,
          title: diagnosis.title,
          chapter: diagnosis.chapter,
          version: diagnosis.version || "2026-01",
          link: diagnosis.link
        }
      : null,
    entrada_original: simulatedInput,
    ciudad_preferente: context.city,
    sociograma: {
      resumen: {
        apoyos_fuertes: sociogramSummary.supportCount,
        vinculos_de_riesgo: sociogramSummary.riskCount,
        apoyos_institucionales: sociogramSummary.institutionalCount,
        fuerza_media: sociogramSummary.averageStrength,
        red_debil: sociogramSummary.weak
      },
      nodos: sociogramSummary.nodes
    },
    interpretacion_social: buildInterpretation(profiles, context, dimensions, diagnosis),
    necesidades_socioeducativas: buildNeeds(profiles, context, dimensions),
    factores_riesgo: buildRisks(profiles, context, dimensions),
    factores_proteccion: buildProtections(profiles, context, sociogramSummary),
    dimension_dependencia: profiles[0].dependencyHint,
    dimension_vulnerabilidad: profiles[0].vulnerabilityHint,
    objetivos_intervencion: buildObjectives(priority, context, dimensions),
    plan_intervencion: buildPlan(priority, rules, context, dimensions, sociogramSummary),
    estrategias_acompanamiento: buildStrategies(context, priority),
    recursos: selectResources(dimensions, context, profiles),
    nivel_prioridad: priority,
    justificacion_socioeducativa: buildJustification(rules, profiles),
    notas_eticas: ETHICAL_NOTE,
    indicadores: dimensions,
    reglas_activadas: rules.map((rule) => ({
      id: rule.id,
      regla: rule.label,
      aplicacion: rule.action
    })),
    fuentes_unir: unirSources
  };
}

module.exports = {
  analyzeCase,
  ETHICAL_NOTE,
  pilots,
  unirSources
};
