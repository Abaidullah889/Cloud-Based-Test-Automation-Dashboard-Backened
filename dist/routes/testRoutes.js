"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testRoutes = void 0;
const express_1 = require("express");
const testController_1 = require("../controllers/testController");
const router = (0, express_1.Router)();
exports.testRoutes = router;
const testController = new testController_1.TestController();
router.post('/run-tests', testController.runTest);
router.get('/results', testController.getResults);
router.get('/results/:id', testController.getResultById);
router.get('/results/test/:testName', testController.getResultsByTestName);
router.get('/tests', testController.getAvailableTests);
router.delete('/results', testController.clearResults);
//# sourceMappingURL=testRoutes.js.map