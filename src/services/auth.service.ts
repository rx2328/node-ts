import { FindOptionsRelations } from "typeorm";
import AppSource from "../datasource/datasource";
import { User, UserType } from "../entities/user.entity";

const userRepository = AppSource.getRepository(User);

export const createUser = async (input: Partial<User>) => {
  const { id } = await userRepository.save(userRepository.create(input));

  return await userRepository.findOne({
    where: { id: id },
    relations: { role: true },
  });
};

export const findUserByEmail = async ({
  email,
  relations,
}: {
  email: string;
  relations?: FindOptionsRelations<User>;
}) => {
  return await userRepository.findOne({
    where: { email: email },
    relations,
  });
};

export const findUserByUserId = async ({ userId }: { userId: number }) => {
  return await userRepository.findOneOrFail({
    where: { id: userId },
    relations: { role: true },
  });
};

export const findAllUsers = async () => {
  return await userRepository.find({
    select: ["id", "email", "name", "createdAt", "updatedAt", "deletedAt"],
    relations: { role: true },
  });
};
