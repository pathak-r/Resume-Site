#!/usr/bin/env bash
# Run after: railway login
# Links this repo to a Railway project and prints next dashboard steps.
set -euo pipefail

cd "$(dirname "$0")/.."

if ! railway whoami &>/dev/null; then
  echo "Run: railway login"
  exit 1
fi

echo "=== Railway setup (GitHub-connected project recommended) ==="
echo ""
echo "Project: resume-portfolio (https://railway.com/project/ba6ad2a5-6b41-41d9-a3ca-a899f4b76364)"
echo "For GitHub auto-deploy: connect pathak-r/Resume-Site in Railway (install GitHub app for private repos)."
echo "2. Service A (geo-rag): Settings → Root Directory = geo_rag"
echo "    Variables: OPENAI_API_KEY (required), CORS_ORIGINS (after resume URL known)"
echo "3. Service B (resume-site): Root Directory = / (repo root)"
echo "    Variables: NODE_ENV=production, GEO_RAG_API_URL=https://<geo-rag-host>"
echo "4. Optional: PUBLIC_URL=https://your-custom-domain.com on resume-site"
echo ""
echo "Or use CLI after linking one service:"
echo "  railway link"
echo "  railway up --detach   # from repo root for resume-site"
echo "  cd geo_rag && railway up --detach"
echo ""
echo "Smoke test after deploy:"
echo "  RESUME_URL=https://... GEO_URL=https://... ./scripts/smoke-test.sh"
