"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestService = void 0;
const testExecutor_1 = require("../utils/testExecutor");
const fileUtils_1 = require("../utils/fileUtils");
class TestService {
    constructor() {
        this.testResults = [];
        this.initialized = false;
    }
    static getInstance() {
        if (!TestService.instance) {
            TestService.instance = new TestService();
        }
        return TestService.instance;
    }
    async initialize() {
        if (this.initialized)
            return;
        try {
            await fileUtils_1.FileUtils.ensureTestsDirectory();
            this.testResults = await fileUtils_1.FileUtils.loadResults();
            this.initialized = true;
        }
        catch (error) {
            console.error('Failed to initialize TestService:', error);
            this.testResults = [];
            this.initialized = true;
        }
    }
    async runTest(testName) {
        await this.initialize();
        const result = await testExecutor_1.TestExecutor.executeTest(testName);
        this.testResults.push(result);
        try {
            await fileUtils_1.FileUtils.saveResults(this.testResults);
        }
        catch (error) {
            console.error('Failed to save test results:', error);
        }
        return result;
    }
    async getAllResults() {
        await this.initialize();
        return [...this.testResults].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    }
    async getResults(limit, offset) {
        await this.initialize();
        const sortedResults = await this.getAllResults();
        const total = sortedResults.length;
        if (limit !== undefined && offset !== undefined) {
            const results = sortedResults.slice(offset, offset + limit);
            return { results, total };
        }
        return { results: sortedResults, total };
    }
    async getAvailableTests() {
        return await fileUtils_1.FileUtils.getTestFiles();
    }
    async clearResults() {
        this.testResults = [];
        await fileUtils_1.FileUtils.saveResults(this.testResults);
    }
    async getResultById(id) {
        await this.initialize();
        return this.testResults.find(result => result.id === id);
    }
    async getResultsByTestName(testName) {
        await this.initialize();
        return this.testResults
            .filter(result => result.testName === testName)
            .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    }
}
exports.TestService = TestService;
//# sourceMappingURL=testService.js.map