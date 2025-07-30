import * as fs from 'fs';
import * as path from 'path';
import { TestResult } from '../types/testResult';

const RESULTS_FILE_PATH = process.env.RESULTS_FILE_PATH || './results.json';
const TESTS_DIRECTORY = './tests';

export class FileUtils {
  /**
   * Save test results to JSON file
   */
  static async saveResults(results: TestResult[]): Promise<void> {
    try {
      const data = JSON.stringify(results, null, 2);
      await fs.promises.writeFile(RESULTS_FILE_PATH, data, 'utf8');
    } catch (error) {
      console.error('Error saving results:', error);
      throw new Error('Failed to save test results');
    }
  }

  /**
   * Load test results from JSON file
   */
  static async loadResults(): Promise<TestResult[]> {
    try {
      if (!fs.existsSync(RESULTS_FILE_PATH)) {
        return [];
      }
      
      const data = await fs.promises.readFile(RESULTS_FILE_PATH, 'utf8');
      const results = JSON.parse(data);
      
      // Convert timestamp strings back to Date objects
      return results.map((result: any) => ({
        ...result,
        timestamp: new Date(result.timestamp)
      }));
    } catch (error) {
      console.error('Error loading results:', error);
      return [];
    }
  }

  /**
   * Get all test files from the tests directory
   */
  static async getTestFiles(): Promise<string[]> {
    try {
      if (!fs.existsSync(TESTS_DIRECTORY)) {
        await fs.promises.mkdir(TESTS_DIRECTORY, { recursive: true });
        return [];
      }

      const files = await fs.promises.readdir(TESTS_DIRECTORY);
      return files.filter(file => 
        file.endsWith('.py') || 
        file.endsWith('.sh') || 
        file.endsWith('.bash')
      );
    } catch (error) {
      console.error('Error reading test files:', error);
      throw new Error('Failed to read test files');
    }
  }

  /**
   * Check if a test file exists
   */
  static async testFileExists(fileName: string): Promise<boolean> {
    const filePath = path.join(TESTS_DIRECTORY, fileName);
    try {
      await fs.promises.access(filePath);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get the full path to a test file
   */
  static getTestFilePath(fileName: string): string {
    return path.join(TESTS_DIRECTORY, fileName);
  }

  /**
   * Truncate output if it's too long
   */
  static truncateOutput(output: string, maxLength: number = 1000): string {
    if (output.length <= maxLength) {
      return output;
    }
    return output.substring(0, maxLength) + '... (truncated)';
  }

  /**
   * Ensure tests directory exists
   */
  static async ensureTestsDirectory(): Promise<void> {
    if (!fs.existsSync(TESTS_DIRECTORY)) {
      await fs.promises.mkdir(TESTS_DIRECTORY, { recursive: true });
    }
  }
} 