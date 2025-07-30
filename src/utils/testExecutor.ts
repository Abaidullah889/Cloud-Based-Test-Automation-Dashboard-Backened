import { spawn } from 'child_process';
import { v4 as uuidv4 } from 'uuid';
import { TestResult, TestStatus, ScriptType } from '../types/testResult';
import { FileUtils } from './fileUtils';

export class TestExecutor {
  /**
   * Execute a test script and return the result
   */
  static async executeTest(testName: string, scriptType?: ScriptType): Promise<TestResult> {
    const startTime = new Date();
    const testId = uuidv4();
    
    try {
      // Determine script type if not provided
      const detectedScriptType = scriptType || TestExecutor.detectScriptType(testName);
      
      // Check if test file exists
      const exists = await FileUtils.testFileExists(testName);
      if (!exists) {
        throw new Error(`Test file '${testName}' not found`);
      }

      const scriptPath = FileUtils.getTestFilePath(testName);
      const { command, args } = TestExecutor.getExecutionCommand(detectedScriptType, scriptPath);

      const result = await TestExecutor.runScript(command, args);
      const endTime = new Date();
      const duration = endTime.getTime() - startTime.getTime();

      // Determine test status based on output and exit code
      const status = TestExecutor.determineTestStatus(result.stdout, result.stderr, result.exitCode);

      return {
        id: testId,
        testName,
        status,
        timestamp: startTime,
        output: FileUtils.truncateOutput(result.stdout),
        errorOutput: result.stderr ? FileUtils.truncateOutput(result.stderr) : undefined,
        duration,
        scriptType: detectedScriptType
      };

    } catch (error) {
      const endTime = new Date();
      const duration = endTime.getTime() - startTime.getTime();

      return {
        id: testId,
        testName,
        status: TestStatus.ERROR,
        timestamp: startTime,
        output: '',
        errorOutput: error instanceof Error ? error.message : 'Unknown error occurred',
        duration,
        scriptType: scriptType || ScriptType.PYTHON
      };
    }
  }

  /**
   * Detect script type based on file extension
   */
  private static detectScriptType(fileName: string): ScriptType {
    if (fileName.endsWith('.py')) {
      return ScriptType.PYTHON;
    } else if (fileName.endsWith('.sh') || fileName.endsWith('.bash')) {
      return ScriptType.BASH;
    }
    return ScriptType.PYTHON; // default
  }

  /**
   * Get the execution command and arguments for a script type
   */
  private static getExecutionCommand(scriptType: ScriptType, scriptPath: string): { command: string; args: string[] } {
    switch (scriptType) {
      case ScriptType.PYTHON:
        return { command: 'python', args: [scriptPath] };
      case ScriptType.BASH:
      case ScriptType.SHELL:
        return { command: 'bash', args: [scriptPath] };
      default:
        return { command: 'python', args: [scriptPath] };
    }
  }

  /**
   * Run a script using child_process.spawn
   */
  private static runScript(command: string, args: string[]): Promise<{ stdout: string; stderr: string; exitCode: number }> {
    return new Promise((resolve, reject) => {
      const child = spawn(command, args, {
        stdio: ['pipe', 'pipe', 'pipe'],
        shell: true
      });

      let stdout = '';
      let stderr = '';

      child.stdout.on('data', (data) => {
        stdout += data.toString();
      });

      child.stderr.on('data', (data) => {
        stderr += data.toString();
      });

      child.on('close', (code) => {
        resolve({
          stdout: stdout.trim(),
          stderr: stderr.trim(),
          exitCode: code || 0
        });
      });

      child.on('error', (error) => {
        reject(new Error(`Failed to start process: ${error.message}`));
      });

      // Set a timeout for long-running tests (5 minutes)
      const timeout = setTimeout(() => {
        child.kill('SIGTERM');
        reject(new Error('Test execution timeout (5 minutes)'));
      }, 5 * 60 * 1000);

      child.on('close', () => {
        clearTimeout(timeout);
      });
    });
  }

  /**
   * Determine test status based on output and exit code
   */
  private static determineTestStatus(stdout: string, stderr: string, exitCode: number): TestStatus {
    // If exit code is not 0, it's likely a failure
    if (exitCode !== 0) {
      return TestStatus.FAIL;
    }

    // Check for explicit PASS/FAIL in output
    const output = stdout.toLowerCase();
    if (output.includes('pass') && !output.includes('fail')) {
      return TestStatus.PASS;
    }
    if (output.includes('fail')) {
      return TestStatus.FAIL;
    }

    // If stderr has content, consider it a failure
    if (stderr.trim().length > 0) {
      return TestStatus.FAIL;
    }

    // Default to PASS if exit code is 0 and no explicit indicators
    return TestStatus.PASS;
  }
} 