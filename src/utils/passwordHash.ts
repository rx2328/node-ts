import bcrypt from "bcrypt";

const saltRound = 10;

const encryptPassword = async ({
  password,
}: {
  password: string;
}): Promise<string> => {
  const hashPassword = await bcrypt.hash(password, saltRound);
  return hashPassword;
};

const passwordCompare = async ({
  password,
  hashPassword,
}: {
  password: string;
  hashPassword: string;
}): Promise<boolean> => {
  const isMatch = await bcrypt.compare(password, hashPassword);
  return isMatch;
};

export { encryptPassword, passwordCompare };
