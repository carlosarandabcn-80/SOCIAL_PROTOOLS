const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");
const zlib = require("zlib");

const DATA_PATH = path.resolve(__dirname, "..", "data", "icd11-es-2026.json");
const DATA_GZ_PATH = `${DATA_PATH}.gz`;

let cache;

function normalize(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function loadIcd11() {
  if (!cache) {
    ensureIcd11Data();
    const raw = fs.existsSync(DATA_PATH)
      ? fs.readFileSync(DATA_PATH, "utf8")
      : zlib.gunzipSync(fs.readFileSync(DATA_GZ_PATH)).toString("utf8");
    const payload = JSON.parse(raw);
    const entries = (Array.isArray(payload.entries) ? payload.entries : []).map(normalizeEntry);
    cache = {
      ...payload,
      entries,
      count: payload.count || entries.length,
      byCode: new Map(entries.map((entry) => [entry.code.toUpperCase(), entry]))
    };
  }
  return cache;
}

function ensureIcd11Data() {
  if (fs.existsSync(DATA_PATH) || fs.existsSync(DATA_GZ_PATH)) return;
  const preparerPath = path.resolve(__dirname, "..", "scripts", "prepare-icd11.js");
  execFileSync(process.execPath, [preparerPath], {
    cwd: path.resolve(__dirname, ".."),
    stdio: "inherit"
  });
}

function normalizeEntry(entry) {
  return {
    code: entry.code || entry.c || "",
    title: entry.title || entry.t || "",
    titleEn: entry.titleEn || entry.e || "",
    chapter: entry.chapter || entry.ch || "",
    search: entry.search || entry.s || "",
    link: entry.link || entry.l || ""
  };
}

function scoreEntry(entry, query, normalizedQuery) {
  const code = entry.code.toUpperCase();
  const title = normalize(entry.title);
  const titleEn = normalize(entry.titleEn);
  if (code === query.toUpperCase()) return 1000;
  if (code.startsWith(query.toUpperCase())) return 850;
  if (title.startsWith(normalizedQuery)) return 720;
  if (entry.search && entry.search.includes(normalizedQuery)) return 520;
  if (titleEn.includes(normalizedQuery)) return 430;
  return 0;
}

function searchIcd11(query, limit = 12) {
  const data = loadIcd11();
  const q = String(query || "").trim();
  const normalizedQuery = normalize(q);
  if (normalizedQuery.length < 2) {
    return {
      version: data.version,
      count: data.count,
      results: []
    };
  }

  const results = [];
  for (const entry of data.entries) {
    const score = scoreEntry(entry, q, normalizedQuery);
    if (score > 0) results.push({ entry, score });
  }

  results.sort((a, b) => b.score - a.score || a.entry.code.localeCompare(b.entry.code));
  return {
    version: data.version,
    count: data.count,
    results: results.slice(0, Number(limit) || 12).map(({ entry }) => entry)
  };
}

function getIcd11ByCode(code) {
  const data = loadIcd11();
  return data.byCode.get(String(code || "").trim().toUpperCase()) || null;
}

function getIcd11Meta() {
  const data = loadIcd11();
  return {
    source: data.source,
    version: data.version,
    browser: data.browser,
    downloadedFrom: data.downloadedFrom,
    count: data.count
  };
}

module.exports = {
  getIcd11ByCode,
  getIcd11Meta,
  searchIcd11
};
