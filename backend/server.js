const http = require("http");
const fs = require("fs");
const path = require("path");
const { analyzeCase, pilots, unirSources } = require("./engine");
const { generateStructuredReport } = require("./case-inference");
const { socialResources } = require("./social-resources");
const { getIcd11ByCode, getIcd11Meta, searchIcd11 } = require("./icd11");

const PORT = Number(process.env.PORT || 4173);
const ROOT = path.resolve(__dirname, "..");
const PUBLIC_DIR = path.join(ROOT, "frontend");

const contentTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon"
};

function sendJson(res, status, payload) {
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(payload, null, 2));
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
      if (body.length > 1_000_000) {
        reject(new Error("Payload demasiado grande"));
        req.destroy();
      }
    });
    req.on("end", () => resolve(body));
    req.on("error", reject);
  });
}

function serveStatic(req, res) {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const requested = url.pathname === "/" ? "/index.html" : decodeURIComponent(url.pathname);
  const filePath = path.normalize(path.join(PUBLIC_DIR, requested));

  if (!filePath.startsWith(PUBLIC_DIR)) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }

  fs.readFile(filePath, (error, data) => {
    if (error) {
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("No encontrado");
      return;
    }
    const ext = path.extname(filePath);
    res.writeHead(200, {
      "Content-Type": contentTypes[ext] || "application/octet-stream",
      "Cache-Control": "no-store"
    });
    res.end(data);
  });
}

const server = http.createServer(async (req, res) => {
  try {
    if (req.method === "GET" && req.url === "/health") {
      sendJson(res, 200, { ok: true, service: "cie11-socioeducativo-unir" });
      return;
    }

    if (req.method === "GET" && req.url === "/api/knowledge") {
      sendJson(res, 200, { pilots, unirSources, resources: socialResources, icd11: getIcd11Meta() });
      return;
    }

    if (req.method === "GET" && req.url.startsWith("/api/icd11/search")) {
      const url = new URL(req.url, `http://${req.headers.host}`);
      sendJson(res, 200, searchIcd11(url.searchParams.get("q"), url.searchParams.get("limit") || 12));
      return;
    }

    if (req.method === "GET" && req.url.startsWith("/api/icd11/code/")) {
      const code = decodeURIComponent(req.url.replace("/api/icd11/code/", ""));
      sendJson(res, 200, { result: getIcd11ByCode(code) });
      return;
    }

    if (req.method === "POST" && req.url === "/api/analyze") {
      const body = await readBody(req);
      const payload = body ? JSON.parse(body) : {};
      sendJson(res, 200, analyzeCase(payload));
      return;
    }

    if (req.method === "POST" && req.url === "/api/report") {
      const body = await readBody(req);
      const payload = body ? JSON.parse(body) : {};
      sendJson(res, 200, generateStructuredReport(payload));
      return;
    }

    if (req.method === "GET") {
      serveStatic(req, res);
      return;
    }

    sendJson(res, 405, { error: "Metodo no permitido" });
  } catch (error) {
    sendJson(res, 500, { error: error.message || "Error interno" });
  }
});

server.listen(PORT, () => {
  console.log(`Laboratorio de Intervencion Psicosocial disponible en http://localhost:${PORT}`);
});

module.exports = server;
