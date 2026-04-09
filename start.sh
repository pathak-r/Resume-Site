#!/bin/bash
# Start FastAPI backend in the background, then the Node.js frontend server.
echo "Starting Geo RAG FastAPI backend on port 8000..."
cd geo_rag && python -m uvicorn backend.main:app --host 0.0.0.0 --port 8000 &
FASTAPI_PID=$!
cd ..

# Give FastAPI a moment to start loading data before the Node server starts handling traffic
sleep 5

echo "Starting Express server on port 5000..."
NODE_ENV=production node dist/index.cjs &
NODE_PID=$!

# Forward signals so both processes shut down cleanly
trap "kill $FASTAPI_PID $NODE_PID 2>/dev/null; exit 0" SIGTERM SIGINT

# Wait for either process to exit
wait -n $FASTAPI_PID $NODE_PID
EXIT_CODE=$?

# If one died, kill the other
kill $FASTAPI_PID $NODE_PID 2>/dev/null
exit $EXIT_CODE
