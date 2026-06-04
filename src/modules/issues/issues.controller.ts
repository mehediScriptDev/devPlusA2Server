import { type NextFunction, type Request, type Response } from "express";
import {
  createIssue as createIssueService,
  deleteIssue as deleteIssueService,
  getIssueById as getIssueByIdService,
  getIssueWithReporterById,
  getIssues as getIssuesService,
  updateIssue as updateIssueService,
  isValidIssueType,
  isValidIssueStatus,
} from "./issues.service.js";
import { ApiError } from "../../utils/errors.js";
import { successResponse } from "../../utils/response.js";

export const createIssue = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user;
    const { title, description, type } = req.body as {
      title?: string;
      description?: string;
      type?: string;
    };

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

    const issue = await createIssueService(title, description, type, user.id);
    res.status(201).json(successResponse("Issue created successfully", issue));
  } catch (error) {
    next(error);
  }
};


export const getIssues = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await getIssuesService(req.query as Record<string, string | undefined>);
    res.status(200).json(successResponse("Issues retrieved successfully", data));
  } catch (error) {
    next(error);
  }
};

export const getIssueById = async (req: Request, res: Response, next: NextFunction) => {
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

export const updateIssue = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user;
    if (!user) {
      throw new ApiError(401, "Authentication required");
    }

    const issueId = Number(req.params.id);
    if (Number.isNaN(issueId) || issueId <= 0) {
      throw new ApiError(400, "Invalid issue id");
    }

    const { title, description, type } = req.body as {
      title?: string;
      description?: string;
      type?: string;
    };

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

    const issue = await getIssueByIdService(issueId);
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

    const fields: Record<string, unknown> = {};
    if (title) {
      fields.title = title;
    }
    if (description) {
      fields.description = description;
    }
    if (type) {
      fields.type = type;
    }
    const updated = await updateIssueService(issueId, fields);
    if (!updated) {
      throw new ApiError(500, "Failed to update issue");
    }
    res.status(200).json(successResponse("Issue updated successfully", updated));
  } catch (error) {
    next(error);
  }
};

export const deleteIssue = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const issueId = Number(req.params.id);
    if (Number.isNaN(issueId) || issueId <= 0) {
      throw new ApiError(400, "Invalid issue id");
    }

    const deleted = await deleteIssueService(issueId);
    if (!deleted) {
      throw new ApiError(404, "Issue not found");
    }

    res.status(200).json(successResponse("Issue deleted successfully", null));
  } catch (error) {
    next(error);
  }
};
