import { NextFunction, Request, Response } from "express";
import { User, UserType } from "../entities/user.entity";
import {
  CreateUserType,
  GetUserByEmailType,
  GetUserByUserIdType,
  LoginBodyType,
} from "../schemas/auth.schema";
import {
  createUser,
  findAllUsers,
  findUserByEmail,
  findUserByUserId,
} from "../services/auth.service";
import formatResponse from "../utils/formatResponse";
import { signToken } from "../utils/jwt";
import { encryptPassword, passwordCompare } from "../utils/passwordHash";
import { logError } from "../utils/logger";

const createUserHandler = async (
  req: Request<{}, {}, CreateUserType>,
  res: Response<UserType>,
  next: NextFunction
): Promise<void> => {
  try {
    const { password, email } = req.body;

    const isUserExists = await findUserByEmail({ email });

    if (isUserExists) {
      formatResponse({
        res,
        status: 400,
        message: "user already exist with this email address",
      });
      return;
    }

    const hashPassword = await encryptPassword({ password });
    const user = {
      ...req.body,
      password: hashPassword,
    };
    const response: User | null = await createUser(user);

    if (response) {
      const jwt = signToken({
        payload: {
          userId: response.id,
          role: response.role,
          roleId: response.roleId,
        },
      });

      formatResponse({
        res,
        message: "user created",
        data: response,
        token: jwt,
        status: 201,
      });
    }
    formatResponse({ res, message: "something went wrong" });
  } catch (error) {
    logError("Auth controller", error, req.url);
    next(formatResponse({ res, status: 400, message: "User already exist" }));
  }
};

const getAllUserHandler = async (
  req: Request,
  res: Response<Omit<UserType, "password">[]>,
  next: NextFunction
): Promise<void> => {
  try {
    const response = await findAllUsers();

    next(formatResponse({ res, data: response }));
  } catch (error) {
    logError("Auth controller", error, req.url);
    next(formatResponse({ res, data: [], message: "no data found" }));
  }
};

const getUserByEmailHandler = async (
  req: Request<GetUserByEmailType>,
  res: Response<UserType>,
  next: NextFunction
) => {
  try {
    const response = await findUserByEmail({ email: req.params.email });
    formatResponse({ res, data: response });
  } catch (error) {
    logError("Auth controller", error, req.url);
    next(formatResponse({ res, message: "User not found", status: 400 }));
  }
};

const getUserByUserIdHandler = async (
  req: Request<GetUserByUserIdType>,
  res: Response<UserType>,
  next: NextFunction
) => {
  try {
    const result = await findUserByUserId({
      userId: parseInt(req?.params?.userId),
    });
    next(formatResponse({ res, data: result }));
  } catch (error) {
    logError("Auth controller", error, req.originalUrl);
    next(formatResponse({ res, status: 400, message: "user not found" }));
  }
};

const loginByEmailHandler = async (
  req: Request<{}, {}, LoginBodyType>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;

    const user = await findUserByEmail({ email, relations: { role: true } });

    if (!user) {
      next(formatResponse({ res, message: "user not found" }));
      return;
    }

    const isCorrectPassword = await passwordCompare({
      password,
      hashPassword: user.password,
    });

    if (!isCorrectPassword) {
      next(formatResponse({ res, message: "password is incorrect" }));
      return;
    }
    const jwt = signToken({
      payload: { userId: user.id, role: user.role, roleId: user.roleId },
    });

    next(formatResponse({ res, data: user, token: jwt }));
  } catch (error) {
    logError("Auth controller", error, req.path);
    next(formatResponse({ res, message: "something went wrong", status: 400 }));
  }
};

export {
  createUserHandler,
  getAllUserHandler,
  getUserByEmailHandler,
  getUserByUserIdHandler,
  loginByEmailHandler,
};
