import { Request, Response } from 'express';
import { TestService } from '../services/testService';
import { RunTestRequest, RunTestResponse, GetResultsResponse } from '../types/testResult';

export class TestController {
  private testService: TestService;

  constructor() {
    this.testService = TestService.getInstance();
  }

  /**
   * POST /run-tests - Execute a test script
   */
  runTest = async (req: Request, res: Response): Promise<void> => {
    try {
      const { testName, scriptType }: RunTestRequest = req.body;

      if (!testName) {
        res.status(400).json({
          success: false,
          error: 'Test name is required'
        } as RunTestResponse);
        return;
      }

      console.log(`Executing test: ${testName}`);
      const result = await this.testService.runTest(testName);

      const response: RunTestResponse = {
        success: true,
        result
      };

      res.status(200).json(response);
    } catch (error) {
      console.error('Error running test:', error);
      
      const response: RunTestResponse = {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };

      res.status(500).json(response);
    }
  };

  /**
   * GET /results - Get all test results
   */
  getResults = async (req: Request, res: Response): Promise<void> => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      const offset = req.query.offset ? parseInt(req.query.offset as string) : undefined;

      const { results, total } = await this.testService.getResults(limit, offset);

      const response: GetResultsResponse = {
        success: true,
        results,
        total
      };

      res.status(200).json(response);
    } catch (error) {
      console.error('Error getting results:', error);
      
      const response: GetResultsResponse = {
        success: false,
        results: [],
        total: 0
      };

      res.status(500).json(response);
    }
  };

  /**
   * GET /results/:id - Get a specific test result by ID
   */
  getResultById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const result = await this.testService.getResultById(id);

      if (!result) {
        res.status(404).json({
          success: false,
          error: 'Test result not found'
        });
        return;
      }

      res.status(200).json({
        success: true,
        result
      });
    } catch (error) {
      console.error('Error getting result by ID:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      });
    }
  };

  /**
   * GET /tests - Get available test files
   */
  getAvailableTests = async (req: Request, res: Response): Promise<void> => {
    try {
      const tests = await this.testService.getAvailableTests();

      res.status(200).json({
        success: true,
        tests
      });
    } catch (error) {
      console.error('Error getting available tests:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        tests: []
      });
    }
  };

  /**
   * DELETE /results - Clear all test results
   */
  clearResults = async (req: Request, res: Response): Promise<void> => {
    try {
      await this.testService.clearResults();

      res.status(200).json({
        success: true,
        message: 'All test results cleared'
      });
    } catch (error) {
      console.error('Error clearing results:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      });
    }
  };

  /**
   * GET /results/test/:testName - Get results for a specific test
   */
  getResultsByTestName = async (req: Request, res: Response): Promise<void> => {
    try {
      const { testName } = req.params;
      const results = await this.testService.getResultsByTestName(testName);

      res.status(200).json({
        success: true,
        results,
        total: results.length
      });
    } catch (error) {
      console.error('Error getting results by test name:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        results: [],
        total: 0
      });
    }
  };
} 