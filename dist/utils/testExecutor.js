"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestExecutor = void 0;
const child_process_1 = require("child_process");
const uuid_1 = require("uuid");
const testResult_1 = require("../types/testResult");
const fileUtils_1 = require("./fileUtils");
class TestExecutor {
    static async executeTest(testName, scriptType) {
        const startTime = new Date();
        const testId = (0, uuid_1.v4)();
        try {
            const detectedScriptType = scriptType || TestExecutor.detectScriptType(testName);
            const exists = await fileUtils_1.FileUtils.testFileExists(testName);
            if (!exists) {
                throw new Error(`Test file '${testName}' not found`);
            }
            const scriptPath = fileUtils_1.FileUtils.getTestFilePath(testName);
            const { command, args } = TestExecutor.getExecutionCommand(detectedScriptType, scriptPath);
            const result = await TestExecutor.runScript(command, args);
            const endTime = new Date();
            const duration = endTime.getTime() - startTime.getTime();
            const status = TestExecutor.determineTestStatus(result.stdout, result.stderr, result.exitCode);
            return {
                id: testId,
                testName,
                status,
                timestamp: startTime,
                output: fileUtils_1.FileUtils.truncateOutput(result.stdout),
                errorOutput: result.stderr ? fileUtils_1.FileUtils.truncateOutput(result.stderr) : undefined,
                duration,
                scriptType: detectedScriptType
            };
        }
        catch (error) {
            const endTime = new Date();
            const duration = endTime.getTime() - startTime.getTime();
            return {
                id: testId,
                testName,
                status: testResult_1.TestStatus.ERROR,
                timestamp: startTime,
                output: '',
                errorOutput: error instanceof Error ? error.message : 'Unknown error occurred',
                duration,
                scriptType: scriptType || testResult_1.ScriptType.PYTHON
            };
        }
    }
    static detectScriptType(fileName) {
        if (fileName.endsWith('.py')) {
            return testResult_1.ScriptType.PYTHON;
        }
        else if (fileName.endsWith('.sh') || fileName.endsWith('.bash')) {
            return testResult_1.ScriptType.BASH;
        }
        return testResult_1.ScriptType.PYTHON;
    }
    static getExecutionCommand(scriptType, scriptPath) {
        switch (scriptType) {
            case testResult_1.ScriptType.PYTHON:
                return { command: 'python', args: [scriptPath] };
            case testResult_1.ScriptType.BASH:
            case testResult_1.ScriptType.SHELL:
                return { command: 'bash', args: [scriptPath] };
            default:
                return { command: 'python', args: [scriptPath] };
        }
    }
    static runScript(command, args) {
        return new Promise((resolve, reject) => {
            const child = (0, child_process_1.spawn)(command, args, {
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
            const timeout = setTimeout(() => {
                child.kill('SIGTERM');
                reject(new Error('Test execution timeout (5 minutes)'));
            }, 5 * 60 * 1000);
            child.on('close', () => {
                clearTimeout(timeout);
            });
        });
    }
    static determineTestStatus(stdout, stderr, exitCode) {
        if (exitCode !== 0) {
            return testResult_1.TestStatus.FAIL;
        }
        const output = stdout.toLowerCase();
        if (output.includes('pass') && !output.includes('fail')) {
            return testResult_1.TestStatus.PASS;
        }
        if (output.includes('fail')) {
            return testResult_1.TestStatus.FAIL;
        }
        if (stderr.trim().length > 0) {
            return testResult_1.TestStatus.FAIL;
        }
        return testResult_1.TestStatus.PASS;
    }
}
exports.TestExecutor = TestExecutor;
//# sourceMappingURL=testExecutor.js.map