#!/bin/bash
set -e

# Target repository — override by setting the GITHUB_REPO environment variable
# in Replit Secrets (e.g. "your-org/your-repo").
REPO="${GITHUB_REPO:-roms-cor/byab-website}"
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

GITHUB_VERSION=$(node -e "console.log(require('./package.json').version)" 2>/dev/null || echo "")
LOCAL_VERSION=$(node -e "console.log(require('${WORKSPACE}/package.json').version)" 2>/dev/null || echo "")
if [ -n "$GITHUB_VERSION" ] && [ "$GITHUB_VERSION" != "$LOCAL_VERSION" ]; then
  echo "⚠ Version drift detected: Replit=${LOCAL_VERSION}, GitHub=${GITHUB_VERSION}"
  echo "→ Using GitHub version ${GITHUB_VERSION}"
  cp package.json "$TMPDIR/github-package.json"
fi

git config user.email "agent@replit.com"
git config user.name "Replit Publish"

find . -maxdepth 1 -not -name '.git' -not -name '.' -exec rm -rf {} +

# Publish every git-tracked file except explicit private/local exclusions.
# New build inputs are picked up automatically as soon as they are committed —
# no allowlist to maintain. Add a pattern below only to keep something private.
EXCLUDES='^(\.agents/|\.local/|dist/|artifacts/|screenshots/)'
git -C "$WORKSPACE" ls-files -z \
  | grep -zEv "$EXCLUDES" \
  | tar -C "$WORKSPACE" --null -T - -cf - \
  | tar -xf -

if [ -f "$TMPDIR/github-package.json" ]; then
  cp "$TMPDIR/github-package.json" package.json
  VERSION=$(node -e "console.log(require('./package.json').version)")
fi

# Replit's package firewall rewrites lockfile "resolved" URLs to an internal
# proxy that GitHub Actions runners cannot reach (npm ci fails with EAI_AGAIN).
# Normalize them back to the public registry before publishing.
if [ -f package-lock.json ]; then
  sed -i 's|http://package-firewall.replit.local/npm/|https://registry.npmjs.org/|g' package-lock.json
fi

git add -A

if git diff --cached --quiet; then
  echo "✓ No changes to push"
else
  git commit -m "chore(publish): v${VERSION} — ${DATE}"
  GIT_ASKPASS="$GIT_ASKPASS" git push origin "$BRANCH"
  echo "✓ Pushed v${VERSION} to GitHub"
fi
