$ErrorActionPreference = "Stop"

$workspace = Split-Path -Parent $MyInvocation.MyCommand.Path
$bundledNode = Join-Path $env:USERPROFILE ".cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe"
$systemNode = Get-Command node -ErrorAction SilentlyContinue

if (Test-Path $bundledNode) {
  $node = $bundledNode
} elseif ($systemNode) {
  $node = $systemNode.Source
} else {
  Write-Host "No se ha encontrado Node.js. Instala Node o ejecuta desde el entorno de Codex." -ForegroundColor Red
  exit 1
}

Set-Location $workspace
Write-Host "Abriendo Laboratorio de Intervencion Psicosocial en http://localhost:4173" -ForegroundColor Cyan
Write-Host "Pulsa Ctrl+C para detener el servidor." -ForegroundColor DarkGray
& $node "backend/server.js"
