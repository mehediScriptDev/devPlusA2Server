import {} from "express";
import { ApiError } from "../utils/errors.js";
import { errorResponse } from "../utils/response.js";
export const errorHandler = (err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }
    if (err instanceof ApiError) {
        return res.status(err.statusCode).json(errorResponse(err.message, err.errors));
    }
    console.error(err);
    res.status(500).json(errorResponse("Internal server error"));
};
//# sourceMappingURL=errorHandler.js.map