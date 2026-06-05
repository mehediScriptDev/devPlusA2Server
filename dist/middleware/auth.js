import {} from "express";
import jwt from "jsonwebtoken";
import { ApiError } from "../utils/errors.js";
const getTokenFromHeader = (authorization) => {
    if (!authorization)
        return null;
    const token = authorization.trim();
    if (token.toLowerCase().startsWith("bearer ")) {
        return token.slice(7).trim();
    }
    return token;
};
export const authenticate = (req, res, next) => {
    const token = getTokenFromHeader(req.headers.authorization);
    if (!token) {
        return next(new ApiError(401, "Authorization token is required"));
    }
    try {
        const secret = process.env.JWT_SECRET;
        if (!secret)
            throw new ApiError(500, "JWT secret is not configured");
        const payload = jwt.verify(token, secret);
        req.user = payload;
        next();
    }
    catch (error) {
        next(new ApiError(401, "Invalid or expired token"));
    }
};
export const authorizeRole = (...allowedRoles) => {
    return (req, res, next) => {
        const user = req.user;
        if (!user || !allowedRoles.includes(user.role)) {
            return next(new ApiError(403, "Forbidden: insufficient permissions"));
        }
        next();
    };
};
//# sourceMappingURL=auth.js.map