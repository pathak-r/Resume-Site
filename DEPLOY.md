# Deploy: Resume Site on Railway

**GitHub:** https://github.com/pathak-r/Resume-Site

**Railway project:** [resume-portfolio](https://railway.com/project/ba6ad2a5-6b41-41d9-a3ca-a899f4b76364)

| Service | URL |
|---------|-----|
| resume-site | https://resume-site-production-3313.up.railway.app |
| geo-rag | https://geo-rag-production.up.railway.app |

**Helper scripts:** `./scripts/railway-setup.sh` (dashboard checklist), `./scripts/smoke-test.sh` (post-deploy curls).

This repo runs as **two Railway services** from one GitHub repository.

| Service | Root directory | Build | Start |
|---------|----------------|-------|-------|
| **resume-site** | `/` (repo root) | `npm run build` | `npm run start` |
| **geo-rag** | `geo_rag/` | Nixpacks (see `geo_rag/railway.toml`) | `uvicorn backend.main:app --host 0.0.0.0 --port $PORT` |

The Node app proxies Geo RAG at `/api/geo/*` using `GEO_RAG_API_URL`. Browsers only hit the resume-site URL.

## Railway setup

1. [railway.app](https://railway.app) → **New Project** → **Deploy from GitHub** → this repo.
2. Add a second service; set **Root Directory** to `geo_rag` for Geo RAG.
3. Deploy **geo-rag first**, then **resume-site**.

### geo-rag variables

| Variable | Required |
|----------|----------|
| `OPENAI_API_KEY` | Yes |
| `LLAMA_CLOUD_API_KEY` | Only if running PDF ingest in prod |
| `CORS_ORIGINS` | Comma-separated origins, e.g. `https://yourdomain.com,https://www.yourdomain.com,https://<resume-site>.up.railway.app` |

### resume-site variables

| Variable | Required |
|----------|----------|
| `NODE_ENV` | `production` |
| `GEO_RAG_API_URL` | `https://<geo-rag-service>.up.railway.app` (no trailing slash) |
| `PUBLIC_URL` | Optional; your public site URL for Open Graph images at build time |

`PORT` is set automatically by Railway.

**Tip:** Use Railway [service variable references](https://docs.railway.com/guides/variables#referencing-another-services-variables) for `GEO_RAG_API_URL` if you link services in one project.

## Custom domain

Attach the domain only to **resume-site** (Settings → Networking → Custom Domain). Point DNS per Railway’s instructions. Update `CORS_ORIGINS` on geo-rag to include your domain.

## Local development

```bash
# Terminal 1 — main app (port 5000)
npm install
npm run dev

# Terminal 2 — Geo RAG API (port 8000)
cd geo_rag
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env   # add OPENAI_API_KEY
uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000
```

Open http://localhost:5000 (Geo demo: `/geo-agentic-int`).

## Smoke tests (after deploy)

| Check | URL |
|-------|-----|
| Home | `https://<resume-site>/` |
| Geo demo | `https://<resume-site>/geo-agentic-int` |
| Geo health (direct) | `https://<geo-rag>/api/health` → `ok: true` |
| Proxied health | `https://<resume-site>/api/geo/health` → `ok: true` |
| Chat | Send a message on Geo page |
| Charts | Change well/date filters |

If proxied health fails but direct Geo health works, fix `GEO_RAG_API_URL`. If direct health is `ok: false`, check that `geo_rag/data/` is present in the deployment image.

## Cutover from Replit

1. Verify Railway URLs before changing DNS.
2. Point your domain to resume-site on Railway.
3. Stop the Replit published deployment.
4. Remove or stop the old `geo-rag-backend-production` Railway service if you replaced it with a new geo-rag service from this repo.

## Ongoing

- Push to `main` → auto-deploy (when GitHub is connected).
- API keys only in Railway Variables, never in git.
- FAISS/PDF updates: commit `geo_rag/data/` or run `python ingest.py` in a Railway shell, then redeploy geo-rag.
