declare const VALID_TYPES: readonly ["bug", "feature_request"];
declare const VALID_STATUSES: readonly ["open", "in_progress", "resolved"];
type IssueType = (typeof VALID_TYPES)[number];
type IssueStatus = (typeof VALID_STATUSES)[number];
export declare const isValidIssueType: (value: string) => value is IssueType;
export declare const isValidIssueStatus: (value: string) => value is IssueStatus;
export declare const createIssue: (title: string, description: string, type: IssueType, reporterId: number) => Promise<any>;
export declare const getIssues: (query: Record<string, string | undefined>) => Promise<{
    id: any;
    title: any;
    description: any;
    type: any;
    status: any;
    reporter: any;
    created_at: any;
    updated_at: any;
}[]>;
export declare const getIssueById: (issueId: number) => Promise<any>;
export declare const getIssueWithReporterById: (issueId: number) => Promise<{
    reporter: any;
    id: any;
    title: any;
    description: any;
    type: any;
    status: any;
    reporter_id: any;
    created_at: any;
    updated_at: any;
} | null>;
export declare const updateIssue: (issueId: number, fields: Record<string, unknown>) => Promise<any>;
export declare const deleteIssue: (issueId: number) => Promise<boolean>;
export {};
//# sourceMappingURL=issues.service.d.ts.map