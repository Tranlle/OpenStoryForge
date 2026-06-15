#!/usr/bin/env sh
set -eu

ROOT_DIR=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
DESKTOP_DIR="$ROOT_DIR/web/desktop"

if [ ! -f "$DESKTOP_DIR/package.json" ]; then
  echo "Cannot find web/desktop/package.json." >&2
  exit 1
fi

cd "$DESKTOP_DIR"

if [ ! -d node_modules ]; then
  echo "Installing desktop dependencies..."
  npm install
fi

echo "Starting OpenStoryForge Electron frontend. Backend integration is disabled for now."
export OSF_BACKEND_DISABLED=1
export VITE_OPENSTORYFORGE_BACKEND_DISABLED=true
npm run dev:electron
