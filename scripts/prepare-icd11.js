const fs = require("fs");
const http = require("http");
const https = require("https");
const path = require("path");
const zlib = require("zlib");

const ROOT = path.resolve(__dirname, "..");
const DATA_DIR = path.join(ROOT, "data");
const RAW_ZIP_PATH = path.join(DATA_DIR, "raw", "SimpleTabulation-ICD-11-MMS-es.zip");
const OUTPUT_PATH = path.join(DATA_DIR, "icd11-es-2026.json.gz");
const SOURCE_URL = "https://icdcdn.who.int/static/releasefiles/2026-01/SimpleTabulation-ICD-11-MMS-es.zip";
const RELEASE_VERSION = "2026-01";

function download(url, redirects = 5) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith("https:") ? https : http;
    const req = client.get(
      url,
      {
        headers: {
          "User-Agent": "Laboratorio-Intervencion-Psicosocial/1.0"
        }
      },
      (res) => {
        const location = res.headers.location;
        if (res.statusCode >= 300 && res.statusCode < 400 && location && redirects > 0) {
          res.resume();
          const nextUrl = new URL(location, url).toString();
          download(nextUrl, redirects - 1).then(resolve, reject);
          return;
        }
        if (res.statusCode !== 200) {
          res.resume();
          reject(new Error(`No se pudo descargar CIE-11 (${res.statusCode})`));
          return;
        }
        const chunks = [];
        res.on("data", (chunk) => chunks.push(chunk));
        res.on("end", () => resolve(Buffer.concat(chunks)));
      }
    );
    req.on("error", reject);
    req.setTimeout(90000, () => {
      req.destroy(new Error("Tiempo agotado descargando CIE-11"));
    });
  });
}

function readUInt16(buffer, offset) {
  return buffer.readUInt16LE(offset);
}

function readUInt32(buffer, offset) {
  return buffer.readUInt32LE(offset);
}

function findCentralDirectory(buffer) {
  for (let offset = buffer.length - 22; offset >= 0; offset -= 1) {
    if (readUInt32(buffer, offset) === 0x06054b50) {
      return {
        entries: readUInt16(buffer, offset + 10),
        centralOffset: readUInt32(buffer, offset + 16)
      };
    }
  }
  throw new Error("ZIP CIE-11 no valido");
}

function extractZipEntry(buffer, pattern) {
  const directory = findCentralDirectory(buffer);
  let cursor = directory.centralOffset;

  for (let index = 0; index < directory.entries; index += 1) {
    if (readUInt32(buffer, cursor) !== 0x02014b50) {
      throw new Error("Directorio ZIP CIE-11 no valido");
    }

    const method = readUInt16(buffer, cursor + 10);
    const compressedSize = readUInt32(buffer, cursor + 20);
    const fileNameLength = readUInt16(buffer, cursor + 28);
    const extraLength = readUInt16(buffer, cursor + 30);
    const commentLength = readUInt16(buffer, cursor + 32);
    const localOffset = readUInt32(buffer, cursor + 42);
    const fileName = buffer.toString("utf8", cursor + 46, cursor + 46 + fileNameLength);

    if (pattern.test(fileName)) {
      const localNameLength = readUInt16(buffer, localOffset + 26);
      const localExtraLength = readUInt16(buffer, localOffset + 28);
      const dataStart = localOffset + 30 + localNameLength + localExtraLength;
      const compressed = buffer.subarray(dataStart, dataStart + compressedSize);

      if (method === 0) return compressed;
      if (method === 8) return zlib.inflateRawSync(compressed);
      throw new Error(`Metodo ZIP no soportado para ${fileName}: ${method}`);
    }

    cursor += 46 + fileNameLength + extraLength + commentLength;
  }

  throw new Error("No se encontro el TXT CIE-11 dentro del ZIP");
}

function parseTsvLine(line) {
  const cells = [];
  let value = "";
  let quoted = false;

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    const next = line[index + 1];
    if (char === '"' && quoted && next === '"') {
      value += '"';
      index += 1;
    } else if (char === '"') {
      quoted = !quoted;
    } else if (char === "\t" && !quoted) {
      cells.push(value);
      value = "";
    } else {
      value += char;
    }
  }

  cells.push(value);
  return cells;
}

function cleanTitle(value) {
  return String(value || "")
    .replace(/^(?:-\s*)+/, "")
    .replace(/\s+/g, " ")
    .trim();
}

function normalize(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function extractBrowserLink(value) {
  const match = String(value || "").match(/https:\/\/icd\.who\.int\/browse\/[^"()]+#[0-9A-Za-z.-]+/);
  if (!match) return "";
  return match[0].replace("latestrelease/mms/en", "2026-01/mms/es");
}

function buildIndex(tsv) {
  const lines = tsv.replace(/^\uFEFF/, "").split(/\r?\n/).filter(Boolean);
  const headers = parseTsvLine(lines.shift());
  const column = (name) => headers.indexOf(name);
  const columns = {
    code: column("Code"),
    title: column("Title"),
    titleEn: column("TitleEN"),
    chapterNo: column("ChapterNo"),
    kind: column("ClassKind"),
    browserLink: column("BrowserLink")
  };

  const rows = lines.map(parseTsvLine);
  const chapters = new Map();
  for (const row of rows) {
    if (row[columns.kind] === "chapter") {
      chapters.set(row[columns.chapterNo], cleanTitle(row[columns.title]));
    }
  }

  const entries = rows
    .filter((row) => row[columns.code] && row[columns.title])
    .map((row) => {
      const entry = {
        c: row[columns.code],
        t: cleanTitle(row[columns.title]),
        e: cleanTitle(row[columns.titleEn]),
        ch: chapters.get(row[columns.chapterNo]) || "",
        l: extractBrowserLink(row[columns.browserLink])
      };
      entry.s = normalize(`${entry.c} ${entry.t} ${entry.e} ${entry.ch}`);
      return entry;
    });

  return {
    version: RELEASE_VERSION,
    source: "WHO ICD-11 MMS Simple Tabulation Spanish",
    browser: "https://icd.who.int/browse/2026-01/mms/es",
    downloadedFrom: SOURCE_URL,
    count: entries.length,
    entries
  };
}

async function main() {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  const zipBuffer = fs.existsSync(RAW_ZIP_PATH)
    ? fs.readFileSync(RAW_ZIP_PATH)
    : await download(SOURCE_URL);
  const tsvBuffer = extractZipEntry(zipBuffer, /SimpleTabulation-ICD-11-MMS-es\.txt$/);
  const index = buildIndex(tsvBuffer.toString("utf8"));
  fs.writeFileSync(OUTPUT_PATH, zlib.gzipSync(Buffer.from(JSON.stringify(index)), { level: 9 }));
  console.log(`CIE-11 ${index.version}: ${index.count.toLocaleString("es-ES")} entradas generadas en ${OUTPUT_PATH}`);
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
