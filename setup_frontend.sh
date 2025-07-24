echo "Setting up the frontend environment..."
cd frontend
echo "Installing frontend dependencies..."
npm install
echo "Starting frontend."
nohup npm run start-frontend > frontend.log 2>&1 &

echo "Waiting for frontend to start..."
for i in {1..5}; do
  if curl --fail http://localhost:5173/login; then
    echo "Frontend is running!"
    exit 0
  else
    echo "Frontend not ready yet. Retrying in 2 seconds..."
    sleep 2
  fi
done
echo "Frontend did not start in time."
exit 1