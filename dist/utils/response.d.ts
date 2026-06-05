export declare const successResponse: <T>(message: string, data: T) => {
    success: boolean;
    message: string;
    data: T;
};
export declare const errorResponse: (message: string, errors?: unknown) => {
    success: boolean;
    message: string;
    errors: unknown;
};
//# sourceMappingURL=response.d.ts.map