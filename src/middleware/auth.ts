import { type NextFunction, type Request, type Response } from "express";
import jwt from "jsonwebtoken";
import { ApiError } from "../utils/errors.js";

export interface AuthPayload {
  id: number;
  name: string;
  role: "contributor" | "maintainer";
}

const getTokenFromHeader = (authorization?: string): string | null => {
  if (!authorization) return null;
  const token = authorization.trim();
  if (token.toLowerCase().startsWith("bearer ")) {
    return token.slice(7).trim();
  }
  return token;
};

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const token = getTokenFromHeader(req.headers.authorization as string | undefined);
  if (!token) {
    return next(new ApiError(401, "Authorization token is required"));
  }

  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new ApiError(500, "JWT secret is not configured");
    const payload = jwt.verify(token, secret) as AuthPayload;
    req.user = payload;
    next();
  } catch (error) {
    next(new ApiError(401, "Invalid or expired token"));
  }
};

export const authorizeRole = (...allowedRoles: Array<"contributor" | "maintainer">) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as AuthPayload | undefined;
    if (!user || !allowedRoles.includes(user.role)) {
      return next(new ApiError(403, "Forbidden: insufficient permissions"));
    }
    next();
  };
};
