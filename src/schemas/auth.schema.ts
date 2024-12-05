import { object, string, TypeOf } from "zod";

const createUserSchema = object({
  body: object({
    name: string({
      required_error: "name is require",
    }),
    email: string({
      required_error: "email is require",
    }).email(),
    password: string({
      required_error: "password is require",
    })
      .min(6, "Password must be more than 6 characters")
      .max(20, "Password must be less than 20 characters"),
    confirmPassword: string({
      required_error: "confirmPassword is require",
    }),
    roleId: string({ message: "roleId is require" }),
  }).refine((data) => data.confirmPassword === data.password, {
    message: "Password is not match",
  }),
});

type CreateUserType = Omit<
  TypeOf<typeof createUserSchema>["body"],
  "confirmPassword"
>;

const getUserByEmailSchema = object({
  query: object({
    email: string({ message: "email is require" }).email(),
  }),
});

const getUserByUserIdSchema = object({
  params: object({
    userId: string({ required_error: "userId is require" }),
  }),
});

const loginSchema = object({
  body: object({
    email: string({
      message: "email is require",
    }).email({ message: "enter a valid email" }),
    password: string({ message: "password is require" }).min(5),
  }),
});

type LoginBodyType = TypeOf<typeof loginSchema>["body"];
type GetUserByEmailType = TypeOf<typeof getUserByEmailSchema>["query"];
type GetUserByUserIdType = TypeOf<typeof getUserByUserIdSchema>["params"];

export {
  createUserSchema,
  CreateUserType,
  getUserByEmailSchema,
  GetUserByEmailType,
  getUserByUserIdSchema,
  GetUserByUserIdType,
  LoginBodyType,
  loginSchema,
};
