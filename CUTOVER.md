# Cutover checklist (Replit → Railway)

Complete these after both Railway services deploy and smoke tests pass.

## Custom domain (resume-site only)

From the repo root (after `railway login`):

```bash
railway domain YOUR_DOMAIN.com --service resume-site
# Follow the printed DNS records at your registrar
```

Or in the dashboard: Railway → **resume-site** → Settings → Networking → **Custom Domain**.

1. Railway → **resume-site** → Settings → Networking → **Custom Domain**.
2. Add apex and/or `www` per your registrar.
3. DNS (example — use the exact records Railway shows):
   - `www` → CNAME to Railway hostname
   - apex → A/ALIAS per provider (Cloudflare, etc.)
4. Wait for TLS (usually minutes).
5. On **geo-rag**, set `CORS_ORIGINS` to include:
   - `https://YOUR_DOMAIN`
   - `https://www.YOUR_DOMAIN` (if used)
   - `https://<resume-site>.up.railway.app` (keep during transition)
6. On **resume-site**, set `PUBLIC_URL=https://YOUR_DOMAIN` and redeploy for Open Graph images.

## Replit retirement

1. Confirm https://YOUR_DOMAIN (or Railway URL) serves home + `/geo-agentic-int`.
2. Replit → stop **Published** deployment or archive the Repl.
3. Railway → delete the old **geo-rag-api** project (`geo-rag-backend-production`) if fully replaced by **geo-rag** in resume-portfolio:

   ```bash
   railway project delete --project geo-rag-api --yes
   ```
4. Update LinkedIn, resume links, and email signatures to the new URL.
5. Optional: remove `gitsafe-backup` remote if unused: `git remote remove gitsafe-backup`

## Smoke test command

```bash
RESUME_URL=https://your-resume.up.railway.app \
GEO_URL=https://your-geo.up.railway.app \
./scripts/smoke-test.sh
```
