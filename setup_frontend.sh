echo "Setting up the frontend environment..."
cd frontend
echo "Installing frontend dependencies..."
npm install
echo "Starting frontend."
nohup npm run dev > frontend.log 2>&1 &