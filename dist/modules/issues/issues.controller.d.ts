import { type NextFunction, type Request, type Response } from "express";
export declare const createIssue: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const getIssues: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const getIssueById: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const updateIssue: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const deleteIssue: (req: Request, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=issues.controller.d.ts.map