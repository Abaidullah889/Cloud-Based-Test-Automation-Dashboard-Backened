import { TestResult } from '../types/testResult';
import { TestExecutor } from '../utils/testExecutor';
import { FileUtils } from '../utils/fileUtils';

export class TestService {
  private static instance: TestService;
  private testResults: TestResult[] = [];
  private initialized = false;

  private constructor() {}

  static getInstance(): TestService {
    if (!TestService.instance) {
      TestService.instance = new TestService();
    }
    return TestService.instance;
  }

  /**
   * Initialize the service by loading existing results
   */
  async initialize(): Promise<void> {
    if (this.initialized) return;

    try {
      // Ensure tests directory exists
      await FileUtils.ensureTestsDirectory();
      
      // Load existing results from file
      this.testResults = await FileUtils.loadResults();
      this.initialized = true;
    } catch (error) {
      console.error('Failed to initialize TestService:', error);
      this.testResults = [];
      this.initialized = true;
    }
  }

  /**
   * Run a test and store the result
   */
  async runTest(testName: string): Promise<TestResult> {
    await this.initialize();

    const result = await TestExecutor.executeTest(testName);
    
    // Add to in-memory storage
    this.testResults.push(result);

    // Save to file
    try {
      await FileUtils.saveResults(this.testResults);
    } catch (error) {
      console.error('Failed to save test results:', error);
      // Continue even if saving fails
    }

    return result;
  }

  /**
   * Get all test results
   */
  async getAllResults(): Promise<TestResult[]> {
    await this.initialize();
    
    // Sort by timestamp, newest first
    return [...this.testResults].sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }

  /**
   * Get test results with pagination
   */
  async getResults(limit?: number, offset?: number): Promise<{ results: TestResult[]; total: number }> {
    await this.initialize();
    
    const sortedResults = await this.getAllResults();
    const total = sortedResults.length;

    if (limit !== undefined && offset !== undefined) {
      const results = sortedResults.slice(offset, offset + limit);
      return { results, total };
    }

    return { results: sortedResults, total };
  }

  /**
   * Get available test files
   */
  async getAvailableTests(): Promise<string[]> {
    return await FileUtils.getTestFiles();
  }

  /**
   * Clear all test results
   */
  async clearResults(): Promise<void> {
    this.testResults = [];
    await FileUtils.saveResults(this.testResults);
  }

  /**
   * Get result by ID
   */
  async getResultById(id: string): Promise<TestResult | undefined> {
    await this.initialize();
    return this.testResults.find(result => result.id === id);
  }

  /**
   * Get results for a specific test name
   */
  async getResultsByTestName(testName: string): Promise<TestResult[]> {
    await this.initialize();
    return this.testResults
      .filter(result => result.testName === testName)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }
} 