#!/usr/bin/env bash
# Publica los cambios del HQ en el repositorio del equipo: GuateGeeks/trabajo.
# Uso: scripts/publicar.sh "mensaje del commit"   (el mensaje es opcional)
# Solo envía a ese repositorio; si «origin» apunta a otro lado, se detiene.
set -euo pipefail
cd "$(dirname "$0")/.."

DESTINO="GuateGeeks/trabajo"
URL="$(git remote get-url origin)"
case "$URL" in
  *"$DESTINO"*) ;;
  *) echo "origin no apunta a $DESTINO ($URL). Me detengo."; exit 1 ;;
esac

MENSAJE="${1:-docs(vault): actualizar mejoras y tareas $(date +%Y-%m-%d)}"

git add -A
if git diff --cached --quiet; then
  echo "Sin cambios nuevos que publicar."
else
  git commit -q -m "$MENSAJE" -m "Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>"
fi

GIT_TERMINAL_PROMPT=0 git pull --rebase -q origin main || true
GIT_TERMINAL_PROMPT=0 git push origin main
echo "Publicado en https://github.com/$DESTINO"
