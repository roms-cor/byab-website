#!/bin/bash
set -e

REPO="roms-cor/byab-website"
BRANCH="main"
WORKSPACE="$(cd "$(dirname "$0")/.." && pwd)"
TMPDIR=$(mktemp -d)

trap 'rm -rf "$TMPDIR"' EXIT

if [ -z "$GITHUB_PAT" ]; then
  echo "⚠ GITHUB_PAT not set — skipping push to GitHub"
  exit 0
fi

VERSION=$(node -e "console.log(require('${WORKSPACE}/package.json').version)")
DATE=$(date -u +"%Y-%m-%d %H:%M UTC")

echo "→ Cloning $REPO..."
GIT_ASKPASS="$TMPDIR/askpass.sh"
printf '#!/bin/sh\necho "$GITHUB_PAT"\n' > "$GIT_ASKPASS"
chmod +x "$GIT_ASKPASS"

GIT_ASKPASS="$GIT_ASKPASS" git clone --depth 1 "https://x-access-token@github.com/${REPO}.git" "$TMPDIR/repo" 2>/dev/null

echo "→ Syncing workspace..."
cd "$TMPDIR/repo"
git config user.email "agent@replit.com"
git config user.name "Replit Publish"

find . -maxdepth 1 -not -name '.git' -not -name '.' -exec rm -rf {} +

for item in .github .gitignore .replit CNAME attached_assets client server shared script components.json drizzle.config.ts package.json package-lock.json postcss.config.js replit.md tailwind.config.ts tsconfig.json vite.config.ts generated-icon.png; do
  [ -e "${WORKSPACE}/$item" ] && cp -r "${WORKSPACE}/$item" .
done

git add -A

if git diff --cached --quiet; then
  echo "✓ No changes to push"
else
  git commit -m "Publish v${VERSION} — ${DATE}"
  GIT_ASKPASS="$GIT_ASKPASS" git push origin "$BRANCH"
  echo "✓ Pushed v${VERSION} to GitHub"
fi
