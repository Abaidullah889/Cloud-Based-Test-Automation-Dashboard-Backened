"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestController = void 0;
const testService_1 = require("../services/testService");
class TestController {
    constructor() {
        this.runTest = async (req, res) => {
            try {
                const { testName, scriptType } = req.body;
                if (!testName) {
                    res.status(400).json({
                        success: false,
                        error: 'Test name is required'
                    });
                    return;
                }
                console.log(`Executing test: ${testName}`);
                const result = await this.testService.runTest(testName);
                const response = {
                    success: true,
                    result
                };
                res.status(200).json(response);
            }
            catch (error) {
                console.error('Error running test:', error);
                const response = {
                    success: false,
                    error: error instanceof Error ? error.message : 'Unknown error occurred'
                };
                res.status(500).json(response);
            }
        };
        this.getResults = async (req, res) => {
            try {
                const limit = req.query.limit ? parseInt(req.query.limit) : undefined;
                const offset = req.query.offset ? parseInt(req.query.offset) : undefined;
                const { results, total } = await this.testService.getResults(limit, offset);
                const response = {
                    success: true,
                    results,
                    total
                };
                res.status(200).json(response);
            }
            catch (error) {
                console.error('Error getting results:', error);
                const response = {
                    success: false,
                    results: [],
                    total: 0
                };
                res.status(500).json(response);
            }
        };
        this.getResultById = async (req, res) => {
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
            }
            catch (error) {
                console.error('Error getting result by ID:', error);
                res.status(500).json({
                    success: false,
                    error: error instanceof Error ? error.message : 'Unknown error occurred'
                });
            }
        };
        this.getAvailableTests = async (req, res) => {
            try {
                const tests = await this.testService.getAvailableTests();
                res.status(200).json({
                    success: true,
                    tests
                });
            }
            catch (error) {
                console.error('Error getting available tests:', error);
                res.status(500).json({
                    success: false,
                    error: error instanceof Error ? error.message : 'Unknown error occurred',
                    tests: []
                });
            }
        };
        this.clearResults = async (req, res) => {
            try {
                await this.testService.clearResults();
                res.status(200).json({
                    success: true,
                    message: 'All test results cleared'
                });
            }
            catch (error) {
                console.error('Error clearing results:', error);
                res.status(500).json({
                    success: false,
                    error: error instanceof Error ? error.message : 'Unknown error occurred'
                });
            }
        };
        this.getResultsByTestName = async (req, res) => {
            try {
                const { testName } = req.params;
                const results = await this.testService.getResultsByTestName(testName);
                res.status(200).json({
                    success: true,
                    results,
                    total: results.length
                });
            }
            catch (error) {
                console.error('Error getting results by test name:', error);
                res.status(500).json({
                    success: false,
                    error: error instanceof Error ? error.message : 'Unknown error occurred',
                    results: [],
                    total: 0
                });
            }
        };
        this.testService = testService_1.TestService.getInstance();
    }
}
exports.TestController = TestController;
//# sourceMappingURL=testController.js.map