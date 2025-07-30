export interface TestResult {
  id: string;
  testName: string;
  status: TestStatus;
  timestamp: Date;
  output: string;
  errorOutput?: string;
  duration: number; // in milliseconds
  scriptType: ScriptType;
}

export enum TestStatus {
  PASS = 'PASS',
  FAIL = 'FAIL',
  ERROR = 'ERROR',
  RUNNING = 'RUNNING'
}

export enum ScriptType {
  PYTHON = 'python',
  BASH = 'bash',
  SHELL = 'shell'
}

export interface RunTestRequest {
  testName: string;
  scriptType?: ScriptType;
}

export interface RunTestResponse {
  success: boolean;
  result?: TestResult;
  error?: string;
}

export interface GetResultsResponse {
  success: boolean;
  results: TestResult[];
  total: number;
}

export interface TestExecution {
  testName: string;
  scriptPath: string;
  scriptType: ScriptType;
  startTime: Date;
  endTime?: Date;
} 