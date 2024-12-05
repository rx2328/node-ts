import { NextFunction, Request, Response } from "express";
import formatResponse from "../utils/formatResponse";
import { verifyToken } from "../utils/jwt";
import { JsonWebTokenError } from "jsonwebtoken";

const ProtectRoute = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authToken = req.headers?.authorization;
    if (!authToken)
      next(formatResponse({ message: "Token is missing", status: 400, res }));

    const token = verifyToken({
      token: req.headers?.authorization,
    });

    if (token instanceof JsonWebTokenError)
      next(formatResponse({ res, status: 400, message: "invalid token" }));

    next();
  } catch (error) {
    console.log("🚀 ~ ProtectRoute ~ error:", error);
    next(formatResponse({ message: "Invalid token !", res, status: 400 }));
  }
};

export { ProtectRoute };
