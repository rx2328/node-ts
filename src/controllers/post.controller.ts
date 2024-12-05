import { NextFunction, Request, Response } from "express";
import formatResponse from "../utils/formatResponse";
import { findUserByUserId } from "../services/auth.service";
import {
  createPost,
  getAllPost,
  getPostsByUser,
} from "../services/post.service";
import { verifyToken } from "../utils/jwt";
import { logError } from "../utils/logger";
import RedisDataSource from "../datasource/cacheDatasource";
import { PostDataType } from "../schemas/post.schema";

const createPostHandler = async (
  req: Request<{}, {}, PostDataType>,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = verifyToken({ token: req.headers.authorization });
    const userId = token.userId;

    const user = await findUserByUserId({ userId });
    const result = await createPost(req.body, user);

    next(formatResponse({ res, data: result }));
  } catch (error) {
    logError("Post controller", error, req.path);
    next(
      formatResponse({ res, message: "fail to create a post", status: 400 })
    );
  }
};

const getPostsHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = verifyToken({ token: req.headers.authorization });
    const userId = token.userId;
    const redis = RedisDataSource.getClient();

    const redisResponse = await redis.get(`posts-${userId}`);
    if (!!redisResponse) {
      next(formatResponse({ res, data: JSON.parse(redisResponse) }));
      return;
    }

    const result = await getPostsByUser(userId);
    next(formatResponse({ res, data: result }));
  } catch (error) {
    logError("Post controller", error, req.path);
    next(formatResponse({ res, message: "fail to fetch a post", status: 400 }));
  }
};

const getAllPostsHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await getAllPost();
    next(formatResponse({ res, data: result }));
  } catch (error) {
    next(formatResponse({ res, message: "fail to fetch a post", status: 400 }));
  }
};

export { createPostHandler, getPostsHandler, getAllPostsHandler };
