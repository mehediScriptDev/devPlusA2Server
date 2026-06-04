import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { type NextFunction, type Request, type Response } from "express";
import { ApiError } from "../../utils/errors.js";
import { successResponse } from "../../utils/response.js";
import { createUser, findUserByEmail } from "./auth.service.js";

const SALT_ROUNDS = 10;

export const signup = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, password, role } = req.body as {
      name?: string;
      email?: string;
      password?: string;
      role?: string;
    };

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

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body as { email?: string; password?: string };
    if (!email || !password) {
      throw new ApiError(400, "email and password are required");
    }

    const user = await findUserByEmail(email);
    if (!user) {
      throw new ApiError(401, "Invalid email or password");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new ApiError(401, "Invalid email or password");
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new ApiError(500, "JWT secret is not configured");
    }

    const token = jwt.sign({ id: user.id, name: user.name, role: user.role }, secret, {
      expiresIn: "3h",
    });

    const responseData = {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        created_at: user.created_at,
        updated_at: user.updated_at,
      },
    };

    res.status(200).json(successResponse("Login successful", responseData));
  } catch (error) {
    next(error);
  }
};
