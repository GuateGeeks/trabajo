#!/bin/bash
# Programa (o quita) la sincronización diaria del HQ a las 8:00 con launchd de macOS.
#   ./scripts/programar-sync.sh instalar
#   ./scripts/programar-sync.sh quitar
#   ./scripts/programar-sync.sh estado
set -euo pipefail

LABEL="com.guategeeks.hq-sync"
PLIST="$HOME/Library/LaunchAgents/$LABEL.plist"
LOG="$HOME/Library/Logs/guategeeks-hq-sync.log"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
NODE="$(command -v node)"
DOMAIN="gui/$(id -u)"

case "${1:-estado}" in
  instalar)
    [ -n "$NODE" ] || { echo "No encuentro node en el PATH."; exit 1; }
    mkdir -p "$HOME/Library/LaunchAgents" "$HOME/Library/Logs"
    cat > "$PLIST" <<EOF
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>Label</key><string>$LABEL</string>
  <key>ProgramArguments</key>
  <array>
    <string>$NODE</string>
    <string>$ROOT/scripts/sync.mjs</string>
  </array>
  <key>WorkingDirectory</key><string>$ROOT</string>
  <key>EnvironmentVariables</key>
  <dict><key>PATH</key><string>/usr/local/bin:/opt/homebrew/bin:/usr/bin:/bin</string></dict>
  <key>StartCalendarInterval</key>
  <dict><key>Hour</key><integer>8</integer><key>Minute</key><integer>0</integer></dict>
  <key>StandardOutPath</key><string>$LOG</string>
  <key>StandardErrorPath</key><string>$LOG</string>
</dict>
</plist>
EOF
    launchctl bootout "$DOMAIN/$LABEL" 2>/dev/null || true
    launchctl bootstrap "$DOMAIN" "$PLIST"
    echo "Programado: todos los días a las 8:00 (si la Mac está dormida, corre al despertar)."
    echo "Registro: $LOG"
    ;;
  quitar)
    launchctl bootout "$DOMAIN/$LABEL" 2>/dev/null || true
    rm -f "$PLIST"
    echo "Sincronización diaria quitada."
    ;;
  estado)
    if launchctl print "$DOMAIN/$LABEL" >/dev/null 2>&1; then
      echo "Programada (8:00 diario)."; launchctl print "$DOMAIN/$LABEL" | grep -E "state|last exit code|runs" || true
    else
      echo "No está programada."
    fi
    ;;
  *) echo "Uso: $0 instalar|quitar|estado"; exit 1 ;;
esac
