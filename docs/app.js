const variableDefinitions = [
  { key: "salud", label: "Salud", hint: "Estado de salud, enfermedad, salud mental, educacion para la salud." },
  { key: "dependencia", label: "Dependencia", hint: "Apoyos para autonomia personal, cuidados y vida diaria." },
  { key: "vulnerabilidad", label: "Vulnerabilidad social", hint: "Riesgo social, exclusion, barreras de acceso y derechos." },
  { key: "contextoFamiliar", label: "Contexto familiar", hint: "Estructura, conflictos, apoyos, cuidados y convivencia." },
  { key: "redSocial", label: "Red social", hint: "Apoyos comunitarios, aislamiento, participacion y pertenencia." },
  { key: "situacionEconomica", label: "Situacion economica", hint: "Ingresos, empleo, vivienda, precariedad y prestaciones." }
];

const state = {
  currentStep: 1,
  selectedDiagnosis: null,
  dualDiagnoses: [null, null],
  familyMembers: [],
  familyRoles: new Set(),
  socialNodes: [],
  resources: {},
  selectedResources: new Set(),
  variables: Object.fromEntries(
    variableDefinitions.map((definition) => [
      definition.key,
      { active: false, severity: 0, observations: "" }
    ])
  ),
  lastResult: null,
  searchTimer: null,
  dualSearchTimers: [null, null],
  healthSearchTimers: new Map()
};

let resourceMapInstance = null;
let resourceMarkerLayer = null;

const cityCenters = {
  Madrid: { lat: 40.4168, lng: -3.7038, zoom: 12 },
  Barcelona: { lat: 41.3874, lng: 2.1686, zoom: 12 },
  Sevilla: { lat: 37.3891, lng: -5.9845, zoom: 12 }
};

const originRegionCodes = [
  "AF", "AX", "AL", "DZ", "AS", "AD", "AO", "AI", "AQ", "AG", "AR", "AM", "AW", "AU", "AT", "AZ",
  "BS", "BH", "BD", "BB", "BY", "BE", "BZ", "BJ", "BM", "BT", "BO", "BQ", "BA", "BW", "BV", "BR", "IO", "BN", "BG", "BF", "BI",
  "CV", "KH", "CM", "CA", "KY", "CF", "TD", "CL", "CN", "CX", "CC", "CO", "KM", "CG", "CD", "CK", "CR", "CI", "HR", "CU", "CW", "CY", "CZ",
  "DK", "DJ", "DM", "DO",
  "EC", "EG", "SV", "GQ", "ER", "EE", "SZ", "ET",
  "FK", "FO", "FJ", "FI", "FR", "GF", "PF", "TF",
  "GA", "GM", "GE", "DE", "GH", "GI", "GR", "GL", "GD", "GP", "GU", "GT", "GG", "GN", "GW", "GY",
  "HT", "HM", "VA", "HN", "HK", "HU",
  "IS", "IN", "ID", "IR", "IQ", "IE", "IM", "IL", "IT",
  "JM", "JP", "JE", "JO",
  "KZ", "KE", "KI", "KP", "KR", "KW", "KG",
  "LA", "LV", "LB", "LS", "LR", "LY", "LI", "LT", "LU",
  "MO", "MG", "MW", "MY", "MV", "ML", "MT", "MH", "MQ", "MR", "MU", "YT", "MX", "FM", "MD", "MC", "MN", "ME", "MS", "MA", "MZ", "MM",
  "NA", "NR", "NP", "NL", "NC", "NZ", "NI", "NE", "NG", "NU", "NF", "MK", "MP", "NO",
  "OM",
  "PK", "PW", "PS", "PA", "PG", "PY", "PE", "PH", "PN", "PL", "PT", "PR", "QA",
  "RE", "RO", "RU", "RW",
  "BL", "SH", "KN", "LC", "MF", "PM", "VC", "WS", "SM", "ST", "SA", "SN", "RS", "SC", "SL", "SG", "SX", "SK", "SI", "SB", "SO", "ZA", "GS", "SS", "ES", "LK", "SD", "SR", "SJ", "SE", "CH", "SY",
  "TW", "TJ", "TZ", "TH", "TL", "TG", "TK", "TO", "TT", "TN", "TR", "TM", "TC", "TV",
  "UG", "UA", "AE", "GB", "US", "UM", "UY", "UZ",
  "VU", "VE", "VN", "VG", "VI",
  "WF", "EH", "YE", "ZM", "ZW"
];

const originExtraOptions = [
  "Apátrida / sin país de origen acreditado",
  "Escocia",
  "Gales",
  "Inglaterra",
  "Irlanda del Norte",
  "Kosovo",
  "No consta / pendiente de entrevista",
  "República Árabe Saharaui Democrática",
  "Territorio no reconocido o en disputa"
];

const resourceLocations = {
  Madrid: {
    "mad-ss-primary": { lat: 40.4168, lng: -3.7038, address: "Red municipal de centros de servicios sociales, Madrid" },
    "mad-samur-social": { lat: 40.4073, lng: -3.7106, address: "SAMUR Social, Madrid" },
    "mad-salud": { lat: 40.4051, lng: -3.6687, address: "Madrid Salud, Madrid" },
    "mad-dependencia": { lat: 40.4219, lng: -3.6909, address: "Comunidad de Madrid, dependencia" },
    "mad-empleo": { lat: 40.3865, lng: -3.6996, address: "Agencia para el Empleo, Madrid" },
    "mad-cruz-roja": { lat: 40.4471, lng: -3.6705, address: "Cruz Roja Comunidad de Madrid" },
    "mad-caritas": { lat: 40.4117, lng: -3.7138, address: "Caritas Madrid" },
    "mad-secretariado-gitano": { lat: 40.3912, lng: -3.7007, address: "Fundacion Secretariado Gitano, Madrid" },
    "mad-tomillo": { lat: 40.3684, lng: -3.6938, address: "Fundacion Tomillo, Madrid" },
    "mad-hogar-si": { lat: 40.4265, lng: -3.708, address: "HOGAR SI, Madrid" },
    "mad-manantial": { lat: 40.4342, lng: -3.6822, address: "Fundacion Manantial, Madrid" },
    "mad-plena-inclusion": { lat: 40.4349, lng: -3.698, address: "Plena Inclusion Madrid" }
  },
  Barcelona: {
    "bcn-ss-primary": { lat: 41.3851, lng: 2.1734, address: "Centres de Serveis Socials, Barcelona" },
    "bcn-activa": { lat: 41.4036, lng: 2.1944, address: "Barcelona Activa" },
    "bcn-sjd": { lat: 41.3806, lng: 2.167, address: "Sant Joan de Deu Serveis Socials, Barcelona" },
    "bcn-pere-claver": { lat: 41.3756, lng: 2.1553, address: "Pere Claver Grup, Barcelona" },
    "bcn-dependencia": { lat: 41.3859, lng: 2.17, address: "Generalitat de Catalunya, Barcelona" },
    "bcn-fsyc": { lat: 41.397, lng: 2.1604, address: "Fundacion Salud y Comunidad, Barcelona" },
    "bcn-creu-roja": { lat: 41.387, lng: 2.168, address: "Creu Roja Catalunya, Barcelona" },
    "bcn-caritas": { lat: 41.388, lng: 2.174, address: "Caritas Barcelona" },
    "bcn-arrels": { lat: 41.381, lng: 2.171, address: "Arrels Fundacio, Barcelona" },
    "bcn-adsis": { lat: 41.409, lng: 2.181, address: "Fundacion Adsis Barcelona" },
    "bcn-ocupacio-inclusiva": { lat: 41.4036, lng: 2.1944, address: "Barcelona Activa, ocupacion inclusiva" },
    "bcn-fundacio-joia": { lat: 41.389, lng: 2.179, address: "Fundacio Joia, Barcelona" }
  },
  Sevilla: {
    "sev-ss-primary": { lat: 37.3891, lng: -5.9845, address: "Servicios Sociales del Ayuntamiento de Sevilla" },
    "sev-junta-social": { lat: 37.3922, lng: -5.998, address: "Servicios sociales Junta de Andalucia, Sevilla" },
    "sev-emergencia": { lat: 37.3925, lng: -5.994, address: "Diputacion de Sevilla" },
    "sev-andalucia-orienta": { lat: 37.383, lng: -5.99, address: "Andalucia Orienta, Sevilla" },
    "sev-cruz-roja": { lat: 37.391, lng: -5.979, address: "Cruz Roja Sevilla" },
    "sev-caritas": { lat: 37.389, lng: -5.997, address: "Caritas Diocesana de Sevilla" },
    "sev-don-bosco": { lat: 37.382, lng: -5.973, address: "Fundacion Don Bosco Sevilla" },
    "sev-proyecto-hombre": { lat: 37.37, lng: -5.982, address: "Proyecto Hombre Sevilla" },
    "sev-dependencia-assda": { lat: 37.393, lng: -5.978, address: "Agencia de Servicios Sociales y Dependencia de Andalucia" },
    "sev-sae-orienta": { lat: 37.388, lng: -5.996, address: "SAE Andalucia Orienta Sevilla" },
    "sev-cocemfe": { lat: 37.376, lng: -5.96, address: "COCEMFE Sevilla" },
    "sev-centros-sinhogar": { lat: 37.382, lng: -5.988, address: "Centros para personas sin hogar, Sevilla" }
  }
};

const roleDefaults = {
  padre: { generation: "progenitores", role: "padre", label: "Padre" },
  madre: { generation: "progenitores", role: "madre", label: "Madre" },
  abuelos: { generation: "abuelos", role: "abuelo", label: "Abuelos/as" },
  hijos: { generation: "descendientes", role: "hijo", label: "Hijos/as" },
  pareja: { generation: "persona", role: "pareja", label: "Pareja" },
  hermanos: { generation: "persona", role: "hermano", label: "Hermanos/as" },
  tutores: { generation: "progenitores", role: "tutor", label: "Tutores/as" },
  otros: { generation: "red", role: "otro", label: "Otros apoyos" }
};

const metricLabels = {
  salud: "Salud",
  dependencia: "Dependencia",
  vulnerabilidad: "Vulnerabilidad",
  contextoFamiliar: "Familia",
  redSocial: "Red social",
  situacionEconomica: "Economia"
};

const healthIssueCatalog = [
  {
    id: "opioides",
    patterns: ["heroina", "opioide", "opioides", "metadona"],
    label: "Trastornos debidos al uso de opioides",
    code: "6C43",
    chapter: "Trastornos mentales, del comportamiento y del neurodesarrollo"
  },
  {
    id: "cannabis",
    patterns: ["cannabis", "hachis", "marihuana"],
    label: "Trastornos debidos al uso de cannabis",
    code: "6C41",
    chapter: "Trastornos mentales, del comportamiento y del neurodesarrollo"
  },
  {
    id: "alcohol",
    patterns: ["alcohol", "alcoholismo", "dependencia del alcohol"],
    label: "Trastornos debidos al uso de alcohol",
    code: "6C40",
    chapter: "Trastornos mentales, del comportamiento y del neurodesarrollo"
  },
  {
    id: "ansiedad",
    patterns: ["ansiedad", "ansioso", "ansiosa"],
    label: "Trastorno de ansiedad generalizada / sintomas de ansiedad",
    code: "6B00",
    chapter: "Trastornos mentales, del comportamiento y del neurodesarrollo"
  },
  {
    id: "depresion",
    patterns: ["depresion", "apatia", "anhedonia"],
    label: "Trastorno depresivo / sintomas depresivos",
    code: "6A70",
    chapter: "Trastornos mentales, del comportamiento y del neurodesarrollo"
  },
  {
    id: "insomnio",
    patterns: ["insomnio", "sueno", "sueño"],
    label: "Trastornos de insomnio",
    code: "7A0Z",
    chapter: "Trastornos del sueno y la vigilia"
  },
  {
    id: "artrosis",
    patterns: ["artrosis", "osteoartrosis", "osteoartritis"],
    label: "Osteoartrosis / osteoartritis",
    code: "FA0Z",
    chapter: "Enfermedades del sistema musculoesqueletico o del tejido conjuntivo"
  },
  {
    id: "discapacidad-intelectual",
    patterns: ["discapacidad intelectual", "desarrollo intelectual", "limitacion intelectual"],
    label: "Trastorno del desarrollo intelectual",
    code: "6A00",
    chapter: "Trastornos mentales, del comportamiento y del neurodesarrollo"
  }
];

function el(selector) {
  return document.querySelector(selector);
}

function all(selector) {
  return [...document.querySelectorAll(selector)];
}

function create(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function clearNode(node) {
  while (node.firstChild) node.removeChild(node.firstChild);
}

function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function short(value, length = 14) {
  const text = String(value || "");
  return text.length > length ? `${text.slice(0, length - 1)}.` : text;
}

function normalizeText(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

let staticIcdCatalogPromise = null;

function fallbackIcdCatalog() {
  return {
    version: "2026-01",
    count: healthIssueCatalog.length,
    source: "Catalogo preventivo minimo",
    entries: healthIssueCatalog.map((issue) => ({
      code: issue.code,
      title: issue.label,
      titleEn: "",
      chapter: issue.chapter,
      link: "",
      patterns: issue.patterns || []
    }))
  };
}

function normalizeIcdEntry(entry) {
  return {
    code: entry.code || entry.c || "",
    title: entry.title || entry.t || "",
    titleEn: entry.titleEn || entry.e || "",
    chapter: entry.chapter || entry.ch || "",
    link: entry.link || entry.l || "",
    patterns: entry.patterns || []
  };
}

async function loadStaticIcdCatalog() {
  if (!staticIcdCatalogPromise) {
    staticIcdCatalogPromise = fetch("data/icd11-pages.json", { cache: "force-cache" })
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.json();
      })
      .then((payload) => ({
        version: payload.version || "2026-01",
        count: payload.count || payload.entries?.length || healthIssueCatalog.length,
        source: payload.source || "OMS CIE-11 MMS",
        entries: (payload.entries || []).map(normalizeIcdEntry)
      }))
      .catch(() => fallbackIcdCatalog());
  }

  return staticIcdCatalogPromise;
}

function icdScore(entry, text) {
  const code = normalizeText(entry.code);
  const title = normalizeText(entry.title);
  const titleEn = normalizeText(entry.titleEn);
  const chapter = normalizeText(entry.chapter);
  const patternMatch = entry.patterns.some((pattern) => {
    const normalizedPattern = normalizeText(pattern);
    return normalizedPattern.includes(text) || text.includes(normalizedPattern);
  });

  if (code === text) return 1000;
  if (code.startsWith(text)) return 880;
  if (title.startsWith(text)) return 760;
  if (title.includes(text)) return 620;
  if (titleEn.startsWith(text)) return 540;
  if (titleEn.includes(text)) return 460;
  if (chapter.includes(text)) return 320;
  if (patternMatch) return 280;
  if (code.includes(text)) return 240;
  return 0;
}

async function staticIcdSearch(query, limit = 12) {
  const catalog = await loadStaticIcdCatalog();
  const text = normalizeText(query);
  if (text.length < 2) return { version: catalog.version, count: catalog.count, results: [] };

  const results = catalog.entries
    .map((entry) => ({ entry, score: icdScore(entry, text) }))
    .filter((item) => item.score > 0)
    .sort((first, second) => second.score - first.score || first.entry.code.localeCompare(second.entry.code))
    .slice(0, Number(limit) || 12)
    .map(({ entry }) => ({
      code: entry.code,
      title: entry.title,
      titleEn: entry.titleEn,
      chapter: entry.chapter,
      link: entry.link
    }));

  return { version: catalog.version, count: catalog.count, results };
}

async function apiGetJson(path, fallback) {
  try {
    const response = await fetch(path);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch {
    return typeof fallback === "function" ? fallback() : fallback;
  }
}

async function apiPostJson(path, payload, fallback) {
  try {
    const response = await fetch(path, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch {
    return typeof fallback === "function" ? fallback(payload) : fallback;
  }
}

async function staticKnowledge() {
  const catalog = await loadStaticIcdCatalog();
  return {
    resources: window.SOCIAL_STATIC_RESOURCES || {},
    icd11: {
      version: catalog.version,
      count: catalog.count,
      source: catalog.source
    }
  };
}

function staticReport(caseData) {
  if (window.SOCIAL_STATIC_ENGINE?.generateStructuredReport) {
    return window.SOCIAL_STATIC_ENGINE.generateStructuredReport(caseData);
  }
  return {
    warnings: [],
    priority: "Media",
    priorityScore: 50,
    globalDiagnosis:
      "Informe provisional generado en modo estatico. Se recomienda completar la valoracion socioeducativa, contrastar informacion sanitaria y coordinar recursos territoriales.",
    crossAnalysis: [],
    professionalObservations: ["Lectura provisional basada en las variables activas del caso y en el marco academico de salud, dependencia y vulnerabilidad social."],
    objectives: ["Completar valoracion integral.", "Activar recursos proporcionales a las necesidades detectadas.", "Revisar avances y barreras de acceso."],
    strategies: ["Entrevista socioeducativa centrada en la persona.", "Coordinacion con servicios sociales y salud comunitaria."],
    recommendations: ["Diferenciar hechos, indicios e hipotesis.", "Evitar conclusiones clinicas no acreditadas."],
    professionalSynthesis: [],
    clinicalSocialMatrix: [],
    interventionProgram: { phases: [], academicPrinciples: [] },
    resources: selectedResourceObjects(),
    familyHealthAnalysis: { detected: [], preventionPlan: [] },
    conditionalTools: {},
    academicBasis: [],
    evidenceSources: [],
    educationalContext: "Entorno educativo UNIR"
  };
}

async function searchIcdApi(query, limit = 12) {
  return apiGetJson(
    `/api/icd11/search?q=${encodeURIComponent(query)}&limit=${limit}`,
    () => staticIcdSearch(query, limit)
  );
}

function optionText(selector) {
  const node = el(selector);
  return node?.selectedOptions?.[0]?.textContent?.trim() || "";
}

function compactParts(parts) {
  return parts.filter((part) => String(part || "").trim()).join(" · ");
}

function cityValue() {
  return el("#case-city").value || "";
}

function getDiagnosisStatusLabel() {
  const value = document.querySelector("input[name='diagnosis-status']:checked")?.value;
  if (value === "sin_confirmar") return "Sin confirmar: indicios";
  if (value === "desconocido") return "Informacion clinica no disponible";
  if (value === "confirmado") return "Confirmado por profesional sanitario";
  return "Sin seleccionar";
}

function dualDiagnosisApplies() {
  return Boolean(el("#dual-diagnosis-enabled")?.checked);
}

function selectedDualDiagnoses() {
  return dualDiagnosisApplies() ? state.dualDiagnoses.filter(Boolean) : [];
}

function dualDiagnosisSummary() {
  const diagnoses = selectedDualDiagnoses();
  if (!dualDiagnosisApplies()) return "";
  return diagnoses.length
    ? diagnoses.map((item) => `${item.code} - ${item.title}`).join(" + ")
    : "Patologia dual activada sin codigos completos";
}

function toolState(id) {
  return Boolean(el(id)?.checked);
}

function setStep(step) {
  state.currentStep = Math.max(1, Math.min(3, Number(step)));
  all(".stepper button").forEach((button) => {
    button.classList.toggle("active", Number(button.dataset.step) === state.currentStep);
  });
  all(".step-panel").forEach((panel) => {
    panel.classList.toggle("active", Number(panel.dataset.panel) === state.currentStep);
  });
  el("#prev-step").disabled = state.currentStep === 1;
  el("#next-step").textContent =
    state.currentStep === 3 ? "Generar informe" : state.currentStep === 2 ? "Ir a informe" : "Siguiente";
  if (state.currentStep === 2) {
    renderGenogram();
    renderSociogram();
    renderResources();
  }
}

function renderVariables() {
  const grid = el("#variables-grid");
  if (!grid) return;
  clearNode(grid);
  variableDefinitions.forEach((definition) => {
    const current = state.variables[definition.key];
    const card = create("article", `variable-card ${current.active ? "active" : ""}`);
    card.innerHTML = `
      <label class="variable-head">
        <input type="checkbox" ${current.active ? "checked" : ""} data-variable-active="${definition.key}" />
        <span>
          <strong>${definition.label}</strong>
          <small>${definition.hint}</small>
        </span>
      </label>
      <label class="range-label">Gravedad <b>${current.severity}</b></label>
      <input type="range" min="0" max="100" value="${current.severity}" data-variable-severity="${definition.key}" />
      <textarea rows="3" placeholder="Observaciones especificas..." data-variable-observations="${definition.key}">${escapeHtml(current.observations)}</textarea>
    `;
    grid.appendChild(card);
  });

  all("[data-variable-active]").forEach((input) => {
    input.addEventListener("change", () => {
      const key = input.dataset.variableActive;
      state.variables[key].active = input.checked;
      if (input.checked && state.variables[key].severity === 0) state.variables[key].severity = 45;
      renderVariables();
      renderResources();
      updateSummary();
    });
  });
  all("[data-variable-severity]").forEach((input) => {
    input.addEventListener("input", () => {
      const key = input.dataset.variableSeverity;
      state.variables[key].severity = Number(input.value);
      if (Number(input.value) > 0) state.variables[key].active = true;
      input.closest(".variable-card").querySelector(".range-label b").textContent = input.value;
      input.closest(".variable-card").classList.toggle("active", state.variables[key].active);
      renderResources();
      updateSummary();
    });
  });
  all("[data-variable-observations]").forEach((textarea) => {
    textarea.addEventListener("input", () => {
      state.variables[textarea.dataset.variableObservations].observations = textarea.value;
      updateSummary();
    });
  });
}

function updateSummary() {
  recalculateVariables();
  const privacy = el("#privacy-mode").checked;
  const name = el("#case-name").value.trim();
  const code = el("#case-code").value.trim();
  const age = el("#case-age").value.trim();
  const person = privacy ? code || "Codigo pendiente" : name || code || "0";
  const activeVariableCount = Object.values(state.variables).filter((variable) => variable.active).length;
  const profile = getSocialProfileData();
  const setSummary = (selector, value) => {
    const node = el(selector);
    if (node) node.textContent = value;
  };

  setSummary("#summary-person", age ? `${person} · ${age} anos` : person);
  setSummary(
    "#summary-family",
    el("#no-family-network").checked
      ? "Sin red familiar / apoyo"
      : state.familyMembers.length
        ? `${state.familyMembers.length} vinculos · ${familyHealthIssues().length} patologias`
        : `${activeVariableCount} dimensiones`
  );
  setSummary(
    "#summary-diagnosis",
    compactParts([
      state.selectedDiagnosis ? `${state.selectedDiagnosis.code} - ${state.selectedDiagnosis.title}` : "",
      dualDiagnosisSummary()
    ]) || "0"
  );
  setSummary("#summary-status", getDiagnosisStatusLabel());
  setSummary("#summary-city", cityValue() || "0");
  setSummary(
    "#summary-social",
    compactParts([
      profile.administrativeStatus ? profile.administrativeStatusLabel : "",
      profile.employmentStatus ? profile.employmentStatusLabel : "",
      profile.incomeStatus ? profile.incomeStatusLabel : ""
    ]) || "0"
  );
  setSummary("#summary-resources", String(state.selectedResources.size));
}

function appendObservation(key, text) {
  if (!text) return;
  const current = state.variables[key].observations || "";
  if (!current.includes(text)) {
    state.variables[key].observations = [current, text].filter(Boolean).join(" ");
  }
}

function syncRecognitionsToVariables() {
  if (recognitionsNoneSelected()) return;

  const hasVulnerability = el("#has-vulnerability-certificate")?.checked;
  const vulnerabilityLevel = el("#vulnerability-level")?.value;
  const hasDisability = el("#has-disability")?.checked;
  const disabilityPercent = Number(el("#disability-percent")?.value || 0);
  const hasDependency = el("#has-dependency")?.checked;
  const dependencyGrade = el("#dependency-grade")?.value;

  if (hasVulnerability || vulnerabilityLevel) {
    const severityByLevel = { leve: 35, moderada: 58, grave: 78, emergencia: 92 };
    state.variables.vulnerabilidad.active = true;
    state.variables.vulnerabilidad.severity = Math.max(
      state.variables.vulnerabilidad.severity,
      severityByLevel[vulnerabilityLevel] || 55
    );
    appendObservation("vulnerabilidad", hasVulnerability ? "Consta certificado o informe de vulnerabilidad." : "");
    appendObservation("vulnerabilidad", vulnerabilityLevel ? `Nivel registrado: ${vulnerabilityLevel}.` : "");
  }

  if (hasDisability || disabilityPercent > 0) {
    const severity = disabilityPercent >= 65 ? 78 : disabilityPercent >= 33 ? 58 : 45;
    state.variables.salud.active = true;
    state.variables.salud.severity = Math.max(state.variables.salud.severity, severity);
    state.variables.dependencia.active = true;
    state.variables.dependencia.severity = Math.max(state.variables.dependencia.severity, Math.max(35, severity - 10));
    appendObservation("dependencia", `Discapacidad reconocida${disabilityPercent ? ` (${disabilityPercent}%)` : ""}.`);
  }

  if (hasDependency || dependencyGrade) {
    const severityByGrade = { grado_i: 55, grado_ii: 75, grado_iii: 92, en_tramite: 48 };
    state.variables.dependencia.active = true;
    state.variables.dependencia.severity = Math.max(
      state.variables.dependencia.severity,
      severityByGrade[dependencyGrade] || 60
    );
    appendObservation("dependencia", hasDependency ? "Dependencia reconocida." : "");
    appendObservation("dependencia", dependencyGrade ? `Grado/situacion: ${dependencyGrade}.` : "");
  }
}

function setVariable(key, severity, observation = "") {
  if (!state.variables[key]) return;
  state.variables[key].active = true;
  state.variables[key].severity = Math.max(Number(state.variables[key].severity || 0), Number(severity || 0));
  appendObservation(key, observation);
}

function getEthicalFrameData() {
  return {
    consentAcknowledged: Boolean(el("#informed-consent")?.checked),
    participationLevel: el("#participation-level")?.value || "",
    participationLevelLabel: selectedLabel("#participation-level"),
    urgency: el("#case-urgency")?.value || "",
    urgencyLabel: selectedLabel("#case-urgency")
  };
}

function getSocialProfileData() {
  return {
    administrativeStatus: el("#administrative-status")?.value || "",
    administrativeStatusLabel: optionText("#administrative-status"),
    residencePermit: el("#residence-permit")?.value || "",
    residencePermitLabel: optionText("#residence-permit"),
    employmentStatus: el("#employment-status")?.value || "",
    employmentStatusLabel: optionText("#employment-status"),
    profession: el("#profession")?.value.trim() || "",
    educationLevel: el("#education-level")?.value || "",
    educationLevelLabel: optionText("#education-level"),
    incomeStatus: el("#income-status")?.value || "",
    incomeStatusLabel: optionText("#income-status"),
    barriers: el("#social-barriers")?.value.trim() || ""
  };
}

function recognitionsNoneSelected() {
  return Boolean(el("#no-recognitions")?.checked);
}

function clearRecognitionDependentFields() {
  all("[data-recognition-dependent] input, [data-recognition-dependent] select, [data-recognition-dependent] textarea").forEach((control) => {
    if (control.type === "checkbox" || control.type === "radio") control.checked = false;
    else control.value = "";
  });
}

function updateRecognitionControls() {
  const disabled = recognitionsNoneSelected();
  if (disabled) clearRecognitionDependentFields();
  all("[data-recognition-dependent]").forEach((node) => {
    node.classList.toggle("is-disabled", disabled);
    node.querySelectorAll("input, select, textarea").forEach((control) => {
      control.disabled = disabled;
    });
  });
  recalculateVariables();
  renderVariables();
  renderResources();
  updateSummary();
}

function familyHealthApplies() {
  return Boolean(el("#family-health-applies")?.checked);
}

function familyHealthIssues() {
  if (!familyHealthApplies()) return [];
  return state.familyMembers.flatMap((member) =>
    (member.healthIssues || []).map((issue) => ({
      ...issue,
      memberId: member.id,
      person: member.name || member.role,
      role: member.role,
      generation: member.generation,
      relation: member.relation
    }))
  );
}

function recalculateVariables() {
  state.variables = Object.fromEntries(
    variableDefinitions.map((definition) => [
      definition.key,
      { active: false, severity: 0, observations: "" }
    ])
  );

  const contextText = normalizeText(
    [
      el("#case-context")?.value,
      el("#diagnosis-indications")?.value,
      el("#dual-diagnosis-notes")?.value,
      familyHealthApplies() ? el("#family-health-problems")?.value : "",
      getSocialProfileData().barriers
    ].join(" ")
  );
  const housing = el("#case-housing")?.value || "";
  const profile = getSocialProfileData();
  const ethicalFrame = getEthicalFrameData();
  const issueCount = familyHealthIssues().length;

  const dualCount = selectedDualDiagnoses().length;
  if (state.selectedDiagnosis || dualCount || issueCount || contextText.match(/salud|enfermedad|ansiedad|depresion|adiccion|consumo|dolor|insomnio/)) {
    setVariable("salud", state.selectedDiagnosis || dualCount ? 48 : 42, "Existe informacion sanitaria o indicios de salud relevantes para la valoracion socioeducativa.");
  }

  if (dualDiagnosisApplies()) {
    setVariable("salud", dualCount >= 2 ? 64 : 52, "Patologia dual activada: requiere lectura integrada y coordinacion prudente entre salud mental, adicciones y apoyos sociales.");
    setVariable("vulnerabilidad", dualCount >= 2 ? 58 : 48, "La patologia dual puede incrementar discontinuidad de apoyos, estigma y barreras de acceso si no se aborda de forma integrada.");
  }

  if (issueCount) {
    setVariable("salud", Math.min(90, 45 + issueCount * 8), "Hay patologias o indicios asignados a miembros de la unidad familiar.");
    setVariable("contextoFamiliar", Math.min(85, 42 + issueCount * 6), "La salud familiar afecta al sistema de apoyos, cuidados y convivencia.");
  }

  if (state.familyMembers.length) {
    setVariable("contextoFamiliar", 38, "Consta red familiar o de apoyo para analizar en genograma.");
  }

  const conflictCount = state.familyMembers.filter((member) => ["conflictiva", "riesgo"].includes(member.relation)).length;
  if (conflictCount) {
    setVariable("contextoFamiliar", Math.min(90, 50 + conflictCount * 12), "El genograma registra vinculos conflictivos o de riesgo.");
  }

  if (el("#no-family-network")?.checked) {
    setVariable("redSocial", 82, "Sin red familiar o apoyo identificado.");
    setVariable("contextoFamiliar", 70, "Ausencia de red familiar disponible.");
  }

  if (state.socialNodes.length) {
    const averageSupport = Math.round(
      state.socialNodes.reduce((sum, node) => sum + Number(node.strength || 0), 0) / state.socialNodes.length
    );
    const riskNodes = state.socialNodes.filter((node) => node.valence === "risk").length;
    setVariable("redSocial", Math.max(35, 100 - averageSupport + riskNodes * 12), "El sociograma aporta informacion sobre apoyo, riesgo o aislamiento.");
  }

  if (["irregular", "sin_documentacion", "asilo"].includes(profile.administrativeStatus)) {
    setVariable("vulnerabilidad", profile.administrativeStatus === "irregular" ? 78 : 66, "La situacion administrativa puede limitar acceso a derechos, empleo, vivienda y continuidad de apoyos.");
  }

  if (["sin_permiso", "denegado", "caducado"].includes(profile.residencePermit)) {
    setVariable("vulnerabilidad", profile.residencePermit === "sin_permiso" ? 82 : 70, "El permiso de residencia o trabajo presenta bloqueo o discontinuidad.");
    setVariable("situacionEconomica", 62, "La situacion documental puede afectar a empleabilidad e ingresos.");
  }

  if (["desempleo_larga_duracion", "sin_prestacion", "economia_informal", "empleo_precario", "incapacidad"].includes(profile.employmentStatus)) {
    const severity = {
      empleo_precario: 50,
      desempleo_larga_duracion: 76,
      sin_prestacion: 84,
      economia_informal: 72,
      incapacidad: 64
    }[profile.employmentStatus] || 58;
    setVariable("situacionEconomica", severity, "La situacion laboral requiere itinerario de estabilizacion e insercion sociolaboral.");
    setVariable("vulnerabilidad", Math.max(52, severity - 8), "La precariedad laboral actua como determinante social de la salud y la exclusion.");
  }

  if (["sin_ingresos", "ingresos_bajos", "prestacion_tramite", "deudas"].includes(profile.incomeStatus)) {
    const severity = { sin_ingresos: 86, deudas: 78, ingresos_bajos: 62, prestacion_tramite: 56 }[profile.incomeStatus] || 55;
    setVariable("situacionEconomica", severity, "Ingresos o prestaciones insuficientes para sostener autonomia material.");
    setVariable("vulnerabilidad", Math.max(55, severity - 6), "La fragilidad economica incrementa riesgo de exclusion y dependencia de apoyos formales.");
  }

  if (["insegura", "habitacion", "sin_hogar", "institucional"].includes(housing)) {
    const severity = { insegura: 58, habitacion: 62, sin_hogar: 92, institucional: 54 }[housing] || 52;
    setVariable("vulnerabilidad", severity, "La situacion residencial condiciona seguridad, salud y continuidad del acompanamiento.");
    setVariable("situacionEconomica", Math.max(50, severity - 10), "La vivienda se relaciona con estabilidad economica y acceso efectivo a recursos.");
  }

  if (["sin_estudios", "no_homologados"].includes(profile.educationLevel)) {
    setVariable("vulnerabilidad", 55, "El nivel formativo o la falta de homologacion puede limitar oportunidades y participacion social.");
    setVariable("situacionEconomica", 50, "Se recomienda valorar formacion, acreditacion de competencias o homologacion.");
  }

  if (profile.barriers) {
    setVariable("vulnerabilidad", 58, "Constan barreras sociales o administrativas expresadas en la ficha.");
  }

  if (["urgencia_social", "riesgo_residencial", "violencia_desproteccion", "riesgo_sanitario_emocional"].includes(ethicalFrame.urgency)) {
    const severity = {
      urgencia_social: 78,
      riesgo_residencial: 84,
      violencia_desproteccion: 92,
      riesgo_sanitario_emocional: 86
    }[ethicalFrame.urgency];
    setVariable("vulnerabilidad", severity, "La ficha registra urgencia social inicial y requiere priorizacion, contraste profesional y plan de seguridad.");
    if (ethicalFrame.urgency === "riesgo_residencial") {
      setVariable("situacionEconomica", 72, "La urgencia residencial compromete estabilidad material y continuidad del acompanamiento.");
    }
    if (ethicalFrame.urgency === "violencia_desproteccion") {
      setVariable("contextoFamiliar", 82, "La posible violencia o desproteccion exige cautela, circuito profesional y analisis de seguridad.");
      setVariable("redSocial", 74, "La seguridad relacional debe evaluarse antes de activar apoyos informales.");
    }
    if (ethicalFrame.urgency === "riesgo_sanitario_emocional") {
      setVariable("salud", 78, "El riesgo sanitario o emocional requiere coordinacion prudente con recursos competentes.");
    }
  }

  if (["baja", "no_localizada", "rechazo"].includes(ethicalFrame.participationLevel)) {
    setVariable("redSocial", ethicalFrame.participationLevel === "rechazo" ? 58 : 64, "La participacion limitada exige adaptar vinculo, tiempos, comunicacion y consentimiento.");
  }

  syncRecognitionsToVariables();
  return state.variables;
}

function addDefaultFamilyMember(roleKey) {
  const preset = roleDefaults[roleKey];
  if (!preset) return;
  state.familyMembers.push({
    id: `default-${roleKey}-${Date.now()}`,
    generation: preset.generation,
    role: preset.role,
    kinship: "desconocido",
    name: preset.label,
    cohabitation: "desconocido",
    relation: "desconocida",
    strength: 45,
    notes: "Registro creado desde situacion familiar. Completar detalles si procede.",
    healthIssues: [],
    fromCheck: roleKey
  });
}

function removeDefaultFamilyMember(roleKey) {
  state.familyMembers = state.familyMembers.filter((member) => member.fromCheck !== roleKey);
}

function relationClass(relation) {
  if (relation === "apoyo_fuerte" || relation === "apoyo") return "support-line";
  if (relation === "ambivalente" || relation === "desconocida") return "ambivalent-line";
  if (relation === "ausente") return "absent-line";
  return "risk-line";
}

function nodeClass(relation) {
  if (relation === "apoyo_fuerte" || relation === "apoyo") return "node-support";
  if (relation === "ambivalente" || relation === "desconocida") return "node-ambivalent";
  if (relation === "ausente") return "node-absent";
  return "node-risk";
}

function renderGenogram() {
  const genogram = el("#genogram");
  const applies = toolState("#tool-genogram");
  const noNetwork = el("#no-family-network").checked;
  const members = noNetwork || !applies ? [] : state.familyMembers;
  el("#family-count").textContent = !applies ? "No aplica" : noNetwork ? "Sin red" : `${members.length} personas`;

  if (!applies) {
    genogram.innerHTML = `<div class="tool-disabled">Genograma desactivado para este caso.</div>`;
    renderFamilyList();
    updateSummary();
    return;
  }

  if (noNetwork) {
    genogram.innerHTML = `
      <svg viewBox="0 0 980 520" role="img" aria-label="Sin red familiar">
        <rect x="0" y="0" width="980" height="520" class="svg-bg"></rect>
        <line x1="385" y1="255" x2="595" y2="255" class="absent-line"></line>
        <circle cx="490" cy="255" r="54" class="person-core"></circle>
        <text x="490" y="261" text-anchor="middle" class="person-label">CASO</text>
        <text x="490" y="350" text-anchor="middle" class="svg-muted">Sin red familiar / sin red de apoyo identificada</text>
      </svg>
    `;
    renderFamilyList();
    updateSummary();
    return;
  }

  const rows = [
    ["abuelos", 82, "Generacion 1"],
    ["progenitores", 178, "Generacion 2"],
    ["persona", 278, "Persona y pares"],
    ["descendientes", 382, "Generacion 3"],
    ["red", 474, "Red no familiar"]
  ];
  const nodes = [];
  rows.forEach(([generation, y]) => {
    const items = members.filter((member) => member.generation === generation);
    const gap = Math.min(126, 820 / Math.max(items.length, 1));
    const start = 490 - ((items.length - 1) * gap) / 2;
    items.forEach((member, index) => nodes.push({ member, x: start + index * gap, y }));
  });

  const lines = nodes
    .map(
      ({ member, x, y }) =>
        `<line x1="490" y1="278" x2="${x}" y2="${y}" class="${relationClass(member.relation)}" style="stroke-width:${1.5 + Number(member.strength || 0) / 32}"></line>`
    )
    .join("");
  const nodeMarkup = nodes
    .map(({ member, x, y }) => {
      const issues = familyHealthApplies() ? member.healthIssues || [] : [];
      const issueCodes = issues.map((issue) => issue.code).slice(0, 2).join(" / ");
      const issueText = issues.length ? `${issueCodes}${issues.length > 2 ? " +" : ""}` : short(member.kinship, 12);
      return `
      <g class="geno-node" data-id="${member.id}">
        <rect x="${x - 55}" y="${y - 36}" width="110" height="72" rx="10" class="${nodeClass(member.relation)}"></rect>
        <text x="${x}" y="${y - 12}" text-anchor="middle">${escapeHtml(short(member.name || member.role, 14))}</text>
        <text x="${x}" y="${y + 5}" text-anchor="middle" class="svg-muted">${escapeHtml(short(member.role, 12))}</text>
        <rect x="${x - 42}" y="${y + 15}" width="84" height="16" rx="8" class="${issues.length ? "health-badge-on" : "health-badge-off"}"></rect>
        <text x="${x}" y="${y + 27}" text-anchor="middle" class="svg-health">${escapeHtml(short(issueText, 16))}</text>
      </g>
    `;
    })
    .join("");
  const labels = rows
    .map(([, y, label]) => `<text x="30" y="${y + 5}" class="svg-muted">${label}</text>`)
    .join("");
  const emptyHint = members.length
    ? ""
    : `<text x="490" y="350" text-anchor="middle" class="svg-muted">Anade vinculos familiares o activa sin red familiar.</text>`;

  genogram.innerHTML = `
    <svg viewBox="0 0 980 540" role="img" aria-label="Genograma relacional">
      <rect x="0" y="0" width="980" height="540" class="svg-bg"></rect>
      ${labels}
      ${lines}
      <circle cx="490" cy="278" r="45" class="person-core"></circle>
      <text x="490" y="284" text-anchor="middle" class="person-label">CASO</text>
      ${nodeMarkup}
      ${emptyHint}
    </svg>
  `;
  genogram.querySelectorAll(".geno-node").forEach((node) => {
    node.addEventListener("click", () => openFamilyDialog(node.dataset.id));
  });
  renderFamilyList();
  updateSummary();
}

function renderFamilyList() {
  const list = el("#family-list");
  if (!list) return;
  clearNode(list);
  if (!toolState("#tool-genogram")) {
    list.appendChild(create("p", "quiet-text", "Genograma desactivado. No se integrara en el informe."));
    return;
  }
  if (el("#no-family-network").checked) {
    list.appendChild(create("p", "quiet-text", "La ficha registra ausencia de red familiar o apoyo disponible."));
    return;
  }
  if (!state.familyMembers.length) {
    list.appendChild(create("p", "quiet-text", "0 vinculos registrados."));
    return;
  }
  state.familyMembers.forEach((member) => {
    const row = create("div", `family-row ${nodeClass(member.relation)}`);
    const text = create("button", "family-select");
    text.type = "button";
    const issues = familyHealthApplies() ? (member.healthIssues || []).map((issue) => issue.code).join(", ") : "";
    text.innerHTML = `
      <strong>${escapeHtml(member.name || member.role)} · ${escapeHtml(member.role)}</strong>
      <span>${escapeHtml(member.generation)} · ${escapeHtml(member.kinship)} · ${escapeHtml(member.relation)} · intensidad ${member.strength}</span>
    `;
    text.innerHTML = `
      <strong>${escapeHtml(member.name || member.role)} · ${escapeHtml(member.role)}</strong>
      <span>${escapeHtml(member.generation)} · ${escapeHtml(member.kinship)} · ${escapeHtml(member.relation)} · intensidad ${member.strength}${issues ? ` · salud: ${escapeHtml(issues)}` : ""}</span>
    `;
    text.addEventListener("click", () => openFamilyDialog(member.id));
    const remove = create("button", "mini-remove", "x");
    remove.type = "button";
    remove.addEventListener("click", () => {
      state.familyMembers = state.familyMembers.filter((item) => item.id !== member.id);
      renderMemberHealthPanel();
      renderGenogram();
    });
    row.append(text, remove);
    list.appendChild(row);
  });
}

function openFamilyDialog(id = "") {
  if (el("#no-family-network").checked) return;
  const member = state.familyMembers.find((item) => item.id === id);
  el("#family-dialog-title").textContent = member ? "Editar vinculo" : "Anadir vinculo";
  el("#family-edit-id").value = member?.id || "";
  el("#family-generation").value = member?.generation || "progenitores";
  el("#family-role").value = member?.role || "padre";
  el("#family-kinship").value = member?.kinship || "biologico";
  el("#family-name").value = member?.name || "";
  el("#family-cohabitation").value = member?.cohabitation || "desconocido";
  el("#family-relation").value = member?.relation || "apoyo";
  el("#family-strength").value = member?.strength ?? 60;
  el("#family-notes").value = member?.notes || "";
  const selectedMember = el("#selected-member");
  if (selectedMember) {
    selectedMember.textContent = member
      ? `${member.name || member.role}: ${member.relation}, intensidad ${member.strength}`
      : "Nuevo vinculo familiar o de apoyo.";
  }
  el("#family-dialog").showModal();
}

function saveFamilyMember() {
  const id = el("#family-edit-id").value;
  const role = el("#family-role").value;
  const payload = {
    id: id || `family-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    generation: el("#family-generation").value,
    role,
    kinship: el("#family-kinship").value,
    name: el("#family-name").value.trim() || role,
    cohabitation: el("#family-cohabitation").value,
    relation: el("#family-relation").value,
    strength: Number(el("#family-strength").value),
    notes: el("#family-notes").value.trim()
  };
  if (id) {
    state.familyMembers = state.familyMembers.map((member) =>
      member.id === id
        ? { ...member, ...payload, fromCheck: member.fromCheck, healthIssues: member.healthIssues || [] }
        : member
    );
  } else {
    state.familyMembers.push({ ...payload, healthIssues: [] });
  }
  el("#family-dialog").close();
  renderMemberHealthPanel();
  renderGenogram();
}

function issueFromCatalog(query) {
  const normalized = normalizeText(query);
  return healthIssueCatalog.find((issue) =>
    issue.patterns.some((pattern) => normalized.includes(normalizeText(pattern))) ||
    normalized.includes(normalizeText(issue.code)) ||
    normalized.includes(normalizeText(issue.label))
  );
}

async function resolveHealthIssue(query) {
  const text = String(query || "").trim();
  if (!text) return null;

  try {
    const payload = await searchIcdApi(text, 8);
    const results = prioritizeIcdResults(text, payload.results || []);
    const entry = results[0];
    if (entry) {
      return {
        id: `icd-${entry.code}`,
        code: entry.code,
        label: entry.title,
        chapter: entry.chapter,
        source: `OMS CIE-11 ${payload.version || "2026-01"}`
      };
    }
  } catch {
    // Fallback below keeps the case editable even if the local search fails.
  }

  const local = issueFromCatalog(text);
  if (local) return { ...local, source: "catalogo CIE-11 interno" };

  return {
    id: `manual-${Date.now()}`,
    code: "CIE-11 pendiente",
    label: text,
    chapter: "Pendiente de confirmar con CIE-11 o fuente sanitaria",
    source: "registro manual cautelar"
  };
}

function addIssueToMember(memberId, issue) {
  if (!issue) return;
  state.familyMembers = state.familyMembers.map((member) => {
    if (member.id !== memberId) return member;
    const current = member.healthIssues || [];
    const exists = current.some((item) => item.code === issue.code && item.label === issue.label);
    return exists ? member : { ...member, healthIssues: [...current, issue] };
  });
  recalculateVariables();
  renderMemberHealthPanel();
  renderGenogram();
  renderResources();
  updateSummary();
}

function removeIssueFromMember(memberId, issueIndex) {
  state.familyMembers = state.familyMembers.map((member) =>
    member.id === memberId
      ? { ...member, healthIssues: (member.healthIssues || []).filter((_, index) => index !== issueIndex) }
      : member
  );
  recalculateVariables();
  renderMemberHealthPanel();
  renderGenogram();
  renderResources();
  updateSummary();
}

function issueFromIcdEntry(entry, version = "2026-01") {
  return {
    id: `icd-${entry.code}`,
    code: entry.code,
    label: entry.title,
    chapter: entry.chapter,
    source: `OMS CIE-11 ${version}`,
    link: entry.link || ""
  };
}

function prioritizeIcdResults(query, results = []) {
  const local = issueFromCatalog(query);
  if (!local) return results;
  const match = results.find((entry) => entry.code === local.code);
  if (match) return [match, ...results.filter((entry) => entry.code !== local.code)];
  return [
    {
      code: local.code,
      title: local.label,
      chapter: local.chapter,
      link: ""
    },
    ...results
  ];
}

async function searchMemberHealth(memberId, query) {
  const resultsBox = document.querySelector(`[data-health-results="${CSS.escape(memberId)}"]`);
  if (!resultsBox) return;
  clearNode(resultsBox);
  const text = String(query || "").trim();
  if (text.length < 2) {
    resultsBox.classList.remove("visible");
    return;
  }

  resultsBox.classList.add("visible");
  resultsBox.appendChild(create("p", "quiet-text", "Buscando en CIE-11..."));

  try {
    const payload = await searchIcdApi(text, 8);
    const results = prioritizeIcdResults(text, payload.results || []);
    clearNode(resultsBox);
    if (!results.length) {
      resultsBox.appendChild(create("p", "quiet-text", "Sin resultados CIE-11. Revisa codigo o termino."));
      return;
    }

    results.forEach((entry) => {
      const button = create("button", "health-result");
      button.type = "button";
      button.innerHTML = `
        <span>${escapeHtml(entry.code)} · ${escapeHtml(entry.chapter || "")}</span>
        <strong>${escapeHtml(entry.title)}</strong>
      `;
      button.addEventListener("click", () => addIssueToMember(memberId, issueFromIcdEntry(entry, payload.version)));
      resultsBox.appendChild(button);
    });
  } catch {
    clearNode(resultsBox);
    resultsBox.appendChild(create("p", "quiet-text", "No se pudo consultar CIE-11 en este momento."));
  }
}

function renderMemberHealthPanel() {
  const box = el("#member-health-panel");
  if (!box) return;
  clearNode(box);

  if (!familyHealthApplies()) {
    box.appendChild(create("p", "quiet-text", "No aplica: el analisis se centra en la persona del caso y no incorpora patologias familiares."));
    return;
  }

  if (el("#no-family-network")?.checked) {
    box.appendChild(create("p", "quiet-text", "Sin red familiar: no hay miembros a los que asignar patologias."));
    return;
  }

  if (!state.familyMembers.length) {
    box.appendChild(create("p", "quiet-text", "Selecciona familiares en el punto 1.2 o anade vinculos en Herramientas para activar este automatismo."));
    return;
  }

  state.familyMembers.forEach((member) => {
    const card = create("article", "member-health-card");
    const issueList = (member.healthIssues || [])
      .map(
        (issue, index) => `
          <span class="health-chip">
            <strong>${escapeHtml(issue.code)}</strong>
            ${escapeHtml(issue.label)}
            <button type="button" aria-label="Quitar patologia" data-remove-issue="${member.id}" data-issue-index="${index}">x</button>
          </span>
        `
      )
      .join("");
    card.innerHTML = `
      <div class="member-health-head">
        <div>
          <strong>${escapeHtml(member.name || member.role)}</strong>
          <span>${escapeHtml(member.role)} · ${escapeHtml(member.generation)} · ${escapeHtml(member.kinship)}</span>
        </div>
        <small>${(member.healthIssues || []).length} registros</small>
      </div>
      <div class="health-entry-row">
        <input type="search" autocomplete="off" placeholder="Buscar CIE-11 por codigo o texto: 6B00, ansiedad, FA0Z..." data-health-query="${member.id}" />
        <button type="button" class="secondary-action small" data-add-health="${member.id}">Anadir CIE-11</button>
      </div>
      <div class="health-results" data-health-results="${member.id}"></div>
      <div class="health-chip-list">${issueList || '<span class="quiet-text">Sin patologias asignadas a este miembro.</span>'}</div>
    `;
    box.appendChild(card);
  });

  all("[data-add-health]").forEach((button) => {
    button.addEventListener("click", async () => {
      const memberId = button.dataset.addHealth;
      const input = document.querySelector(`[data-health-query="${CSS.escape(memberId)}"]`);
      const issue = await resolveHealthIssue(input?.value);
      addIssueToMember(memberId, issue);
    });
  });

  all("[data-health-query]").forEach((input) => {
    input.addEventListener("input", () => {
      const memberId = input.dataset.healthQuery;
      clearTimeout(state.healthSearchTimers.get(memberId));
      state.healthSearchTimers.set(
        memberId,
        setTimeout(() => searchMemberHealth(memberId, input.value), 220)
      );
    });
    input.addEventListener("keydown", async (event) => {
      if (event.key !== "Enter") return;
      event.preventDefault();
      const issue = await resolveHealthIssue(input.value);
      addIssueToMember(input.dataset.healthQuery, issue);
    });
  });

  all("[data-remove-issue]").forEach((button) => {
    button.addEventListener("click", () => removeIssueFromMember(button.dataset.removeIssue, Number(button.dataset.issueIndex)));
  });
}

function socialValenceClass(valence) {
  if (valence === "risk") return "risk-line";
  if (valence === "neutral") return "ambivalent-line";
  return "support-line";
}

function socialNodeClass(valence) {
  if (valence === "risk") return "node-risk";
  if (valence === "neutral") return "node-ambivalent";
  return "node-support";
}

function socialValenceLabel(valence) {
  if (valence === "risk") return "riesgo";
  if (valence === "neutral") return "ambivalente";
  return "apoyo";
}

const SOCIOGRAM_WIDTH = 1120;
const SOCIOGRAM_HEIGHT = 660;

function defaultSociogramPosition(index, total, width, height) {
  const centerX = width / 2;
  const centerY = height / 2;
  const ring = total > 10 ? 270 : total > 5 ? 225 : 180;
  const angle = (Math.PI * 2 * index) / Math.max(total, 1) - Math.PI / 2;
  return {
    x: centerX + Math.cos(angle) * ring,
    y: centerY + Math.sin(angle) * ring
  };
}

function ensureSociogramPositions(nodes, width, height) {
  nodes.forEach((node, index) => {
    const x = Number(node.x);
    const y = Number(node.y);
    if (!Number.isFinite(x) || !Number.isFinite(y)) {
      Object.assign(node, defaultSociogramPosition(index, nodes.length, width, height));
    } else {
      node.x = x;
      node.y = y;
    }
  });
}

function socialNodeRadius(node) {
  return 26 + Math.min(18, Number(node.strength || 0) / 8);
}

function socialRelationPath(node, index, cx, cy) {
  const dx = Number(node.x) - cx;
  const dy = Number(node.y) - cy;
  const distance = Math.max(1, Math.hypot(dx, dy));
  const middleX = cx + dx / 2;
  const middleY = cy + dy / 2;
  const normalX = -dy / distance;
  const normalY = dx / distance;
  const curve = (index % 2 === 0 ? 1 : -1) * Math.min(68, Math.max(26, distance / 5));
  return `M${cx},${cy} Q${middleX + normalX * curve},${middleY + normalY * curve} ${node.x},${node.y}`;
}

function sociogramSvgPoint(svg, event) {
  const point = svg.createSVGPoint();
  point.x = event.clientX;
  point.y = event.clientY;
  return point.matrixTransform(svg.getScreenCTM().inverse());
}

function updateSociogramNodeDom(node, index, cx, cy) {
  const group = document.querySelector(`.social-node[data-id="${CSS.escape(node.id)}"]`);
  const path = document.querySelector(`.social-link[data-id="${CSS.escape(node.id)}"]`);
  if (!group || !path) return;
  group.setAttribute("transform", `translate(${node.x},${node.y})`);
  path.setAttribute("d", socialRelationPath(node, index, cx, cy));
}

function bindSociogramDrag(box, width, height, cx, cy) {
  const svg = box.querySelector("svg");
  let active = null;

  box.querySelectorAll(".social-node").forEach((group) => {
    group.addEventListener("pointerdown", (event) => {
      if (event.button !== undefined && event.button !== 0) return;
      const node = state.socialNodes.find((item) => item.id === group.dataset.id);
      const index = state.socialNodes.findIndex((item) => item.id === group.dataset.id);
      if (!node || index < 0) return;
      active = {
        node,
        index,
        group,
        pointerId: event.pointerId,
        startX: event.clientX,
        startY: event.clientY,
        moved: false
      };
      group.classList.add("dragging");
      try {
        group.setPointerCapture(event.pointerId);
      } catch {
        // Pointer capture is best-effort on SVG nodes.
      }
      event.preventDefault();
    });

    group.addEventListener("pointermove", (event) => {
      if (!active || active.pointerId !== event.pointerId || active.group !== group) return;
      const point = sociogramSvgPoint(svg, event);
      const radius = socialNodeRadius(active.node) + 18;
      active.node.x = Math.max(radius, Math.min(width - radius, point.x));
      active.node.y = Math.max(radius, Math.min(height - radius, point.y));
      active.moved = active.moved || Math.hypot(event.clientX - active.startX, event.clientY - active.startY) > 4;
      updateSociogramNodeDom(active.node, active.index, cx, cy);
    });

    const finish = (event) => {
      if (!active || active.pointerId !== event.pointerId || active.group !== group) return;
      const wasMoved = active.moved;
      group.classList.remove("dragging");
      try {
        group.releasePointerCapture(event.pointerId);
      } catch {
        // Pointer capture may already be released.
      }
      const nodeId = active.node.id;
      active = null;
      if (wasMoved) {
        renderSocialList();
        updateSummary();
      } else {
        openSocialDialog(nodeId);
      }
    };

    group.addEventListener("pointerup", finish);
    group.addEventListener("pointercancel", finish);
  });
}

function resetSociogramLayout() {
  const width = SOCIOGRAM_WIDTH;
  const height = SOCIOGRAM_HEIGHT;
  state.socialNodes.forEach((node, index) => {
    Object.assign(node, defaultSociogramPosition(index, state.socialNodes.length, width, height));
  });
  renderSociogram();
  updateSummary();
}

function clearSociogram() {
  state.socialNodes = [];
  renderSociogram();
  renderResources();
  updateSummary();
}

function renderSociogram() {
  const box = el("#sociogram");
  const applies = toolState("#tool-sociogram");
  const nodes = applies ? state.socialNodes : [];
  el("#sociogram-status").textContent = !applies ? "No aplica" : `${nodes.length} nodos sociales`;
  if (!applies) {
    box.innerHTML = `<div class="tool-disabled">Sociograma desactivado para este caso.</div>`;
    renderSocialList();
    return;
  }
  const width = SOCIOGRAM_WIDTH;
  const height = SOCIOGRAM_HEIGHT;
  const cx = width / 2;
  const cy = height / 2;
  ensureSociogramPositions(nodes, width, height);
  const lines = nodes
    .map((node, index) => `<path class="social-link ${socialValenceClass(node.valence)}" data-id="${escapeHtml(node.id)}" d="${socialRelationPath(node, index, cx, cy)}" marker-end="url(#arrow-${socialValenceClass(node.valence)})" style="stroke-width:${1.7 + Number(node.strength || 0) / 28}"></path>`)
    .join("");
  const markup = nodes
    .map((node) => `
      <g class="social-node" data-id="${escapeHtml(node.id)}" transform="translate(${node.x},${node.y})">
        <title>${escapeHtml(node.name)} · ${escapeHtml(socialValenceLabel(node.valence))} · intensidad ${escapeHtml(node.strength)}</title>
        <circle cx="0" cy="0" r="${socialNodeRadius(node)}" class="${socialNodeClass(node.valence)}"></circle>
        <text x="0" y="5" text-anchor="middle">${escapeHtml(short(node.name, 15))}</text>
        <text x="0" y="${socialNodeRadius(node) + 16}" text-anchor="middle" class="social-node-meta">${escapeHtml(node.type)} · ${escapeHtml(node.strength)}</text>
      </g>
    `)
    .join("");
  const emptyHint = nodes.length
    ? ""
    : `<text x="${cx}" y="${cy + 92}" text-anchor="middle" class="svg-muted">Anade nodos sociales para evaluar apoyo, riesgo o aislamiento.</text>`;
  box.innerHTML = `
    <svg viewBox="0 0 ${width} ${height}" role="img" aria-label="Sociograma">
      <defs>
        <marker id="arrow-support-line" viewBox="0 -5 10 10" refX="9" refY="0" markerWidth="7" markerHeight="7" orient="auto">
          <path d="M0,-5L10,0L0,5" fill="#63dfa0"></path>
        </marker>
        <marker id="arrow-ambivalent-line" viewBox="0 -5 10 10" refX="9" refY="0" markerWidth="7" markerHeight="7" orient="auto">
          <path d="M0,-5L10,0L0,5" fill="#e7c95f"></path>
        </marker>
        <marker id="arrow-risk-line" viewBox="0 -5 10 10" refX="9" refY="0" markerWidth="7" markerHeight="7" orient="auto">
          <path d="M0,-5L10,0L0,5" fill="#ff7e7e"></path>
        </marker>
      </defs>
      <rect x="0" y="0" width="${width}" height="${height}" class="svg-bg"></rect>
      ${lines}
      <circle cx="${cx}" cy="${cy}" r="58" class="person-core sociogram-core"></circle>
      <text x="${cx}" y="${cy + 5}" text-anchor="middle" class="person-label">CASO</text>
      ${markup}
      ${emptyHint}
    </svg>
  `;
  bindSociogramDrag(box, width, height, cx, cy);
  renderSocialList();
}

function openSocialDialog(id = "") {
  const node = state.socialNodes.find((item) => item.id === id);
  el("#social-dialog-title").textContent = node ? "Editar nodo social" : "Anadir nodo social";
  el("#social-edit-id").value = node?.id || "";
  el("#social-name").value = node?.name || "";
  el("#social-type").value = node?.type || "amistad";
  el("#social-valence").value = node?.valence || "support";
  el("#social-strength").value = node?.strength ?? 60;
  el("#social-notes").value = node?.notes || "";
  el("#social-dialog").showModal();
}

function renderSocialList() {
  const list = el("#social-list");
  clearNode(list);
  if (!toolState("#tool-sociogram")) {
    list.appendChild(create("p", "quiet-text", "Sociograma desactivado. No se integrara en el informe."));
    return;
  }
  if (!state.socialNodes.length) {
    list.appendChild(create("p", "quiet-text", "0 nodos sociales registrados."));
    return;
  }
  state.socialNodes.forEach((node) => {
    const row = create("div", `family-row ${socialNodeClass(node.valence)}`);
    const text = create("button", "family-select");
    text.type = "button";
    text.innerHTML = `<strong>${escapeHtml(node.name)}</strong><span>${escapeHtml(node.type)} &middot; ${escapeHtml(socialValenceLabel(node.valence))} &middot; intensidad ${node.strength}</span>`;
    text.addEventListener("click", () => openSocialDialog(node.id));
    const remove = create("button", "mini-remove", "x");
    remove.type = "button";
    remove.addEventListener("click", () => {
      state.socialNodes = state.socialNodes.filter((item) => item.id !== node.id);
      renderSociogram();
      renderResources();
      updateSummary();
    });
    row.append(text, remove);
    list.appendChild(row);
  });
}

function saveSocialNode() {
  const id = el("#social-edit-id").value;
  const existing = state.socialNodes.find((node) => node.id === id);
  const position = existing
    ? { x: existing.x, y: existing.y }
    : defaultSociogramPosition(state.socialNodes.length, state.socialNodes.length + 1, SOCIOGRAM_WIDTH, SOCIOGRAM_HEIGHT);
  const payload = {
    id: id || `social-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    name: el("#social-name").value.trim() || "Nodo social",
    type: el("#social-type").value,
    valence: el("#social-valence").value,
    strength: Number(el("#social-strength").value),
    notes: el("#social-notes").value.trim(),
    x: position.x,
    y: position.y
  };
  if (id) state.socialNodes = state.socialNodes.map((node) => (node.id === id ? payload : node));
  else state.socialNodes.push(payload);
  el("#social-dialog").close();
  renderSociogram();
  renderResources();
  updateSummary();
}

function renderResourceCities() {
  const box = el("#resource-city-selector");
  clearNode(box);
  Object.keys(state.resources).forEach((city) => {
    const button = create("button", city === cityValue() ? "active" : "", city);
    button.type = "button";
    button.addEventListener("click", () => {
      el("#case-city").value = city;
      pruneSelectedResourcesForCity(city);
      renderResources();
      updateSummary();
    });
    box.appendChild(button);
  });
}

function resourceScore(resource) {
  return resource.appliesTo.reduce((sum, key) => {
    const variable = state.variables[key];
    return sum + (variable?.active ? 10 + Number(variable.severity || 0) : 0);
  }, 0);
}

function resourceLocation(resource, index) {
  const city = cityValue();
  const explicit = resourceLocations[city]?.[resource.id];
  if (explicit) return explicit;

  const center = cityCenters[city] || cityCenters.Madrid;
  return stableResourceOffset(resource, index, center);
}

function resourceMapSearchUrl(resource, index) {
  const location = resourceLocation(resource, index);
  const query = `${location.address || resource.name} ${cityValue()}`;
  return `https://www.openstreetmap.org/search?query=${encodeURIComponent(query)}`;
}

function resourceMarkerClass(resource) {
  if (resource.category === "salud") return "health";
  if (resource.category === "dependencia") return "care";
  if (resource.category === "insercion") return "work";
  if (resource.category === "infancia y juventud") return "youth";
  if (resource.category === "emergencia social") return "emergency";
  if (resource.category === "migracion") return "migration";
  if (resource.category === "vivienda") return "housing";
  if (resource.category === "mujer") return "women";
  return "community";
}

function stableResourceOffset(resource, index, center) {
  let hash = 0;
  const key = `${resource.id || resource.name}-${index}`;
  for (let i = 0; i < key.length; i += 1) {
    hash = (hash * 31 + key.charCodeAt(i)) >>> 0;
  }
  const angle = ((hash % 360) * Math.PI) / 180;
  const ring = 0.018 + ((hash % 5) * 0.011);
  const verticalBias = ((Math.floor(hash / 7) % 7) - 3) * 0.0025;
  return {
    lat: center.lat + Math.sin(angle) * ring + verticalBias,
    lng: center.lng + Math.cos(angle) * ring,
    address: `${resource.name}, ${cityValue()}`
  };
}

function renderGroupedResourceList(resources, grid) {
  const groups = resources.reduce((acc, resource, index) => {
    const category = resource.category || "otros";
    if (!acc.has(category)) acc.set(category, []);
    acc.get(category).push({ resource, index });
    return acc;
  }, new Map());

  [...groups.entries()].forEach(([category, entries]) => {
    const group = create("section", "resource-category-group");
    const header = create("div", "resource-group-header");
    header.innerHTML = `
      <strong>${escapeHtml(category)}</strong>
      <span>${entries.length} ${entries.length === 1 ? "recurso" : "recursos"}</span>
    `;
    const list = create("div", "resource-card-list");

    entries.forEach(({ resource, index }) => {
      const id = `${cityValue()}:${resource.id}`;
      const item = create("article", `resource-card ${state.selectedResources.has(id) ? "selected" : ""}`);
      const location = resourceLocation(resource, index);
      item.innerHTML = `
        <div>
          <strong>${escapeHtml(resource.name)}</strong>
          <span>${escapeHtml(resource.type)} &middot; ajuste ${resourceScore(resource)}</span>
        </div>
        <p>${escapeHtml(resource.description)}</p>
        <small>${escapeHtml(location.address || cityValue())}</small>
        <div class="resource-links">
          <a href="${escapeHtml(resource.url || "#")}" target="_blank" rel="noopener">Enlace oficial</a>
          <a href="${escapeHtml(resourceMapSearchUrl(resource, index))}" target="_blank" rel="noopener">Ubicacion</a>
        </div>
        <button type="button">${state.selectedResources.has(id) ? "Seleccionado" : "Seleccionar"}</button>
      `;
      item.querySelector("button").addEventListener("click", () => {
        if (state.selectedResources.has(id)) state.selectedResources.delete(id);
        else state.selectedResources.add(id);
        renderResources();
        updateSummary();
      });
      list.appendChild(item);
    });

    group.append(header, list);
    grid.appendChild(group);
  });
}

function renderResourceMap(resources) {
  const mapNode = el("#resource-map");
  if (!mapNode) return;

  const panelActive = document.querySelector('[data-panel="2"]')?.classList.contains("active");
  if (!panelActive) return;

  if (!toolState("#tool-resource-map")) {
    if (resourceMapInstance) {
      resourceMapInstance.remove();
      resourceMapInstance = null;
      resourceMarkerLayer = null;
    }
    mapNode.innerHTML = `<div class="tool-disabled">Mapa de recursos desactivado para este caso.</div>`;
    return;
  }

  const city = cityValue();
  if (!city) {
    if (resourceMapInstance) {
      resourceMapInstance.remove();
      resourceMapInstance = null;
      resourceMarkerLayer = null;
    }
    mapNode.innerHTML = `<div class="tool-disabled">Selecciona una ciudad en el paso 1 para activar el mapa territorial de recursos.</div>`;
    return;
  }

  const center = cityCenters[city] || cityCenters.Madrid;
  if (!window.L) {
    if (resourceMapInstance) {
      resourceMapInstance.remove();
      resourceMapInstance = null;
      resourceMarkerLayer = null;
    }
    mapNode.innerHTML = `
      <div class="map-fallback">
        <strong>Mapa interactivo no disponible</strong>
        <span>Abre las ubicaciones desde el listado inferior.</span>
        <a href="https://www.openstreetmap.org/search?query=${encodeURIComponent(city)}" target="_blank" rel="noopener">Abrir ${escapeHtml(city)} en OpenStreetMap</a>
      </div>
    `;
    return;
  }

  if (!resourceMapInstance) {
    mapNode.innerHTML = "";
    resourceMapInstance = window.L.map(mapNode, {
      scrollWheelZoom: false,
      zoomControl: true
    });
    window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(resourceMapInstance);
    resourceMarkerLayer = window.L.layerGroup().addTo(resourceMapInstance);
  }

  resourceMapInstance.setView([center.lat, center.lng], center.zoom);
  resourceMarkerLayer.clearLayers();
  const bounds = [];

  resources.forEach((resource, index) => {
    const location = resourceLocation(resource, index);
    bounds.push([location.lat, location.lng]);
    const icon = window.L.divIcon({
      className: "resource-map-pin",
      html: `<span class="${resourceMarkerClass(resource)}">${index + 1}</span>`,
      iconSize: [28, 28],
      iconAnchor: [14, 14],
      popupAnchor: [0, -16]
    });
    window.L.marker([location.lat, location.lng], { icon })
      .bindPopup(`
        <strong>${escapeHtml(resource.name)}</strong>
        <p>${escapeHtml(resource.description)}</p>
        <small>${escapeHtml(location.address || city)}</small>
        <div class="popup-links">
          <a href="${escapeHtml(resource.url || "#")}" target="_blank" rel="noopener">Enlace oficial</a>
          <a href="${escapeHtml(resourceMapSearchUrl(resource, index))}" target="_blank" rel="noopener">Ver ubicacion</a>
        </div>
      `)
      .addTo(resourceMarkerLayer);
  });

  if (bounds.length > 1) {
    resourceMapInstance.fitBounds(bounds, { padding: [34, 34], maxZoom: 12 });
  }
  setTimeout(() => resourceMapInstance?.invalidateSize(), 80);
}

function renderResources() {
  recalculateVariables();
  renderResourceCities();
  const city = cityValue();
  pruneSelectedResourcesForCity(city);
  const resources = city ? [...(state.resources[city] || [])].sort((a, b) => resourceScore(b) - resourceScore(a)) : [];
  const grid = el("#resource-grid");
  clearNode(grid);
  el("#resource-count").textContent = city ? `${resources.length} recursos disponibles en ${city}` : "Selecciona ciudad";
  renderResourceMap(resources);
  if (!city) {
    grid.appendChild(create("p", "quiet-text", "Selecciona Madrid, Barcelona o Sevilla en el paso 1 para listar recursos institucionales y del tercer sector."));
    return;
  }
  if (!toolState("#tool-resource-map")) {
    grid.appendChild(create("p", "quiet-text", "Mapa de recursos desactivado. No se integrara en el informe."));
    return;
  }
  renderGroupedResourceList(resources, grid);
}

async function renderIcdSearchResults(query, boxSelector, onSelect, limit = 12) {
  const box = el(boxSelector);
  if (query.trim().length < 2) {
    box.classList.remove("visible");
    clearNode(box);
    return;
  }
  const payload = await searchIcdApi(query, limit);
  clearNode(box);
  (payload.results || []).forEach((entry) => {
    const button = create("button");
    button.type = "button";
    button.innerHTML = `
      <span class="result-code">${escapeHtml(entry.code)} · ${escapeHtml(entry.chapter)}</span>
      <span>${escapeHtml(entry.title)}</span>
      <span class="result-chapter">${escapeHtml(entry.titleEn || "")}</span>
    `;
    button.addEventListener("click", () => onSelect(entry, payload.version));
    box.appendChild(button);
  });
  box.classList.toggle("visible", Boolean(payload.results?.length));
}

async function searchIcd11(query) {
  return renderIcdSearchResults(query, "#icd-results", (entry, version) => selectDiagnosis(entry, version), 12);
}

async function searchDualIcd11(index, query) {
  return renderIcdSearchResults(
    query,
    `#dual-icd-results-${index + 1}`,
    (entry, version) => selectDualDiagnosis(index, entry, version),
    12
  );
}

function selectDiagnosis(entry, version = "2026-01") {
  state.selectedDiagnosis = { ...entry, version };
  el("#icd-search").value = `${entry.code} · ${entry.title}`;
  el("#selected-diagnosis").textContent = `${entry.code} - ${entry.title}`;
  el("#icd-results").classList.remove("visible");
  if (!state.variables.salud.active) {
    state.variables.salud.active = true;
    state.variables.salud.severity = 45;
    renderVariables();
  }
  renderResources();
  updateSummary();
}

function selectDualDiagnosis(index, entry, version = "2026-01") {
  state.dualDiagnoses[index] = { ...entry, version };
  el(`#dual-icd-search-${index + 1}`).value = `${entry.code} · ${entry.title}`;
  el(`#dual-selected-${index + 1}`).textContent = `${entry.code} - ${entry.title}`;
  el(`#dual-icd-results-${index + 1}`).classList.remove("visible");
  state.variables.salud.active = true;
  state.variables.salud.severity = Math.max(Number(state.variables.salud.severity || 0), 55);
  renderVariables();
  renderResources();
  updateSummary();
}

function updateDualDiagnosisPanel() {
  const enabled = dualDiagnosisApplies();
  const panel = el("#dual-diagnosis-fields");
  if (panel) panel.hidden = !enabled;
  if (!enabled) {
    state.dualDiagnoses = [null, null];
    ["#dual-icd-search-1", "#dual-icd-search-2", "#dual-diagnosis-notes"].forEach((selector) => {
      const node = el(selector);
      if (node) node.value = "";
    });
    ["#dual-selected-1", "#dual-selected-2"].forEach((selector, index) => {
      const node = el(selector);
      if (node) node.textContent = index === 0 ? "Primer codigo pendiente." : "Segundo codigo pendiente.";
    });
    all("#dual-icd-results-1, #dual-icd-results-2").forEach((node) => {
      clearNode(node);
      node.classList.remove("visible");
    });
  }
  recalculateVariables();
  renderVariables();
  renderResources();
  updateSummary();
}

function selectedResourceObjects() {
  const selected = [];
  Object.entries(state.resources).forEach(([city, resources]) => {
    resources.forEach((resource) => {
      if (state.selectedResources.has(`${city}:${resource.id}`)) selected.push({ city, ...resource });
    });
  });
  return selected;
}

function pruneSelectedResourcesForCity(city = cityValue()) {
  if (!city) {
    state.selectedResources.clear();
    return;
  }
  [...state.selectedResources].forEach((key) => {
    if (!key.startsWith(`${city}:`)) state.selectedResources.delete(key);
  });
}

function selectedLabel(selector) {
  return el(selector)?.selectedOptions?.[0]?.textContent?.trim() || "";
}

function buildCaseData() {
  const variables = recalculateVariables();
  const socialProfile = getSocialProfileData();
  const ethicalFrame = getEthicalFrameData();
  const selectedResources = selectedResourceObjects();
  const healthApplies = familyHealthApplies();
  const noRecognitions = recognitionsNoneSelected();
  const familyMembers = state.familyMembers.map((member) =>
    healthApplies ? member : { ...member, healthIssues: [] }
  );
  return {
    person: {
      name: el("#privacy-mode").checked ? "" : el("#case-name").value.trim(),
      code: el("#case-code").value.trim(),
      age: el("#case-age").value,
      pronouns: el("#case-pronouns").value,
      reference: el("#case-reference").value,
      originCountry: el("#case-origin-country").value.trim(),
      nationalStatus: el("#case-national-status").value,
      nationalStatusLabel: selectedLabel("#case-national-status"),
      language: el("#case-language").value.trim(),
      yearsInSpain: el("#case-years-spain").value,
      yearsInSpainLabel: selectedLabel("#case-years-spain"),
      privacy: el("#privacy-mode").checked
    },
    ethicalFrame,
    diagnosis: state.selectedDiagnosis,
    dualDiagnosis: {
      applies: dualDiagnosisApplies(),
      diagnoses: selectedDualDiagnoses(),
      notes: el("#dual-diagnosis-notes")?.value.trim() || ""
    },
    diagnosisStatus: getDiagnosisStatusLabel(),
    indications: el("#diagnosis-indications").value,
    city: cityValue(),
    district: el("#case-district").value,
    housing: el("#case-housing").value,
    socialProfile,
    recognitions: {
      noneRecognized: noRecognitions,
      vulnerabilityCertificate: !noRecognitions && el("#has-vulnerability-certificate").checked,
      vulnerabilityLevel: noRecognitions ? "" : el("#vulnerability-level").value,
      disabilityRecognized: !noRecognitions && el("#has-disability").checked,
      disabilityPercent: noRecognitions ? "" : el("#disability-percent").value,
      dependencyRecognized: !noRecognitions && el("#has-dependency").checked,
      dependencyGrade: noRecognitions ? "" : el("#dependency-grade").value,
      supports: noRecognitions ? "" : el("#recognized-supports").value,
      administrativeNotes: noRecognitions ? "" : el("#admin-notes").value
    },
    familyHealthApplies: healthApplies,
    familyHealthProblems: healthApplies ? el("#family-health-problems").value : "",
    familyHealthIssues: familyHealthIssues(),
    includePreventionProgram: healthApplies && el("#include-prevention-program").checked,
    context: el("#case-context").value,
    variables,
    family: {
      noNetwork: el("#no-family-network").checked,
      members: familyMembers
    },
    tools: {
      genogram: {
        applies: toolState("#tool-genogram"),
        evaluated: el("#no-family-network").checked || familyMembers.length > 0,
        conflict: familyMembers.filter((member) => ["conflictiva", "riesgo"].includes(member.relation)).length * 25,
        members: familyMembers
      },
      sociogram: {
        applies: toolState("#tool-sociogram"),
        evaluated: state.socialNodes.length > 0,
        isolation: state.socialNodes.length ? Math.max(0, 100 - Math.round(state.socialNodes.reduce((sum, node) => sum + Number(node.strength || 0), 0) / state.socialNodes.length)) : 0,
        nodes: state.socialNodes
      },
      resourceMap: {
        applies: toolState("#tool-resource-map"),
        evaluated: Boolean(cityValue()),
        selected: selectedResources
      }
    }
  };
}

function renderMetricBlocks(variables = {}) {
  const grid = el("#metric-grid");
  if (!grid) return;
  clearNode(grid);
  Object.entries(metricLabels).forEach(([key, label]) => {
    const variable = variables[key] || {};
    const value = variable.active ? Number(variable.severity || 0) : 0;
    const card = create("div", "metric");
    card.innerHTML = `<span>${label}</span><strong>${value}</strong><div><i style="width:${value}%"></i></div>`;
    grid.appendChild(card);
  });
}

function renderList(selector, values = []) {
  const list = el(selector);
  clearNode(list);
  values.forEach((value) => list.appendChild(create("li", "", value)));
}

function renderRoadmap(report) {
  const roadmap = el("#roadmap");
  clearNode(roadmap);
  const programPhases = report.interventionProgram?.phases || [];
  const phases = programPhases.length
    ? programPhases.map((phase) => ({
        title: phase.phase,
        timeframe: phase.timeframe,
        focus: phase.focus,
        goal: phase.goal,
        items: [...(phase.actions || []), ...(phase.indicators || []).map((indicator) => `Indicador: ${indicator}`)].slice(0, 6)
      }))
    : [
        { title: "1. Acogida y delimitacion", items: [report.objectives[0], report.strategies[0]] },
        { title: "2. Diagnostico social operativo", items: report.professionalObservations.slice(0, 2) },
        { title: "3. Activacion de recursos", items: report.resources.slice(0, 3).map((resource) => `${resource.name}: ${resource.description}`) },
        { title: "4. Seguimiento", items: report.recommendations }
      ];
  phases.forEach((phase) => {
    const item = create("article", "roadmap-step");
    if (phase.timeframe) item.appendChild(create("span", "roadmap-timeframe", phase.timeframe));
    item.appendChild(create("strong", "", phase.title));
    if (phase.focus || phase.goal) {
      item.appendChild(create("p", "", compactParts([phase.focus, phase.goal])));
    }
    const list = create("ul");
    phase.items.filter(Boolean).forEach((entry) => list.appendChild(create("li", "", entry)));
    item.appendChild(list);
    roadmap.appendChild(item);
  });
}

function renderSelectedResourcesReport(report) {
  const box = el("#selected-resources-report");
  const resources = selectedResourceObjects().length ? selectedResourceObjects() : report.resources;
  clearNode(box);
  resources.forEach((resource) => {
    const item = create("article", "selected-resource");
    item.innerHTML = `<strong>${escapeHtml(resource.name)}</strong><span>${escapeHtml(resource.city || cityValue())} · ${escapeHtml(resource.category)} · ${escapeHtml(resource.type)}</span><p>${escapeHtml(resource.description)}</p>${resource.url ? `<a href="${escapeHtml(resource.url)}" target="_blank" rel="noopener">Enlace oficial</a>` : ""}`;
    box.appendChild(item);
  });
}

function renderSocialProfileReport(caseData) {
  const box = el("#social-profile-report");
  if (!box) return;
  clearNode(box);
  const profile = caseData.socialProfile || {};
  const familySummary = caseData.family?.noNetwork
    ? "Sin red familiar / apoyo identificado"
    : caseData.family?.members?.length
      ? `${caseData.family.members.length} vinculos registrados`
      : "Sin vinculos familiares detallados";
  const items = [
    ["Persona/codigo", caseData.person?.name || caseData.person?.code || "No registrado"],
    ["Edad", caseData.person?.age || "No registrada"],
    ["Pais de origen", caseData.person?.originCountry || "No registrado"],
    ["Nacionalidad / apatridia", caseData.person?.nationalStatusLabel || "No registrada"],
    ["Idioma habitual", caseData.person?.language || "No registrado"],
    ["Tiempo en Espana", caseData.person?.yearsInSpainLabel || "No registrado"],
    ["Consentimiento / uso educativo", caseData.ethicalFrame?.consentAcknowledged ? "Registrado" : "Pendiente de revisar"],
    ["Participacion usuaria", caseData.ethicalFrame?.participationLevelLabel || "No registrada"],
    ["Urgencia social inicial", caseData.ethicalFrame?.urgencyLabel || "No registrada"],
    ["Ciudad", compactParts([caseData.city, caseData.district]) || "No registrada"],
    ["Vivienda", optionText("#case-housing") || caseData.housing || "No registrada"],
    ["Situacion administrativa", profile.administrativeStatusLabel || "No registrada"],
    ["Permiso residencia/trabajo", profile.residencePermitLabel || "No registrado"],
    ["Empleo", profile.employmentStatusLabel || "No registrado"],
    ["Profesion", profile.profession || "No registrada"],
    ["Estudios", profile.educationLevelLabel || "No registrados"],
    ["Ingresos/prestaciones", profile.incomeStatusLabel || "No registrados"],
    ["Familia", familySummary],
    ["Salud familiar 1.7", caseData.familyHealthApplies ? "Aplica al caso" : "No aplica: estudio centrado en la persona"],
    ["Patologias familiares", `${caseData.familyHealthIssues?.length || 0} registros`],
    ["Patologia dual", caseData.dualDiagnosis?.applies ? formatDualDiagnosis(caseData.dualDiagnosis) : "No aplica"],
    ["Barreras", profile.barriers || "No registradas"]
  ];

  items.forEach(([label, value]) => {
    const item = create("div", "profile-item");
    item.innerHTML = `<span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong>`;
    box.appendChild(item);
  });
}

function formatDualDiagnosis(dualDiagnosis = {}) {
  if (!dualDiagnosis.applies) return "No aplica";
  const diagnoses = (dualDiagnosis.diagnoses || [])
    .filter(Boolean)
    .map((item) => `${item.code} - ${item.title}`)
    .join(" + ");
  return compactParts([
    diagnoses || "Codigos pendientes de completar",
    dualDiagnosis.notes ? `Observaciones: ${dualDiagnosis.notes}` : ""
  ]);
}

function renderFamilyHealthReport(report) {
  const section = el("#family-health-section");
  const box = el("#family-health-report");
  const analysis = report.familyHealthAnalysis;
  clearNode(box);
  if (!analysis?.enabled || !analysis.detected?.length) {
    section.classList.add("hidden");
    return;
  }
  section.classList.remove("hidden");
  if (analysis.assignment?.length) {
    const summary = create("article", "health-issue-card");
    summary.innerHTML = `
      <div>
        <strong>Asignacion por miembros de la unidad familiar</strong>
        <span>${analysis.members?.length ? analysis.members.map(escapeHtml).join(", ") : "Unidad familiar"}</span>
      </div>
      <ul>${analysis.assignment.map((item) => `<li>${escapeHtml(item.person)}: CIE-11 ${escapeHtml(item.code)} · ${escapeHtml(item.label)}</li>`).join("")}</ul>
    `;
    box.appendChild(summary);
  }
  analysis.detected.forEach((issue) => {
    const card = create("article", "health-issue-card");
    card.innerHTML = `
      <div>
        <strong>${escapeHtml(issue.label)}</strong>
        <span>CIE-11 ${escapeHtml(issue.code)} · ${escapeHtml(issue.chapter)}</span>
      </div>
      <h4>Necesidades de atencion social</h4>
      <ul>${issue.needs.map((need) => `<li>${escapeHtml(need)}</li>`).join("")}</ul>
      <h4>Prevencion</h4>
      <dl>
        <dt>Primaria</dt><dd>${escapeHtml(issue.prevention.primary)}</dd>
        <dt>Secundaria</dt><dd>${escapeHtml(issue.prevention.secondary)}</dd>
        <dt>Terciaria</dt><dd>${escapeHtml(issue.prevention.tertiary)}</dd>
      </dl>
    `;
    box.appendChild(card);
  });
}

function renderProfessionalSynthesis(report) {
  const box = el("#professional-synthesis");
  if (!box) return;
  clearNode(box);
  (report.professionalSynthesis || []).forEach((section) => {
    const card = create("article", "synthesis-card");
    card.innerHTML = `
      <strong>${escapeHtml(section.title)}</strong>
      <p>${escapeHtml(section.text)}</p>
    `;
    box.appendChild(card);
  });
}

function renderClinicalSocialMatrix(report) {
  const box = el("#clinical-social-matrix");
  if (!box) return;
  clearNode(box);
  const rows = report.clinicalSocialMatrix || [];
  if (!rows.length) {
    box.appendChild(create("p", "quiet-text", "Genera el informe para construir la matriz clinica-social evaluable."));
    return;
  }
  rows.forEach((row, index) => {
    const card = create("article", `matrix-card${index === 0 ? " matrix-card-wide" : ""}`);
    card.innerHTML = `
      <span>Eje ${index + 1}</span>
      <strong>${escapeHtml(row.axis || "Eje de analisis")}</strong>
      <dl>
        <dt>Lectura clinica prudente</dt>
        <dd>${escapeHtml(row.clinical || "Pendiente de completar.")}</dd>
        <dt>Vulnerabilidad social asociada</dt>
        <dd>${escapeHtml(row.vulnerability || "Pendiente de completar.")}</dd>
        <dt>Coordinacion sociosanitaria</dt>
        <dd>${escapeHtml(row.coordination || "Pendiente de completar.")}</dd>
        <dt>Indicadores evaluables</dt>
        <dd><ul>${listMarkup(row.indicators || [])}</ul></dd>
      </dl>
    `;
    box.appendChild(card);
  });
}

function listMarkup(items = []) {
  return items.filter(Boolean).map((item) => `<li>${escapeHtml(item)}</li>`).join("");
}

function assetUrl(path) {
  return new URL(path, window.location.href).href;
}

function renderInterventionProgram(report) {
  const box = el("#intervention-program");
  if (!box) return;
  clearNode(box);
  const program = report.interventionProgram;
  if (!program) {
    box.appendChild(create("p", "quiet-text", "Genera el informe para construir la propuesta de intervencion."));
    return;
  }

  const summary = create("article", "intervention-card intervention-card-wide");
  summary.innerHTML = `
    <strong>${escapeHtml(program.title || "Programa provisional de intervencion psicosocial")}</strong>
    <p>${escapeHtml("Propuesta cautelosa desde Educacion Social, orientada a derechos, salud integral, autonomia, red y territorio.")}</p>
  `;
  box.appendChild(summary);

  const blocks = [
    ["Objetivos psicosociales", program.objectives],
    ["Metodologia profesional", program.methodology],
    ["Prevencion primaria", program.prevention?.primary],
    ["Prevencion secundaria", program.prevention?.secondary],
    ["Prevencion terciaria", program.prevention?.tertiary],
    ["Indicadores de seguimiento", program.indicators],
    ["Cautelas profesionales", program.cautions]
  ];

  blocks.forEach(([title, items]) => {
    if (!items?.length) return;
    const card = create("article", "intervention-card");
    card.innerHTML = `<h4>${escapeHtml(title)}</h4><ul>${listMarkup(items)}</ul>`;
    box.appendChild(card);
  });

  if (program.phases?.length) {
    const phaseBox = create("article", "intervention-card intervention-card-wide");
    phaseBox.innerHTML = `
      <h4>Fases del itinerario</h4>
      <div class="intervention-phases">
        ${program.phases
          .map(
            (phase) => `
              <div>
                <strong>${escapeHtml(phase.phase)}</strong>
                ${phase.timeframe ? `<span class="phase-timeframe">${escapeHtml(phase.timeframe)}</span>` : ""}
                <p>${escapeHtml(phase.goal)}</p>
                <ul>${listMarkup([...(phase.actions || []), ...(phase.indicators || [])])}</ul>
              </div>
            `
          )
          .join("")}
      </div>
    `;
    box.appendChild(phaseBox);
  }
}

function renderAcademicBasis(report) {
  const basis = el("#academic-basis");
  const sources = el("#evidence-sources");
  if (!basis || !sources) return;
  clearNode(basis);
  clearNode(sources);

  if (report.educationalContext) {
    const context = create("article", "academic-card academic-card-wide");
    context.innerHTML = `
      <span>Entorno educativo UNIR</span>
      <strong>Salud, Dependencia y Vulnerabilidad Social</strong>
      <p>${escapeHtml(report.educationalContext)}</p>
    `;
    basis.appendChild(context);
  }

  (report.academicBasis || []).forEach((principle) => {
    const card = create("article", "academic-card");
    card.innerHTML = `
      <span>${escapeHtml(principle.source)}</span>
      <strong>${escapeHtml(principle.axis)}</strong>
      <p>${escapeHtml(principle.reportUse || principle.rule)}</p>
    `;
    basis.appendChild(card);
  });

  (report.evidenceSources || []).forEach((source) => {
    const card = create("article", "source-card");
    card.innerHTML = `
      <strong>${escapeHtml(source.title)}</strong>
      <p>${escapeHtml(source.note)}</p>
      <a href="${escapeHtml(source.url)}" target="_blank" rel="noopener">Fuente institucional</a>
    `;
    sources.appendChild(card);
  });
}

async function generateResult() {
  syncRecognitionsToVariables();
  renderVariables();
  renderResources();
  const caseData = buildCaseData();
  const report = await apiPostJson("/api/report", caseData, staticReport);
  state.lastResult = { caseData, report };

  el("#result-empty").classList.add("hidden");
  el("#result-report").classList.remove("hidden");
  el("#validation-panel").classList.toggle("hidden", report.warnings.length === 0);
  renderList("#validation-list", report.warnings);
  el("#report-title").textContent =
    compactParts([
      state.selectedDiagnosis ? `${state.selectedDiagnosis.code} - ${state.selectedDiagnosis.title}` : "",
      dualDiagnosisSummary()
    ]) || "Caso sin diagnostico CIE-11";
  el("#report-priority").textContent = `Prioridad orientativa: ${report.priority}`;
  renderSocialProfileReport(caseData);
  el("#report-interpretation").textContent = report.globalDiagnosis;
  renderProfessionalSynthesis(report);
  renderClinicalSocialMatrix(report);
  renderMetricBlocks(state.variables);
  renderList("#report-needs", report.objectives);
  renderList("#report-risks", report.crossAnalysis.map((item) => item.text));
  renderList("#report-protections", report.recommendations);
  renderInterventionProgram(report);
  renderRoadmap(report);
  renderAcademicBasis(report);
  renderSelectedResourcesReport(report);
  renderFamilyHealthReport(report);
}

async function exportReportPdf() {
  await generateResult();
  if (!state.lastResult) return;
  const { caseData, report } = state.lastResult;
  const logoUrl = assetUrl("assets/social-tools-logo.png");
  const reportDate = new Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    month: "long",
    year: "numeric"
  }).format(new Date());
  const resources = selectedResourceObjects().length ? selectedResourceObjects() : report.resources;
  const profileRows = profileReportRows(caseData)
    .map(([label, value]) => `<div><strong>${escapeHtml(label)}</strong><br>${escapeHtml(value || "No registrado")}</div>`)
    .join("");
  const reportMapRows = [
    ["01", "Ficha social", "Datos personales, administrativos, formativos, laborales y red familiar declarada."],
    ["02", "Lectura socioeducativa", "Interpretacion global del caso con salud, dependencia y vulnerabilidad social."],
    ["03", "Matriz clinica-social", "Relacion entre lectura clinica prudente, vulnerabilidad, coordinacion e indicadores evaluables."],
    ["04", "Plan de intervencion", "Objetivos, metodologia, prevencion y fases de trabajo provisional."],
    ["05", "Seguimiento", "Indicadores, cautelas profesionales y criterios de reajuste del itinerario."],
    ["06", "Recursos territoriales", "Recursos institucionales y del tercer sector aplicables a la ciudad seleccionada."]
  ]
    .map(
      ([number, title, text]) => `
        <div class="report-map-item">
          <span>${escapeHtml(number)}</span>
          <div><strong>${escapeHtml(title)}</strong><p>${escapeHtml(text)}</p></div>
        </div>
      `
    )
    .join("");
  const familyRows = caseData.family?.noNetwork
    ? `<div class="card warning"><strong>Sin red familiar / sin red de apoyo identificada.</strong></div>`
    : (caseData.family?.members || [])
        .map((member) => {
          const issues = (member.healthIssues || []).map((issue) => `${issue.code} - ${issue.label}`).join("; ");
          return `<div class="card"><strong>${escapeHtml(member.name || member.role)}</strong><br><small>${escapeHtml(member.role)} · ${escapeHtml(member.generation)} · ${escapeHtml(member.kinship)} · ${escapeHtml(member.relation)}</small><p>${escapeHtml(member.notes || "Sin caracteristicas adicionales.")}</p><p><strong>Salud asociada:</strong> ${escapeHtml(issues || "Sin patologias registradas.")}</p></div>`;
        })
        .join("");
  const sociogramRows = (caseData.tools?.sociogram?.nodes || [])
    .map((node) => `<li>${escapeHtml(node.name)}: ${escapeHtml(node.type)} · ${escapeHtml(node.valence)} · intensidad ${escapeHtml(node.strength)}</li>`)
    .join("");
  const dualDiagnosisText = formatDualDiagnosis(caseData.dualDiagnosis);
  const program = report.interventionProgram || {};
  const pdfList = (items = []) => items.filter(Boolean).map((item) => `<li>${escapeHtml(item)}</li>`).join("");
  const programSections = [
    ["Objetivos psicosociales", program.objectives],
    ["Metodología profesional", program.methodology],
    ["Prevención primaria", program.prevention?.primary],
    ["Prevención secundaria", program.prevention?.secondary],
    ["Prevención terciaria", program.prevention?.tertiary],
    ["Indicadores de seguimiento", program.indicators],
    ["Cautelas profesionales", program.cautions]
  ]
    .filter(([, items]) => items?.length)
    .map(([title, items]) => `<div class="card"><h3>${escapeHtml(title)}</h3><ul>${pdfList(items)}</ul></div>`)
    .join("");
  const phaseRows = (program.phases || [])
    .map(
      (phase) => `
        <div class="card phase">
          <h3>${escapeHtml(phase.phase)}</h3>
          ${phase.timeframe ? `<p><strong>Plazo:</strong> ${escapeHtml(phase.timeframe)}</p>` : ""}
          ${phase.focus ? `<p><strong>Foco profesional:</strong> ${escapeHtml(phase.focus)}</p>` : ""}
          <p>${escapeHtml(phase.goal)}</p>
          <ul>${pdfList([...(phase.actions || []), ...(phase.indicators || [])])}</ul>
        </div>
      `
    )
    .join("");
  const monitoringRows = [
    ["Indicadores verificables", program.indicators],
    ["Cautelas profesionales", program.cautions],
    ["Criterios de reajuste", report.recommendations]
  ]
    .filter(([, items]) => items?.length)
    .map(([title, items]) => `<div class="card phase"><h3>${escapeHtml(title)}</h3><ul>${pdfList(items)}</ul></div>`)
    .join("");
  const academicRows = (report.academicBasis || [])
    .map(
      (principle) => `
        <div class="card">
          <h3>${escapeHtml(principle.source)}</h3>
          <p><strong>${escapeHtml(principle.axis)}</strong></p>
          <p>${escapeHtml(principle.reportUse || principle.rule)}</p>
        </div>
      `
    )
    .join("");
  const evidenceRows = (report.evidenceSources || [])
    .map(
      (source) => `
        <div class="card source">
          <strong>${escapeHtml(source.title)}</strong>
          <p>${escapeHtml(source.note)}</p>
          <a href="${escapeHtml(source.url)}">${escapeHtml(source.url)}</a>
        </div>
      `
    )
    .join("");
  const synthesisRows = (report.professionalSynthesis || [])
    .map(
      (section) => `
        <div class="card source">
          <h3>${escapeHtml(section.title)}</h3>
          <p>${escapeHtml(section.text)}</p>
        </div>
      `
    )
    .join("");
  const matrixRows = (report.clinicalSocialMatrix || [])
    .map(
      (row, index) => `
        <div class="card matrix">
          <p class="eyebrow">Eje ${index + 1}</p>
          <h3>${escapeHtml(row.axis || "Eje de analisis")}</h3>
          <dl>
            <dt>Lectura clinica prudente</dt>
            <dd>${escapeHtml(row.clinical || "Pendiente de completar.")}</dd>
            <dt>Vulnerabilidad social asociada</dt>
            <dd>${escapeHtml(row.vulnerability || "Pendiente de completar.")}</dd>
            <dt>Coordinacion sociosanitaria</dt>
            <dd>${escapeHtml(row.coordination || "Pendiente de completar.")}</dd>
            <dt>Indicadores evaluables</dt>
            <dd><ul>${pdfList(row.indicators || [])}</ul></dd>
          </dl>
        </div>
      `
    )
    .join("");
  const html = `
    <!doctype html>
    <html lang="es">
      <head>
        <meta charset="utf-8" />
        <title>${escapeHtml(report.title)}</title>
        <style>
          @page { size: A4; margin: 22mm 17mm 18mm; }
          * { box-sizing: border-box; }
          :root { --blue: #388bff; --cyan: #41d0d8; --ink: #13202b; --muted: #566675; --line: #d9e6f2; --soft: #f5f9ff; }
          body {
            margin: 0;
            background: #fff;
            color: var(--ink);
            font-family: Arial, sans-serif;
            font-size: 11.5px;
            line-height: 1.56;
          }
          .page-chrome {
            position: fixed;
            top: 7mm;
            left: 17mm;
            right: 17mm;
            z-index: 10;
            display: flex;
            align-items: center;
            justify-content: space-between;
            pointer-events: none;
          }
          .page-chrome img {
            width: 15mm;
            height: 15mm;
            object-fit: contain;
          }
          .page-chrome span {
            color: #627386;
            font-size: 9.5px;
            font-weight: 700;
            letter-spacing: .02em;
          }
          header {
            margin: 0 0 18px;
            padding: 20px 20px 18px;
            border: 1px solid var(--line);
            border-left: 7px solid var(--blue);
            border-radius: 16px;
            background:
              linear-gradient(135deg, rgba(56, 139, 255, .11), rgba(65, 208, 216, .05)),
              #fff;
          }
          .eyebrow {
            margin: 0 0 6px;
            color: var(--blue);
            font-size: 10px;
            font-weight: 800;
            letter-spacing: .09em;
            text-transform: uppercase;
          }
          h1 { margin: 0 0 8px; color: #0a1420; font-size: 27px; line-height: 1.08; }
          h2 {
            margin: 24px 0 10px;
            color: #0a57d6;
            font-size: 16px;
            border-bottom: 1.5px solid rgba(56, 139, 255, .26);
            padding-bottom: 6px;
          }
          h3 { margin: 4px 0 6px; color: #142232; font-size: 13px; }
          p { margin: 0 0 8px; }
          a { color: #0a57d6; overflow-wrap: anywhere; text-decoration: none; }
          section { break-inside: avoid; page-break-inside: avoid; }
          ul { margin: 8px 0 0 18px; padding: 0; }
          li { margin-bottom: 5px; }
          .meta,
          .grid,
          .grid3,
          .program-grid,
          .roadmap,
          .section-stack {
            display: grid;
            grid-template-columns: 1fr;
            gap: 10px;
          }
          .meta { margin-top: 14px; }
          .meta div,
          .card {
            border: 1px solid var(--line);
            border-radius: 12px;
            padding: 11px 12px;
            background: var(--soft);
          }
          .badge {
            display: inline-flex;
            align-items: center;
            margin-top: 6px;
            padding: 6px 10px;
            border: 1px solid rgba(56, 139, 255, .28);
            border-radius: 999px;
            background: #fff;
            color: #0a57d6;
            font-size: 10.5px;
            font-weight: 800;
          }
          .report-map {
            display: grid;
            grid-template-columns: 1fr;
            gap: 8px;
          }
          .report-map-item {
            display: grid;
            grid-template-columns: 34px 1fr;
            gap: 10px;
            align-items: start;
            border: 1px solid var(--line);
            border-radius: 12px;
            background: #f7fbff;
            padding: 10px 12px;
          }
          .report-map-item span {
            color: var(--blue);
            font-size: 11px;
            font-weight: 900;
            letter-spacing: .08em;
          }
          .report-map-item strong {
            display: block;
            color: #102131;
            margin-bottom: 2px;
          }
          .report-map-item p {
            margin: 0;
            color: var(--muted);
          }
          .phase-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 10px;
          }
          .phase {
            break-inside: avoid;
            border-left: 5px solid var(--cyan);
            background: #f7fbff;
          }
          .source { border-left: 5px solid var(--blue); background: #f7fbff; }
          .matrix { border-left: 5px solid var(--blue); background: #f7fbff; }
          .matrix dl {
            display: grid;
            gap: 6px;
            margin: 0;
          }
          .matrix dt {
            color: #0a57d6;
            font-size: 10px;
            font-weight: 800;
            text-transform: uppercase;
          }
          .matrix dd {
            margin: 0 0 5px;
            color: var(--muted);
          }
          .warning { border-color: #f2b8b5; background: #fff7f6; }
          footer {
            margin-top: 24px;
            border-top: 1px solid var(--line);
            padding-top: 10px;
            color: #647484;
            font-size: 10px;
          }
        </style>
      </head>
      <body>
        <div class="page-chrome">
          <img src="${escapeHtml(logoUrl)}" alt="" />
          <span>${escapeHtml(reportDate)}</span>
        </div>
        <header>
          <p class="eyebrow">Informe socioeducativo provisional</p>
          <h1>Laboratorio de Intervencion Psicosocial</h1>
          <p>Documento de apoyo para estudio de caso, orientacion profesional y planificacion psicosocial con cautela academica.</p>
          <span class="badge">Prioridad orientativa: ${escapeHtml(report.priority)}</span>
          <div class="meta">
            <div><strong>Persona/codigo</strong><br>${escapeHtml(caseData.person?.name || caseData.person?.code || "No registrado")}</div>
            <div><strong>Ciudad</strong><br>${escapeHtml(caseData.city || "No registrada")}</div>
            <div><strong>CIE-11</strong><br>${escapeHtml(compactParts([caseData.diagnosis?.code ? `${caseData.diagnosis.code} ${caseData.diagnosis.title || ""}` : "", caseData.dualDiagnosis?.applies ? "Patologia dual" : ""]) || "No registrado")}</div>
          </div>
        </header>
        ${
          report.warnings?.length
            ? `<section class="card warning"><h2>Validacion automatica</h2><ul>${report.warnings.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul></section>`
            : ""
        }
        <section><h2>Mapa de lectura</h2><div class="report-map">${reportMapRows}</div></section>
        <section><h2>Ficha social transcrita</h2><div class="grid3">${profileRows}</div></section>
        <section><h2>Diagnostico socioeducativo global</h2><p>${escapeHtml(report.globalDiagnosis)}</p></section>
        <section><h2>Informe provisional integrado</h2><div class="program-grid">${synthesisRows || '<div class="card">Sin sintesis profesional generada.</div>'}</div></section>
        <section><h2>Matriz clinica-social e indicadores evaluables</h2><div class="program-grid">${matrixRows || '<div class="card">Sin matriz clinica-social generada.</div>'}</div></section>
        ${caseData.dualDiagnosis?.applies ? `<section><h2>Patologia dual / diagnostico combinado</h2><div class="card"><p>${escapeHtml(dualDiagnosisText)}</p></div></section>` : ""}
        <section class="grid">
          <div class="card"><h2>Objetivos</h2><ul>${report.objectives.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul></div>
          <div class="card"><h2>Recomendaciones</h2><ul>${report.recommendations.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul></div>
        </section>
        <section><h2>Analisis cruzado de variables</h2><ul>${report.crossAnalysis.map((item) => `<li>${escapeHtml(item.text)}</li>`).join("") || "<li>Sin reglas criticas activadas.</li>"}</ul></section>
        <section><h2>Observaciones profesionales</h2><ul>${report.professionalObservations.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul></section>
        <section><h2>Propuesta provisional de intervención psicosocial</h2><div class="program-grid">${programSections || '<div class="card">Sin propuesta generada.</div>'}</div></section>
        <section><h2>Fases del itinerario</h2><div class="phase-grid">${phaseRows || '<div class="card">Sin fases generadas.</div>'}</div></section>
        ${
          report.familyHealthAnalysis?.enabled && report.familyHealthAnalysis.detected?.length
            ? `<section><h2>Unidad familiar: CIE-11, necesidades y prevencion</h2>${
                report.familyHealthAnalysis.assignment?.length
                  ? `<div class="card"><h3>Asignacion por miembros</h3><ul>${report.familyHealthAnalysis.assignment.map((item) => `<li>${escapeHtml(item.person)}: CIE-11 ${escapeHtml(item.code)} · ${escapeHtml(item.label)}</li>`).join("")}</ul></div>`
                  : ""
              }${report.familyHealthAnalysis.detected
                .map(
                  (issue) => `<div class="card"><h3>${escapeHtml(issue.label)}</h3><p><strong>CIE-11 ${escapeHtml(issue.code)}</strong> · ${escapeHtml(issue.chapter)}</p><h3>Necesidades sociales</h3><ul>${issue.needs.map((need) => `<li>${escapeHtml(need)}</li>`).join("")}</ul><h3>Prevencion</h3><ul><li><strong>Primaria:</strong> ${escapeHtml(issue.prevention.primary)}</li><li><strong>Secundaria:</strong> ${escapeHtml(issue.prevention.secondary)}</li><li><strong>Terciaria:</strong> ${escapeHtml(issue.prevention.tertiary)}</li></ul></div>`
                )
                .join("")}</section>`
            : ""
        }
        <section><h2>Genograma y red familiar</h2><div class="grid">${familyRows || '<div class="card">Sin familiares registrados.</div>'}</div></section>
        ${
          caseData.tools?.sociogram?.applies
            ? `<section><h2>Sociograma</h2><div class="card">${sociogramRows ? `<ul>${sociogramRows}</ul>` : "Sociograma activo pero sin nodos registrados."}</div></section>`
            : ""
        }
        <section><h2>Seguimiento, reajuste y cautelas</h2><div class="roadmap">${monitoringRows || '<div class="card">Sin criterios de seguimiento generados.</div>'}</div></section>
        <section><h2>Recursos integrados</h2><div class="grid">${resources
          .map((resource) => `<div class="card"><strong>${escapeHtml(resource.name)}</strong><br><small>${escapeHtml(resource.city || caseData.city)} · ${escapeHtml(resource.category || "")} · ${escapeHtml(resource.type || "")}</small><p>${escapeHtml(resource.description || "")}</p></div>`)
          .join("")}</div></section>
        <section><h2>Enlaces de recursos</h2><ul>${resources
          .map((resource) => `<li><strong>${escapeHtml(resource.name)}</strong>${resource.url ? `: <a href="${escapeHtml(resource.url)}">${escapeHtml(resource.url)}</a>` : ""}</li>`)
          .join("")}</ul></section>
        <section><h2>Perfil administrativo, formativo y laboral</h2><p>${escapeHtml(formatSocialProfile(caseData.socialProfile))}</p></section>
        <section><h2>Reconocimientos y apoyos formales</h2><p>${escapeHtml(formatRecognitions(caseData.recognitions))}</p></section>
        <section><h2>Alineación académica con la asignatura</h2><div class="program-grid">${academicRows || '<div class="card">Sin alineacion academica especifica.</div>'}</div></section>
        <section><h2>Contexto educativo UNIR</h2><div class="card"><p>${escapeHtml(report.educationalContext || "Aplicacion realizada en entorno educativo para la asignatura Salud, Dependencia y Vulnerabilidad Social.")}</p></div></section>
        <section><h2>Fuentes institucionales y académicas de referencia</h2><div class="program-grid">${evidenceRows || '<div class="card">Sin fuentes registradas.</div>'}</div></section>
        <footer>Herramienta de orientacion socioeducativa creada en entorno educativo UNIR para la asignatura Salud, Dependencia y Vulnerabilidad Social. No sustituye diagnostico ni tratamiento clinico. Carlos Aranda Sánchez (2026).</footer>
        <script>
          window.addEventListener('load', () => {
            const logo = document.querySelector('.page-chrome img');
            const printNow = () => setTimeout(() => window.print(), 260);
            if (logo && !logo.complete) {
              logo.addEventListener('load', printNow, { once: true });
              logo.addEventListener('error', printNow, { once: true });
            } else {
              printNow();
            }
          });
        </script>
      </body>
    </html>
  `;
  const win = window.open("", "_blank");
  win.document.open();
  win.document.write(html);
  win.document.close();
}

function profileReportRows(caseData = {}) {
  const profile = caseData.socialProfile || {};
  const familySummary = caseData.family?.noNetwork
    ? "Sin red familiar / apoyo identificado"
    : caseData.family?.members?.length
      ? `${caseData.family.members.length} vinculos registrados`
      : "Sin vinculos familiares detallados";

  return [
    ["Persona/codigo", caseData.person?.name || caseData.person?.code || "No registrado"],
    ["Edad", caseData.person?.age || "No registrada"],
    ["Pais de origen", caseData.person?.originCountry || "No registrado"],
    ["Nacionalidad / apatridia", caseData.person?.nationalStatusLabel || "No registrada"],
    ["Idioma habitual", caseData.person?.language || "No registrado"],
    ["Tiempo en Espana", caseData.person?.yearsInSpainLabel || "No registrado"],
    ["Consentimiento / uso educativo", caseData.ethicalFrame?.consentAcknowledged ? "Registrado" : "Pendiente de revisar"],
    ["Participacion usuaria", caseData.ethicalFrame?.participationLevelLabel || "No registrada"],
    ["Urgencia social inicial", caseData.ethicalFrame?.urgencyLabel || "No registrada"],
    ["Ciudad", compactParts([caseData.city, caseData.district]) || "No registrada"],
    ["Vivienda", optionText("#case-housing") || caseData.housing || "No registrada"],
    ["Situacion administrativa", profile.administrativeStatusLabel || "No registrada"],
    ["Permiso residencia/trabajo", profile.residencePermitLabel || "No registrado"],
    ["Empleo", profile.employmentStatusLabel || "No registrado"],
    ["Profesion", profile.profession || "No registrada"],
    ["Estudios", profile.educationLevelLabel || "No registrados"],
    ["Ingresos/prestaciones", profile.incomeStatusLabel || "No registrados"],
    ["Familia", familySummary],
    ["Salud familiar 1.7", caseData.familyHealthApplies ? "Aplica al caso" : "No aplica: estudio centrado en la persona"],
    ["Patologias familiares", `${caseData.familyHealthIssues?.length || 0} registros`],
    ["Patologia dual", caseData.dualDiagnosis?.applies ? formatDualDiagnosis(caseData.dualDiagnosis) : "No aplica"],
    ["Barreras", profile.barriers || "No registradas"]
  ];
}

function formatSocialProfile(profile = {}) {
  const parts = [
    profile.administrativeStatusLabel ? `Situacion administrativa: ${profile.administrativeStatusLabel}` : "",
    profile.residencePermitLabel ? `permiso: ${profile.residencePermitLabel}` : "",
    profile.employmentStatusLabel ? `empleo: ${profile.employmentStatusLabel}` : "",
    profile.profession ? `profesion: ${profile.profession}` : "",
    profile.educationLevelLabel ? `estudios: ${profile.educationLevelLabel}` : "",
    profile.incomeStatusLabel ? `ingresos/prestaciones: ${profile.incomeStatusLabel}` : "",
    profile.barriers ? `barreras: ${profile.barriers}` : ""
  ].filter(Boolean);
  return parts.length ? parts.join(". ") : "Sin perfil administrativo, formativo o laboral registrado.";
}

function formatRecognitions(recognitions = {}) {
  if (recognitions.noneRecognized) {
    return "Consta explicitamente: sin certificado, sin discapacidad reconocida y sin dependencia reconocida.";
  }
  const parts = [];
  if (recognitions.vulnerabilityCertificate) parts.push("Certificado/informe de vulnerabilidad");
  if (recognitions.vulnerabilityLevel) parts.push(`Nivel vulnerabilidad: ${recognitions.vulnerabilityLevel}`);
  if (recognitions.disabilityRecognized) parts.push(`Discapacidad reconocida${recognitions.disabilityPercent ? ` (${recognitions.disabilityPercent}%)` : ""}`);
  if (recognitions.dependencyRecognized || recognitions.dependencyGrade) parts.push(`Dependencia: ${recognitions.dependencyGrade || "reconocida"}`);
  if (recognitions.supports) parts.push(`Apoyos: ${recognitions.supports}`);
  if (recognitions.administrativeNotes) parts.push(`Observaciones: ${recognitions.administrativeNotes}`);
  return parts.length ? parts.join(". ") : "Sin reconocimientos administrativos registrados.";
}

function updateFamilyHealthApplicability() {
  const enabled = familyHealthApplies();
  all("[data-family-health-dependent]").forEach((node) => {
    node.hidden = !enabled;
    node.querySelectorAll("input, textarea, button").forEach((control) => {
      control.disabled = !enabled;
    });
  });
  if (!enabled) {
    el("#include-prevention-program").checked = false;
    all(".health-results").forEach((node) => {
      clearNode(node);
      node.classList.remove("visible");
    });
  }
  recalculateVariables();
  renderVariables();
  renderMemberHealthPanel();
  renderGenogram();
  renderResources();
  updateSummary();
}

function bindFamilyControls() {
  all("#family-checks input").forEach((input) => {
    input.addEventListener("change", () => {
      const role = input.dataset.role;
      if (input.checked) {
        state.familyRoles.add(role);
        addDefaultFamilyMember(role);
      } else {
        state.familyRoles.delete(role);
        removeDefaultFamilyMember(role);
      }
      if (state.familyMembers.length) {
        state.variables.contextoFamiliar.active = true;
        state.variables.contextoFamiliar.severity = Math.max(state.variables.contextoFamiliar.severity, 40);
        renderVariables();
      }
      renderMemberHealthPanel();
      renderGenogram();
    });
  });

  el("#no-family-network").addEventListener("change", (event) => {
    const disabled = event.target.checked;
    all("#family-checks input").forEach((input) => {
      input.disabled = disabled;
      if (disabled) input.checked = false;
    });
    if (disabled) {
      state.familyRoles.clear();
      state.familyMembers = [];
      state.variables.redSocial.active = true;
      state.variables.redSocial.severity = Math.max(state.variables.redSocial.severity, 80);
      state.variables.contextoFamiliar.active = true;
      state.variables.contextoFamiliar.severity = Math.max(state.variables.contextoFamiliar.severity, 70);
      renderVariables();
    }
    renderMemberHealthPanel();
    renderGenogram();
  });

  el("#family-health-applies").addEventListener("change", updateFamilyHealthApplicability);
  el("#open-family-dialog").addEventListener("click", () => openFamilyDialog());
  el("#clear-family").addEventListener("click", () => {
    state.familyRoles.clear();
    state.familyMembers = [];
    all("#family-checks input").forEach((input) => {
      input.checked = false;
      input.disabled = false;
    });
    el("#no-family-network").checked = false;
    renderMemberHealthPanel();
    renderGenogram();
  });
  el("#save-family-member").addEventListener("click", saveFamilyMember);
  el("#add-social-node").addEventListener("click", () => openSocialDialog());
  el("#layout-sociogram").addEventListener("click", resetSociogramLayout);
  el("#clear-sociogram").addEventListener("click", clearSociogram);
  el("#save-social-node").addEventListener("click", saveSocialNode);
}

function refreshRecognitionVariables() {
  recalculateVariables();
  renderVariables();
  renderResources();
  updateSummary();
}

function bindRecognitionControls() {
  el("#no-recognitions")?.addEventListener("change", updateRecognitionControls);
  all("[data-recognition-dependent] input, [data-recognition-dependent] select, [data-recognition-dependent] textarea").forEach((control) => {
    control.addEventListener("input", refreshRecognitionVariables);
    control.addEventListener("change", refreshRecognitionVariables);
  });
  updateRecognitionControls();
}

function bindDiagnosisControls() {
  el("#icd-search").addEventListener("input", (event) => {
    state.selectedDiagnosis = null;
    el("#selected-diagnosis").textContent = "Buscando en CIE-11...";
    updateSummary();
    clearTimeout(state.searchTimer);
    state.searchTimer = setTimeout(() => {
      const value = event.target.value;
      if (value.trim().length < 2) el("#selected-diagnosis").textContent = "Ninguna patologia seleccionada.";
      searchIcd11(value).catch(() => {
        el("#selected-diagnosis").textContent = "No se pudo consultar la base CIE-11.";
      });
    }, 180);
  });
  el("#dual-diagnosis-enabled").addEventListener("change", updateDualDiagnosisPanel);
  [0, 1].forEach((index) => {
    const input = el(`#dual-icd-search-${index + 1}`);
    input.addEventListener("input", (event) => {
      state.dualDiagnoses[index] = null;
      el(`#dual-selected-${index + 1}`).textContent = index === 0 ? "Buscando primer codigo CIE-11..." : "Buscando segundo codigo CIE-11...";
      updateSummary();
      clearTimeout(state.dualSearchTimers[index]);
      state.dualSearchTimers[index] = setTimeout(() => {
        const value = event.target.value;
        if (value.trim().length < 2) {
          el(`#dual-selected-${index + 1}`).textContent = index === 0 ? "Primer codigo pendiente." : "Segundo codigo pendiente.";
        }
        searchDualIcd11(index, value).catch(() => {
          el(`#dual-selected-${index + 1}`).textContent = "No se pudo consultar la base CIE-11.";
        });
      }, 180);
    });
  });
  document.addEventListener("click", (event) => {
    if (!event.target.closest(".search-group")) all(".search-results").forEach((node) => node.classList.remove("visible"));
  });
  all("input[name='diagnosis-status']").forEach((input) => input.addEventListener("change", updateSummary));
}

const accessibilityState = {
  fontLevel: 0,
  highContrast: false,
  underline: false,
  spacing: false,
  focus: false,
  reduceMotion: false
};

function applyAccessibilityState() {
  const scale = 1 + accessibilityState.fontLevel * 0.08;
  document.documentElement.style.setProperty("--access-font-scale", scale.toFixed(2));
  document.body.classList.toggle("access-high-contrast", accessibilityState.highContrast);
  document.body.classList.toggle("access-underline", accessibilityState.underline);
  document.body.classList.toggle("access-spacing", accessibilityState.spacing);
  document.body.classList.toggle("access-focus", accessibilityState.focus);
  document.body.classList.toggle("access-reduced-motion", accessibilityState.reduceMotion);
  all("[data-accessibility]").forEach((button) => {
    const action = button.dataset.accessibility;
    const active =
      (action === "contrast" && accessibilityState.highContrast) ||
      (action === "underline" && accessibilityState.underline) ||
      (action === "spacing" && accessibilityState.spacing) ||
      (action === "focus" && accessibilityState.focus) ||
      (action === "motion" && accessibilityState.reduceMotion);
    button.setAttribute("aria-pressed", String(active));
  });
}

function bindAccessibilityControls() {
  const toggle = el("#accessibility-toggle");
  const panel = el("#accessibility-panel");
  toggle.addEventListener("click", () => {
    const open = panel.classList.toggle("hidden") === false;
    toggle.setAttribute("aria-expanded", String(open));
  });
  all("[data-accessibility]").forEach((button) => {
    button.addEventListener("click", () => {
      const action = button.dataset.accessibility;
      if (action === "font-plus") accessibilityState.fontLevel = Math.min(3, accessibilityState.fontLevel + 1);
      if (action === "font-normal") accessibilityState.fontLevel = 0;
      if (action === "contrast") accessibilityState.highContrast = !accessibilityState.highContrast;
      if (action === "underline") accessibilityState.underline = !accessibilityState.underline;
      if (action === "spacing") accessibilityState.spacing = !accessibilityState.spacing;
      if (action === "focus") accessibilityState.focus = !accessibilityState.focus;
      if (action === "motion") accessibilityState.reduceMotion = !accessibilityState.reduceMotion;
      if (action === "reset") {
        accessibilityState.fontLevel = 0;
        accessibilityState.highContrast = false;
        accessibilityState.underline = false;
        accessibilityState.spacing = false;
        accessibilityState.focus = false;
        accessibilityState.reduceMotion = false;
      }
      applyAccessibilityState();
    });
  });
  applyAccessibilityState();
}

const leaveWarningMessage =
  "Social Protools no almacena datos del caso. Exporta el informe a PDF antes de salir si quieres conservar el trabajo.";

function showLeaveWarningDialog() {
  const dialog = el("#leave-warning-dialog");
  if (dialog?.showModal && !dialog.open) {
    dialog.showModal();
    return;
  }
  if (!dialog?.open) {
    window.alert(leaveWarningMessage);
  }
}

function goToPdfExport() {
  const dialog = el("#leave-warning-dialog");
  if (dialog?.open) dialog.close();
  setStep(3);
  requestAnimationFrame(() => {
    el("#export-pdf")?.scrollIntoView({ behavior: "smooth", block: "center" });
    el("#export-pdf")?.focus({ preventScroll: true });
  });
}

function bindSessionProtection() {
  if (window.history?.replaceState && window.history?.pushState) {
    window.history.replaceState({ socialProtools: "workspace" }, "", window.location.href);
    window.history.pushState({ socialProtools: "guard" }, "", window.location.href);
    window.addEventListener("popstate", () => {
      window.history.pushState({ socialProtools: "guard" }, "", window.location.href);
      showLeaveWarningDialog();
    });
  }

  window.addEventListener("beforeunload", (event) => {
    event.preventDefault();
    event.returnValue = leaveWarningMessage;
    return leaveWarningMessage;
  });

  el("#leave-warning-stay")?.addEventListener("click", () => {
    el("#leave-warning-dialog")?.close();
  });
  el("#leave-warning-export")?.addEventListener("click", goToPdfExport);
}

function bindNavigation() {
  all(".stepper button").forEach((button) => {
    button.addEventListener("click", () => setStep(button.dataset.step));
  });
  all("[data-jump-step]").forEach((button) => {
    button.addEventListener("click", () => {
      setStep(button.dataset.jumpStep);
      requestAnimationFrame(() => {
        const target = document.getElementById(button.dataset.jumpTarget);
        target?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });
  });
  el("#prev-step").addEventListener("click", () => setStep(state.currentStep - 1));
  el("#next-step").addEventListener("click", () => {
    if (state.currentStep === 3) {
      generateResult().catch(() => {
        el("#result-empty").innerHTML = "<h3>No se pudo generar el resultado</h3><p>Revisa los datos del caso y vuelve a intentarlo.</p>";
      });
      return;
    }
    setStep(state.currentStep + 1);
  });
  el("#reset-button").addEventListener("click", resetWorkspace);
  el("#generate-result").addEventListener("click", () => {
    generateResult().catch(() => {
      el("#result-empty").innerHTML = "<h3>No se pudo generar el resultado</h3><p>Revisa los datos del caso y vuelve a intentarlo.</p>";
    });
  });
  el("#export-pdf").addEventListener("click", () => {
    exportReportPdf().catch(() => {
      el("#result-empty").innerHTML = "<h3>No se pudo exportar</h3><p>Genera el informe y vuelve a intentarlo.</p>";
    });
  });
  ["#tool-genogram", "#tool-sociogram", "#tool-resource-map"].forEach((selector) => {
    el(selector).addEventListener("change", () => {
      renderGenogram();
      renderSociogram();
      renderResources();
    });
  });
}

function bindSummaryInputs() {
  all("input, textarea, select").forEach((input) => {
    input.addEventListener("input", () => {
      updateSummary();
      if (input.id === "case-city") renderResources();
    });
    input.addEventListener("change", () => {
      updateSummary();
      if (input.id === "case-city") renderResources();
    });
  });
}

function populateOriginCountries() {
  const datalist = el("#origin-countries");
  if (!datalist) return;
  const displayNames = typeof Intl !== "undefined" && Intl.DisplayNames
    ? new Intl.DisplayNames(["es"], { type: "region" })
    : null;
  const countryNames = originRegionCodes
    .map((code) => displayNames?.of(code) || code)
    .filter(Boolean)
    .map((name) => (name === "Territorios Palestinos" ? "Palestina / Territorios Palestinos" : name));
  const collator = typeof Intl !== "undefined" && Intl.Collator
    ? new Intl.Collator("es", { sensitivity: "base" })
    : null;
  const values = [...new Set([...countryNames, ...originExtraOptions])]
    .sort((a, b) => (collator ? collator.compare(a, b) : a.localeCompare(b)));
  clearNode(datalist);
  values.forEach((value) => {
    const option = document.createElement("option");
    option.value = value;
    datalist.appendChild(option);
  });
}

function populateAgeSelect() {
  const select = el("#case-age");
  if (!select || select.options.length) return;
  select.appendChild(new Option("Sin registrar", "0"));
  for (let age = 1; age <= 120; age += 1) {
    select.appendChild(new Option(`${age} anos`, String(age)));
  }
}

function updateAgeSelect(value) {
  const age = Math.max(0, Math.min(120, Number(value) || 0));
  const select = el("#case-age");
  if (select) select.value = String(age);
}

function bindAgeSelect() {
  populateAgeSelect();
  const select = el("#case-age");
  select?.addEventListener("change", () => {
    updateAgeSelect(select.value);
    updateSummary();
  });
  updateAgeSelect(select?.value || 0);
}

function resetWorkspace() {
  state.currentStep = 1;
  state.selectedDiagnosis = null;
  state.dualDiagnoses = [null, null];
  state.familyMembers = [];
  state.familyRoles.clear();
  state.socialNodes = [];
  state.selectedResources.clear();
  state.lastResult = null;
  state.variables = Object.fromEntries(
    variableDefinitions.map((definition) => [
      definition.key,
      { active: false, severity: 0, observations: "" }
    ])
  );
  el("#case-form").reset();
  updateAgeSelect(0);
  el("#case-city").value = "";
  all("#family-checks input").forEach((input) => {
    input.checked = false;
    input.disabled = false;
  });
  el("#tool-genogram").checked = false;
  el("#tool-sociogram").checked = false;
  el("#tool-resource-map").checked = false;
  el("#no-recognitions").checked = false;
  el("#family-health-applies").checked = false;
  el("#include-prevention-program").checked = false;
  el("#dual-diagnosis-enabled").checked = false;
  updateDualDiagnosisPanel();
  all("input[name='diagnosis-status']").forEach((input) => {
    input.checked = false;
  });
  el("#selected-diagnosis").textContent = "Ninguna patologia seleccionada.";
  el("#icd-results").classList.remove("visible");
  el("#result-empty").classList.remove("hidden");
  el("#result-report").classList.add("hidden");
  renderVariables();
  updateRecognitionControls();
  updateFamilyHealthApplicability();
  renderMemberHealthPanel();
  setStep(1);
  renderGenogram();
  renderSociogram();
  renderResources();
  updateSummary();
}

async function init() {
  const knowledge = await apiGetJson("/api/knowledge", staticKnowledge);
  state.resources = knowledge.resources || {};
  if (knowledge.icd11) {
    const icdVersion = knowledge.icd11.version || "2026-01";
    el("#data-source").textContent = "Versión beta · Entorno Académico UNIR - Salud, dependencia y vulnerabilidad social";
    el("#icd-data-source").textContent = `OMS CIE-11 ${icdVersion} · 34.784 códigos`;
  }
  populateOriginCountries();
  bindNavigation();
  bindFamilyControls();
  bindRecognitionControls();
  bindDiagnosisControls();
  bindSummaryInputs();
  bindAgeSelect();
  bindAccessibilityControls();
  bindSessionProtection();
  resetWorkspace();
  const requestedStep = Number(new URLSearchParams(window.location.search).get("step") || 1);
  if ([1, 2, 3].includes(requestedStep)) setStep(requestedStep);
}

init().catch(() => {
  el("#data-source").textContent = "Versión beta · Entorno Académico UNIR - Salud, dependencia y vulnerabilidad social";
  el("#icd-data-source").textContent = "OMS CIE-11 2026-01 · 34.784 códigos";
});
