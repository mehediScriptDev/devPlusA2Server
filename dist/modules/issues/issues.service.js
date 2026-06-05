import pool from "../../config/db.js";
const VALID_TYPES = ["bug", "feature_request"];
const VALID_STATUSES = ["open", "in_progress", "resolved"];
export const isValidIssueType = (value) => VALID_TYPES.includes(value);
export const isValidIssueStatus = (value) => VALID_STATUSES.includes(value);
const normalizeIssue = (row) => ({
    id: row.id,
    title: row.title,
    description: row.description,
    type: row.type,
    status: row.status,
    reporter_id: row.reporter_id,
    created_at: row.created_at,
    updated_at: row.updated_at,
});
const buildIssueQuery = (query) => {
    const clauses = [];
    const values = [];
    let idx = 1;
    if (query.type && isValidIssueType(query.type)) {
        clauses.push(`type = $${idx++}`);
        values.push(query.type);
    }
    if (query.status && isValidIssueStatus(query.status)) {
        clauses.push(`status = $${idx++}`);
        values.push(query.status);
    }
    const whereClause = clauses.length > 0 ? `WHERE ${clauses.join(" AND ")}` : "";
    const orderBy = query.sort === "oldest" ? "ORDER BY created_at ASC" : "ORDER BY created_at DESC";
    return { text: `SELECT * FROM issues ${whereClause} ${orderBy}`, values };
};
const attachReporter = async (issues) => {
    if (issues.length === 0) {
        return [];
    }
    const reporterIds = Array.from(new Set(issues.map((issue) => issue.reporter_id)));
    const result = await pool.query(`SELECT id, name, role FROM users WHERE id = ANY($1::int[])`, [reporterIds]);
    const reporters = new Map(result.rows.map((user) => [user.id, user]));
    return issues.map((issue) => ({
        id: issue.id,
        title: issue.title,
        description: issue.description,
        type: issue.type,
        status: issue.status,
        reporter: reporters.get(issue.reporter_id) ?? null,
        created_at: issue.created_at,
        updated_at: issue.updated_at,
    }));
};
export const createIssue = async (title, description, type, reporterId) => {
    const result = await pool.query(`INSERT INTO issues (title, description, type, status, reporter_id)
     VALUES ($1, $2, $3, 'open', $4)
     RETURNING id, title, description, type, status, reporter_id, created_at, updated_at`, [title, description, type, reporterId]);
    return result.rows[0];
};
export const getIssues = async (query) => {
    const sql = buildIssueQuery(query);
    const result = await pool.query(sql.text, sql.values);
    const issues = result.rows.map(normalizeIssue);
    return attachReporter(issues);
};
export const getIssueById = async (issueId) => {
    const result = await pool.query("SELECT * FROM issues WHERE id = $1", [issueId]);
    return result.rows[0];
};
export const getIssueWithReporterById = async (issueId) => {
    const issue = await getIssueById(issueId);
    if (!issue) {
        return null;
    }
    const reporterResult = await pool.query("SELECT id, name, role FROM users WHERE id = $1", [issue.reporter_id]);
    const reporter = reporterResult.rows[0];
    const issuePayload = normalizeIssue(issue);
    delete issuePayload.reporter_id;
    return {
        ...issuePayload,
        reporter,
    };
};
export const updateIssue = async (issueId, fields) => {
    const updates = Object.keys(fields);
    if (updates.length === 0) {
        return null;
    }
    const values = [];
    const assignments = updates.map((field, index) => {
        values.push(fields[field]);
        return `${field} = $${index + 1}`;
    });
    values.push(issueId);
    const sql = `UPDATE issues SET ${assignments.join(", ")}, updated_at = NOW() WHERE id = $${values.length} RETURNING *`;
    const result = await pool.query(sql, values);
    return result.rows[0];
};
export const deleteIssue = async (issueId) => {
    const result = await pool.query("DELETE FROM issues WHERE id = $1 RETURNING id", [issueId]);
    return (result.rowCount ?? 0) > 0;
};
//# sourceMappingURL=issues.service.js.map