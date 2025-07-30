import { TestResult } from '../types/testResult';
export declare class FileUtils {
    static saveResults(results: TestResult[]): Promise<void>;
    static loadResults(): Promise<TestResult[]>;
    static getTestFiles(): Promise<string[]>;
    static testFileExists(fileName: string): Promise<boolean>;
    static getTestFilePath(fileName: string): string;
    static truncateOutput(output: string, maxLength?: number): string;
    static ensureTestsDirectory(): Promise<void>;
}
//# sourceMappingURL=fileUtils.d.ts.map