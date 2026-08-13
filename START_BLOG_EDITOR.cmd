@echo off
title JasperLou Blog Editor
echo Starting TinaCMS visual editor...
start "TinaCMS server" wsl bash -lc "source /home/lrjerry/.nvm/nvm.sh && cd /mnt/a/my-tech-blog && npm run dev"
echo Waiting for the local editor to become ready...
powershell -NoProfile -Command "$deadline=(Get-Date).AddSeconds(90); do { try { $r=Invoke-WebRequest -UseBasicParsing -Uri 'http://localhost:4321/admin/index.html' -TimeoutSec 2; if ($r.StatusCode -eq 200) { exit 0 } } catch {}; Start-Sleep -Seconds 2 } while ((Get-Date) -lt $deadline); exit 1"
if errorlevel 1 (
  echo The editor did not start within 90 seconds. Check the TinaCMS server window.
  pause
  exit /b 1
)
start "" "http://localhost:4321/admin/index.html#/~/"
echo.
echo The editor should open in your browser.
echo Keep the TinaCMS server window open while editing.
pause
