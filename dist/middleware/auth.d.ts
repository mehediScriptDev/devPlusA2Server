import { type NextFunction, type Request, type Response } from "express";
export interface AuthPayload {
    id: number;
    name: string;
    role: "contributor" | "maintainer";
}
export declare const authenticate: (req: Request, res: Response, next: NextFunction) => void;
export declare const authorizeRole: (...allowedRoles: Array<"contributor" | "maintainer">) => (req: Request, res: Response, next: NextFunction) => void;
//# sourceMappingURL=auth.d.ts.map