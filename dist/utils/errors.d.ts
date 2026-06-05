export declare class ApiError extends Error {
    readonly statusCode: number;
    readonly errors?: unknown;
    constructor(statusCode: number, message: string, errors?: unknown);
}
//# sourceMappingURL=errors.d.ts.map