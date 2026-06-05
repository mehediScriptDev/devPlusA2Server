export interface CreateUserPayload {
    name: string;
    email: string;
    password: string;
    role: "contributor" | "maintainer";
}
export declare const createUser: (payload: CreateUserPayload) => Promise<any>;
export declare const findUserByEmail: (email: string) => Promise<any>;
//# sourceMappingURL=auth.service.d.ts.map