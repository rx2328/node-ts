import { NextFunction, Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import { UserRoletype } from "../const/user.const";
import formatResponse from "../utils/formatResponse";
import { JWTDataType, verifyToken } from "../utils/jwt";

const RoleGuard = ({ allowed }: { allowed: UserRoletype[] }) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const authToken = req.headers?.authorization;
      const token: JwtPayload & JWTDataType = verifyToken({
        token: authToken,
      });

      if (allowed.includes(token?.role.slug)) {
        next();
      }

      next(
        formatResponse({ message: "User is not allowed !", res, status: 400 })
      );
    } catch (error) {
      next(
        formatResponse({ message: "User is not allowed", res, status: 400 })
      );
    }
  };
};

export { RoleGuard };
