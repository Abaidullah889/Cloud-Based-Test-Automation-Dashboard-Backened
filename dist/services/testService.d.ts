import { TestResult } from '../types/testResult';
export declare class TestService {
    private static instance;
    private testResults;
    private initialized;
    private constructor();
    static getInstance(): TestService;
    initialize(): Promise<void>;
    runTest(testName: string): Promise<TestResult>;
    getAllResults(): Promise<TestResult[]>;
    getResults(limit?: number, offset?: number): Promise<{
        results: TestResult[];
        total: number;
    }>;
    getAvailableTests(): Promise<string[]>;
    clearResults(): Promise<void>;
    getResultById(id: string): Promise<TestResult | undefined>;
    getResultsByTestName(testName: string): Promise<TestResult[]>;
}
//# sourceMappingURL=testService.d.ts.map