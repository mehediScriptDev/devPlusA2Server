import { type NextFunction, type Request, type Response } from "express";
import { ApiError } from "../utils/errors.js";
import { errorResponse } from "../utils/response.js";

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  if (res.headersSent) {
    return next(err);
  }

  if (err instanceof ApiError) {
    return res.status(err.statusCode).json(errorResponse(err.message, err.errors));
  }

  console.error(err);
  res.status(500).json(errorResponse("Internal server error"));
};
