import { Router } from "express";
import {
  createPostHandler,
  getAllPostsHandler,
  getPostsHandler,
} from "../controllers/post.controller";
import { ProtectRoute } from "../middleware/protectRoutes.middleware";
import { validate } from "../middleware/validate.middleware";
import { postSchema } from "../schemas/post.schema";
import { RoleGuard } from "../middleware/roleGuard.middleware";
import { UserRoleEnum } from "../const/user.const";

const postsRouter = Router();

postsRouter.post(
  "/create",
  validate(postSchema),
  ProtectRoute,
  createPostHandler
);

postsRouter.get("/get-posts", ProtectRoute, getPostsHandler);

postsRouter.get(
  "/get-all-posts",
  ProtectRoute,
  RoleGuard({ allowed: [UserRoleEnum.Admin] }),
  getAllPostsHandler
);

export default postsRouter;
