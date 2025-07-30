import { TestResult, ScriptType } from '../types/testResult';
export declare class TestExecutor {
    static executeTest(testName: string, scriptType?: ScriptType): Promise<TestResult>;
    private static detectScriptType;
    private static getExecutionCommand;
    private static runScript;
    private static determineTestStatus;
}
//# sourceMappingURL=testExecutor.d.ts.map