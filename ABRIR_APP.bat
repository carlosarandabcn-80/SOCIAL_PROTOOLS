@echo off
setlocal
cd /d "%~dp0"

set "NODE=%USERPROFILE%\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe"

if exist "%NODE%" goto run

where node >nul 2>nul
if %ERRORLEVEL% EQU 0 (
  set "NODE=node"
  goto run
)

echo No se ha encontrado Node.js.
echo Abre Codex o instala Node.js y vuelve a intentarlo.
pause
exit /b 1

:run
echo Iniciando Laboratorio de Intervencion Psicosocial...
start "Laboratorio de Intervencion Psicosocial - servidor" "%NODE%" "%~dp0backend\server.js"
timeout /t 2 /nobreak >nul
start "" "http://localhost:4173/"
echo.
echo Si se abre una ventana negra del servidor, dejala abierta mientras uses la app.
echo Puedes cerrar esta ventana.
pause
