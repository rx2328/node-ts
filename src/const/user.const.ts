enum UserRoleEnum {
  Admin = "admin",
  User = "user",
  Manager = "manager",
}

type UserRoletype = UserRoleEnum[keyof UserRoleEnum];

export { UserRoleEnum, UserRoletype };
