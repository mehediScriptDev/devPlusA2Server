

   import { createRequire } from 'module';

   const require = createRequire(import.meta.url);

  
"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// src/app.ts
var import_express7 = __toESM(require("express"), 1);
var import_cors = __toESM(require("cors"), 1);

// src/modules/auth/auth.routes.ts
var import_express2 = require("express");

// src/modules/auth/auth.controller.ts
var import_bcrypt2 = __toESM(require("bcrypt"), 1);
var import_jsonwebtoken = __toESM(require("jsonwebtoken"), 1);
var import_express = require("express");

// src/utils/errors.ts
var ApiError = class extends Error {
  statusCode;
  errors;
  constructor(statusCode, message, errors) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
  }
};

// src/utils/response.ts
var successResponse = (message, data) => ({
  success: true,
  message,
  data
});
var errorResponse = (message, errors) => ({
  success: false,
  message,
  errors
});

// src/modules/auth/auth.service.ts
var import_bcrypt = __toESM(require("bcrypt"), 1);

// src/config/db.ts
var import_pg = require("pg");

// src/config/index.ts
var import_dotenv = __toESM(require("dotenv"), 1);
import_dotenv.default.config();
var parsePort = (value) => {
  const raw = String(value ?? "4000").trim().replace(/;$/, "");
  const port = Number(raw);
  return Number.isInteger(port) && port > 0 && port < 65536 ? port : 4e3;
};
var config = {
  port: parsePort(process.env.PORT),
  databaseUrl: process.env.DATABASE_URL
};
var config_default = config;

// src/config/db.ts
var pool = new import_pg.Pool({
  connectionString: config_default.databaseUrl
});
var initializeDatabase = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'contributor',
      created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS issues (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      type TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'open',
      reporter_id INTEGER NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
    );
  `);
};
var db_default = pool;

// src/modules/auth/auth.service.ts
var SALT_ROUNDS = 10;
var createUser = async (payload) => {
  const hashedPassword = await import_bcrypt.default.hash(payload.password, SALT_ROUNDS);
  const result = await db_default.query(
    "INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role, created_at, updated_at",
    [payload.name, payload.email, hashedPassword, payload.role]
  );
  return result.rows[0];
};
var findUserByEmail = async (email) => {
  const result = await db_default.query(
    "SELECT id, name, email, password, role, created_at, updated_at FROM users WHERE email = $1",
    [email]
  );
  return result.rows[0];
};

// src/modules/auth/auth.controller.ts
var signup = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) {
      throw new ApiError(400, "name, email and password are required");
    }
    const normalizedRole = role === "maintainer" ? "maintainer" : "contributor";
    const user = await createUser({ name, email, password, role: normalizedRole });
    res.status(201).json(successResponse("User registered successfully", user));
  } catch (error) {
    if (error instanceof Error && /duplicate key|already exists|unique constraint/.test(error.message)) {
      return next(new ApiError(409, "Email already exists"));
    }
    next(error);
  }
};
var login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new ApiError(400, "email and password are required");
    }
    const user = await findUserByEmail(email);
    if (!user) {
      throw new ApiError(401, "Invalid email or password");
    }
    const isPasswordValid = await import_bcrypt2.default.compare(password, user.password);
    if (!isPasswordValid) {
      throw new ApiError(401, "Invalid email or password");
    }
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new ApiError(500, "JWT secret is not configured");
    }
    const token = import_jsonwebtoken.default.sign({ id: user.id, name: user.name, role: user.role }, secret, {
      expiresIn: "3h"
    });
    const responseData = {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        created_at: user.created_at,
        updated_at: user.updated_at
      }
    };
    res.status(200).json(successResponse("Login successful", responseData));
  } catch (error) {
    next(error);
  }
};

// src/modules/auth/auth.routes.ts
var router = (0, import_express2.Router)();
router.post("/signup", signup);
router.post("/login", login);
var auth_routes_default = router;

// src/modules/issues/issues.routes.ts
var import_express5 = require("express");

// src/modules/issues/issues.controller.ts
var import_express3 = require("express");

// src/modules/issues/issues.service.ts
var VALID_TYPES = ["bug", "feature_request"];
var VALID_STATUSES = ["open", "in_progress", "resolved"];
var isValidIssueType = (value) => VALID_TYPES.includes(value);
var isValidIssueStatus = (value) => VALID_STATUSES.includes(value);
var normalizeIssue = (row) => ({
  id: row.id,
  title: row.title,
  description: row.description,
  type: row.type,
  status: row.status,
  reporter_id: row.reporter_id,
  created_at: row.created_at,
  updated_at: row.updated_at
});
var buildIssueQuery = (query) => {
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
var attachReporter = async (issues) => {
  if (issues.length === 0) {
    return [];
  }
  const reporterIds = Array.from(new Set(issues.map((issue) => issue.reporter_id)));
  const result = await db_default.query(
    `SELECT id, name, role FROM users WHERE id = ANY($1::int[])`,
    [reporterIds]
  );
  const reporters = new Map(result.rows.map((user) => [user.id, user]));
  return issues.map((issue) => ({
    id: issue.id,
    title: issue.title,
    description: issue.description,
    type: issue.type,
    status: issue.status,
    reporter: reporters.get(issue.reporter_id) ?? null,
    created_at: issue.created_at,
    updated_at: issue.updated_at
  }));
};
var createIssue = async (title, description, type, reporterId) => {
  const result = await db_default.query(
    `INSERT INTO issues (title, description, type, status, reporter_id)
     VALUES ($1, $2, $3, 'open', $4)
     RETURNING id, title, description, type, status, reporter_id, created_at, updated_at`,
    [title, description, type, reporterId]
  );
  return result.rows[0];
};
var getIssues = async (query) => {
  const sql = buildIssueQuery(query);
  const result = await db_default.query(sql.text, sql.values);
  const issues = result.rows.map(normalizeIssue);
  return attachReporter(issues);
};
var getIssueById = async (issueId) => {
  const result = await db_default.query("SELECT * FROM issues WHERE id = $1", [issueId]);
  return result.rows[0];
};
var getIssueWithReporterById = async (issueId) => {
  const issue = await getIssueById(issueId);
  if (!issue) {
    return null;
  }
  const reporterResult = await db_default.query("SELECT id, name, role FROM users WHERE id = $1", [issue.reporter_id]);
  const reporter = reporterResult.rows[0];
  const issuePayload = normalizeIssue(issue);
  delete issuePayload.reporter_id;
  return {
    ...issuePayload,
    reporter
  };
};
var updateIssue = async (issueId, fields) => {
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
  const result = await db_default.query(sql, values);
  return result.rows[0];
};
var deleteIssue = async (issueId) => {
  const result = await db_default.query("DELETE FROM issues WHERE id = $1 RETURNING id", [issueId]);
  return (result.rowCount ?? 0) > 0;
};

// src/modules/issues/issues.controller.ts
var createIssue2 = async (req, res, next) => {
  try {
    const user = req.user;
    const { title, description, type } = req.body;
    if (!user) {
      throw new ApiError(401, "Authentication required");
    }
    if (!title || !description || !type) {
      throw new ApiError(400, "title, description and type are required");
    }
    if (title.length > 150) {
      throw new ApiError(400, "title must be 150 characters or fewer");
    }
    if (description.length < 20) {
      throw new ApiError(400, "description must be at least 20 characters");
    }
    if (!isValidIssueType(type)) {
      throw new ApiError(400, "type must be bug or feature_request");
    }
    const issue = await createIssue(title, description, type, user.id);
    res.status(201).json(successResponse("Issue created successfully", issue));
  } catch (error) {
    next(error);
  }
};
var getIssues2 = async (req, res, next) => {
  try {
    const data = await getIssues(req.query);
    res.status(200).json(successResponse("Issues retrieved successfully", data));
  } catch (error) {
    next(error);
  }
};
var getIssueById2 = async (req, res, next) => {
  try {
    const issueId = Number(req.params.id);
    if (Number.isNaN(issueId) || issueId <= 0) {
      throw new ApiError(400, "Invalid issue id");
    }
    const issueWithReporter = await getIssueWithReporterById(issueId);
    if (!issueWithReporter) {
      throw new ApiError(404, "Issue not found");
    }
    res.status(200).json(successResponse("Issue retrieved successfully", issueWithReporter));
  } catch (error) {
    next(error);
  }
};
var updateIssue2 = async (req, res, next) => {
  try {
    const user = req.user;
    if (!user) {
      throw new ApiError(401, "Authentication required");
    }
    const issueId = Number(req.params.id);
    if (Number.isNaN(issueId) || issueId <= 0) {
      throw new ApiError(400, "Invalid issue id");
    }
    const { title, description, type } = req.body;
    if (!title && !description && !type) {
      throw new ApiError(400, "At least one field must be provided to update");
    }
    if (title && title.length > 150) {
      throw new ApiError(400, "title must be 150 characters or fewer");
    }
    if (description && description.length < 20) {
      throw new ApiError(400, "description must be at least 20 characters");
    }
    if (type && !isValidIssueType(type)) {
      throw new ApiError(400, "type must be bug or feature_request");
    }
    const issue = await getIssueById(issueId);
    if (!issue) {
      throw new ApiError(404, "Issue not found");
    }
    if (user.role !== "maintainer") {
      if (issue.reporter_id !== user.id) {
        throw new ApiError(403, "Forbidden: cannot update another user's issue");
      }
      if (issue.status !== "open") {
        throw new ApiError(403, "Forbidden: only open issues can be updated by contributor");
      }
    }
    const fields = {};
    if (title) {
      fields.title = title;
    }
    if (description) {
      fields.description = description;
    }
    if (type) {
      fields.type = type;
    }
    const updated = await updateIssue(issueId, fields);
    if (!updated) {
      throw new ApiError(500, "Failed to update issue");
    }
    res.status(200).json(successResponse("Issue updated successfully", updated));
  } catch (error) {
    next(error);
  }
};
var deleteIssue2 = async (req, res, next) => {
  try {
    const issueId = Number(req.params.id);
    if (Number.isNaN(issueId) || issueId <= 0) {
      throw new ApiError(400, "Invalid issue id");
    }
    const deleted = await deleteIssue(issueId);
    if (!deleted) {
      throw new ApiError(404, "Issue not found");
    }
    res.status(200).json(successResponse("Issue deleted successfully", null));
  } catch (error) {
    next(error);
  }
};

// src/middleware/auth.ts
var import_express4 = require("express");
var import_jsonwebtoken2 = __toESM(require("jsonwebtoken"), 1);
var getTokenFromHeader = (authorization) => {
  if (!authorization) return null;
  const token = authorization.trim();
  if (token.toLowerCase().startsWith("bearer ")) {
    return token.slice(7).trim();
  }
  return token;
};
var authenticate = (req, res, next) => {
  const token = getTokenFromHeader(req.headers.authorization);
  if (!token) {
    return next(new ApiError(401, "Authorization token is required"));
  }
  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new ApiError(500, "JWT secret is not configured");
    const payload = import_jsonwebtoken2.default.verify(token, secret);
    req.user = payload;
    next();
  } catch (error) {
    next(new ApiError(401, "Invalid or expired token"));
  }
};
var authorizeRole = (...allowedRoles) => {
  return (req, res, next) => {
    const user = req.user;
    if (!user || !allowedRoles.includes(user.role)) {
      return next(new ApiError(403, "Forbidden: insufficient permissions"));
    }
    next();
  };
};

// src/modules/issues/issues.routes.ts
var router2 = (0, import_express5.Router)();
router2.get("/", getIssues2);
router2.get("/:id", getIssueById2);
router2.post("/", authenticate, createIssue2);
router2.patch("/:id", authenticate, updateIssue2);
router2.delete("/:id", authenticate, authorizeRole("maintainer"), deleteIssue2);
var issues_routes_default = router2;

// src/middleware/errorHandler.ts
var import_express6 = require("express");
var errorHandler = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json(errorResponse(err.message, err.errors));
  }
  console.error(err);
  res.status(500).json(errorResponse("Internal server error"));
};

// src/app.ts
var app = (0, import_express7.default)();
app.use((0, import_cors.default)());
app.use(import_express7.default.json());
app.use("/api/auth", auth_routes_default);
app.use("/api/issues", issues_routes_default);
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found", errors: null });
});
app.use(errorHandler);
var app_default = app;

// src/server.ts
var main = async () => {
  await initializeDatabase();
  app_default.listen(config_default.port, () => {
    console.log(`see? this is my port number man: ${config_default.port}`);
  });
};
main();
//# sourceMappingURL=server.cjs.map