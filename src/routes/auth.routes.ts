import { Router } from "express";
import {
  createUserHandler,
  getAllUserHandler,
  getUserByEmailHandler,
  getUserByUserIdHandler,
  loginByEmailHandler,
} from "../controllers/auth.controller";
import { validate } from "../middleware/validate.middleware";
import {
  createUserSchema,
  getUserByEmailSchema,
  getUserByUserIdSchema,
  loginSchema,
} from "../schemas/auth.schema";
import { ProtectRoute } from "../middleware/protectRoutes.middleware";

const authRouter = Router();

authRouter.post("/sign-up", validate(createUserSchema), createUserHandler);

authRouter.get("/all-users", ProtectRoute, getAllUserHandler);

authRouter.get(
  "/:userId",
  validate(getUserByUserIdSchema),
  ProtectRoute,
  getUserByUserIdHandler
);

authRouter.post("/login", validate(loginSchema), loginByEmailHandler);

authRouter.get("/", validate(getUserByEmailSchema), getUserByEmailHandler);

export default authRouter;

// docker run -d -p 6379:6379 --name node-ts-redis -v /home/mayankr.parmar/Documents/node-projects/node-ts/redis:/data redis
