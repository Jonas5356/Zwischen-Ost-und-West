@echo off
setlocal
chcp 65001 >nul
cd /d "%~dp0"
title Zwischen Ost und West bauen

echo.
echo === Zwischen Ost und West: Installer bauen ===
echo.

where cargo >nul 2>nul
if errorlevel 1 (
  echo Rust fehlt. Bitte einmalig installieren:
  echo   1. https://rustup.rs oeffnen und rustup-init.exe herunterladen
  echo   2. ausfuehren und die vorgeschlagene Standardinstallation waehlen
  echo   3. dieses Fenster schliessen und das Skript erneut starten
  goto ende
)
where npm >nul 2>nul
if errorlevel 1 (
  echo Node.js fehlt. Bitte die LTS-Version von https://nodejs.org installieren
  echo und das Skript danach erneut starten.
  goto ende
)

if not exist "node_modules\@tauri-apps\cli" (
  echo [1/2] Werkzeuge werden einmalig eingerichtet ...
  call npm ci
  if errorlevel 1 goto fehler
) else (
  echo [1/2] Werkzeuge sind vorhanden.
)

echo [2/2] Programm wird gebaut. Beim ersten Mal dauert das 5-15 Minuten ...
call npx tauri build
if errorlevel 1 goto fehler

echo.
echo Fertig. Der Installer liegt in dem Ordner, der sich gerade geoeffnet hat.
start "" "%~dp0src-tauri\target\release\bundle\nsis"
goto ende

:fehler
echo.
echo *** Der Bau ist fehlgeschlagen. Siehe die Meldungen oben. ***

:ende
echo.
pause
