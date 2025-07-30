import { Router } from 'express';
import { TestController } from '../controllers/testController';

const router = Router();
const testController = new TestController();

// POST /run-tests - Execute a test script
router.post('/run-tests', testController.runTest);

// GET /results - Get all test results with optional pagination
router.get('/results', testController.getResults);

// GET /results/:id - Get a specific test result by ID
router.get('/results/:id', testController.getResultById);

// GET /results/test/:testName - Get results for a specific test
router.get('/results/test/:testName', testController.getResultsByTestName);

// GET /tests - Get available test files
router.get('/tests', testController.getAvailableTests);

// DELETE /results - Clear all test results
router.delete('/results', testController.clearResults);

export { router as testRoutes }; 