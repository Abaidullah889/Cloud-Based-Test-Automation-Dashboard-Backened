"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileUtils = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const RESULTS_FILE_PATH = process.env.RESULTS_FILE_PATH || './results.json';
const TESTS_DIRECTORY = './tests';
class FileUtils {
    static async saveResults(results) {
        try {
            const data = JSON.stringify(results, null, 2);
            await fs.promises.writeFile(RESULTS_FILE_PATH, data, 'utf8');
        }
        catch (error) {
            console.error('Error saving results:', error);
            throw new Error('Failed to save test results');
        }
    }
    static async loadResults() {
        try {
            if (!fs.existsSync(RESULTS_FILE_PATH)) {
                return [];
            }
            const data = await fs.promises.readFile(RESULTS_FILE_PATH, 'utf8');
            const results = JSON.parse(data);
            return results.map((result) => ({
                ...result,
                timestamp: new Date(result.timestamp)
            }));
        }
        catch (error) {
            console.error('Error loading results:', error);
            return [];
        }
    }
    static async getTestFiles() {
        try {
            if (!fs.existsSync(TESTS_DIRECTORY)) {
                await fs.promises.mkdir(TESTS_DIRECTORY, { recursive: true });
                return [];
            }
            const files = await fs.promises.readdir(TESTS_DIRECTORY);
            return files.filter(file => file.endsWith('.py') ||
                file.endsWith('.sh') ||
                file.endsWith('.bash'));
        }
        catch (error) {
            console.error('Error reading test files:', error);
            throw new Error('Failed to read test files');
        }
    }
    static async testFileExists(fileName) {
        const filePath = path.join(TESTS_DIRECTORY, fileName);
        try {
            await fs.promises.access(filePath);
            return true;
        }
        catch {
            return false;
        }
    }
    static getTestFilePath(fileName) {
        return path.join(TESTS_DIRECTORY, fileName);
    }
    static truncateOutput(output, maxLength = 1000) {
        if (output.length <= maxLength) {
            return output;
        }
        return output.substring(0, maxLength) + '... (truncated)';
    }
    static async ensureTestsDirectory() {
        if (!fs.existsSync(TESTS_DIRECTORY)) {
            await fs.promises.mkdir(TESTS_DIRECTORY, { recursive: true });
        }
    }
}
exports.FileUtils = FileUtils;
//# sourceMappingURL=fileUtils.js.map