import jwt, { JwtPayload } from "jsonwebtoken";
import { Role } from "../entities/role.entity";

type JWTDataType = {
  userId: number;
  role: Role;
  roleId: string;
};

const signToken = ({ payload }: { payload: JWTDataType }): string => {
  const secret: string = process.env.JWT_KEY ?? "JWT";

  const token = jwt.sign(payload, secret, { expiresIn: "1 day" });

  return token;
};

const verifyToken = ({
  token = "",
}: {
  token?: string;
}): JwtPayload & JWTDataType => {
  const secret: string = process.env.JWT_KEY ?? "JWT";
  try {
    const result: JwtPayload & JWTDataType = jwt.verify(
      token?.split(" ")?.[1],
      secret
    ) as JwtPayload & JWTDataType;
    return result;
  } catch (error) {
    throw error;
  }
};

export { signToken, verifyToken, JWTDataType };
