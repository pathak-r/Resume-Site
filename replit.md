# Rohit Pathak — Portfolio & Geo-Agentic RAG

## Project Overview
Personal portfolio website (React + Vite + Express) for Rohit Pathak, Senior PM in Enterprise AI. Features a full-screen "Lucid Flow" design system and embeds a geo-agentic RAG demo (`/geo-agentic-int`) powered by a Python FastAPI backend.

## Architecture
- **Frontend**: React + TypeScript + Vite (port 5000)
- **Geo RAG API**: Python FastAPI (local port 8000 for dev; Railway for prod)
- **Proxy**: Express forwards `/api/geo/*` → FastAPI

## Key Design System — Dark Catalog Theme
- **Page background**: `#141414`
- **Card/panel background**: `#1C1C1C` (with `0.5px solid rgba(242,239,232,0.15)` border + 12px radius)
- **Inner sub-card background**: `#252525`
- **Text primary**: `#F2EFE8` | secondary: `#A8A49B` | tertiary: `#7A7771`
- **Border**: `rgba(242,239,232,0.15)` | border-strong: `rgba(242,239,232,0.35)`
- **Accent (green)**: `#4CC9A0`
- **Coral CTA gradient**: `#a83028` → `#ff7668` (chat send btn, selected-work primary btn)
- Font: Inter / system-ui (navbar/hero inline) + Plus Jakarta Sans (headings)
- CSS tokens: `--cat-*` in `client/src/index.css` cascade to all sections automatically
- **Critical**: CSS variables (`var(--lf-*)`) do NOT work inside SVG/Recharts — always use hex strings

## RAG Backend (`geo_rag/`)
- **PDF parsing**: LlamaParse cloud API (markdown output)
- **Chunking**: SemanticChunker (langchain-experimental)
- **Embeddings**: OpenAI text-embedding-ada-002
- **Vector store**: FAISS (`data/faiss_index/index.faiss` + `store_data.json`)
- **Retrieval**: Three-layer stack — MultiQueryRetriever (gpt-4o-mini generates 3 query variants) → Hybrid BM25+FAISS per variant → Reciprocal Rank Fusion merge + dedup across all results
- **Rebuilt index**: 3,525 chunks from 94 Volve oil field PDFs (two-pass: semantic → hard 1500-char ceiling)
- **Ingest**: Run `cd geo_rag && python ingest.py` to rebuild (takes ~10 min via workflow)

## Environment Variables
- `OPENAI_API_KEY` — required by both portfolio backend and geo RAG
- `LLAMA_CLOUD_API_KEY` — required to run `ingest.py` (not needed for API serving)
- `RAILWAY_TOKEN` — Railway deploy trigger
- `GEO_RAG_API_URL` — prod Railway URL (set in Replit Secrets)

## Deployment
- **Portfolio**: Replit Autoscale (port 5000 only for production)
- **Geo RAG API**: Railway service (`ee7aec26-ce20-4ac9-8ae7-5710d8ee511d`)
  - Service ID: `2ba3cbaa-e77a-4e14-8275-99c828ca3100`
  - Environment: `e6d43600-04bd-4fc4-ad8e-48a3454a8271`

## Workflows
- `Start application`: `npm run dev` (portfolio + proxy)
- `Geo RAG API`: `cd geo_rag && uvicorn backend.main:app --host 0.0.0.0 --port 8000`

## Key Files
- `client/src/components/layout/navbar.tsx` — cross-page nav with `useLocation` + `scrollToSection`
- `geo_rag/src/pdf_ingest.py` — LlamaParse + SemanticChunker pipeline
- `geo_rag/src/config.py` — all env var access including LLAMA_CLOUD_API_KEY
- `geo_rag/requirements.txt` — pinned deps (langchain-experimental==0.4.1, llama-parse>=0.4.0)
- `geo_rag/ingest.py` — run to rebuild FAISS index
- `geo_rag/src/agent.py` — LangChain agent (uses ReAct pattern)
- `geo_rag/backend/main.py` — FastAPI app

## Deploying Backend to Railway
1. Push to GitHub via Replit UI (Replit's internal backup auto-syncs to Replit backup; use Replit Git panel to push to GitHub)
2. Railway auto-deploys on push to the connected GitHub repo
3. The FAISS index files are committed to git and deployed with the code
4. LLAMA_CLOUD_API_KEY is NOT needed on Railway (only for local index rebuilds)
