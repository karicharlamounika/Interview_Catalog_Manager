echo "Cleaning up test results before running all tests..."
rm -rf backend/api_test_results
rm -rf frontend/test-results
rm -rf frontend/playwright-report

echo "Running API tests..."
echo "Switching to backend directory..."
cd backend
echo "Triggering API tests..."
npm run test:api

echo "API tests completed."
echo "Switching back to root directory..."
cd ..

echo "Running E2E tests..."
echo "Switching to frontend directory..."
cd frontend
echo "Installing Playwright..."
npx playwright install
echo "Triggering E2E tests..."
npm run test

echo "E2E tests completed."
echo "Switching back to root directory..."
cd ..