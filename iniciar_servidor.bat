@echo off
REM Servidor local para Reporte Médico Web
REM Ejecuta este archivo para iniciar un servidor web local

echo.
echo ╔════════════════════════════════════════════════════════╗
echo ║     SERVIDOR LOCAL - Reporte Médico Web               ║
echo ╚════════════════════════════════════════════════════════╝
echo.

REM Cambiar a la carpeta de la aplicación
cd /d "%~dp0"

echo Iniciando servidor Python en puerto 8000...
echo.
echo 🌐 Abre tu navegador en: http://localhost:8000
echo.
echo Presiona Ctrl+C para detener el servidor
echo.

REM Iniciar servidor Python
python -m http.server 8000

pause
