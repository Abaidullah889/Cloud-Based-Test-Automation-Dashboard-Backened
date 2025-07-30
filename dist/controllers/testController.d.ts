import { Request, Response } from 'express';
export declare class TestController {
    private testService;
    constructor();
    runTest: (req: Request, res: Response) => Promise<void>;
    getResults: (req: Request, res: Response) => Promise<void>;
    getResultById: (req: Request, res: Response) => Promise<void>;
    getAvailableTests: (req: Request, res: Response) => Promise<void>;
    clearResults: (req: Request, res: Response) => Promise<void>;
    getResultsByTestName: (req: Request, res: Response) => Promise<void>;
}
//# sourceMappingURL=testController.d.ts.map