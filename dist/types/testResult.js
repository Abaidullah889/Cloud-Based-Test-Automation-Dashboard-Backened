"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScriptType = exports.TestStatus = void 0;
var TestStatus;
(function (TestStatus) {
    TestStatus["PASS"] = "PASS";
    TestStatus["FAIL"] = "FAIL";
    TestStatus["ERROR"] = "ERROR";
    TestStatus["RUNNING"] = "RUNNING";
})(TestStatus || (exports.TestStatus = TestStatus = {}));
var ScriptType;
(function (ScriptType) {
    ScriptType["PYTHON"] = "python";
    ScriptType["BASH"] = "bash";
    ScriptType["SHELL"] = "shell";
})(ScriptType || (exports.ScriptType = ScriptType = {}));
//# sourceMappingURL=testResult.js.map