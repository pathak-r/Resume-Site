#!/bin/bash
# Resolve the workspace root regardless of where this script is invoked from.
WORKSPACE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "Workspace: $WORKSPACE_DIR"

echo "Starting Geo RAG FastAPI backend on port 8000..."
cd "$WORKSPACE_DIR/geo_rag" && python -m uvicorn backend.main:app --host 0.0.0.0 --port 8000 &
FASTAPI_PID=$!

# Give FastAPI time to load the FAISS index and production data before serving traffic
sleep 5

echo "Starting Express server on port 5000..."
cd "$WORKSPACE_DIR" && NODE_ENV=production node dist/index.cjs &
NODE_PID=$!

# Forward signals so both processes shut down cleanly
trap "kill $FASTAPI_PID $NODE_PID 2>/dev/null; exit 0" SIGTERM SIGINT

# Exit as soon as either process dies
wait -n $FASTAPI_PID $NODE_PID
EXIT_CODE=$?

kill $FASTAPI_PID $NODE_PID 2>/dev/null
exit $EXIT_CODE
