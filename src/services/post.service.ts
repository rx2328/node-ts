import RedisDataSource from "../datasource/cacheDatasource";
import AppSource from "../datasource/datasource";
import { Posts } from "../entities/posts.entity";
import { User } from "../entities/user.entity";
import { PostDataType } from "../schemas/post.schema";

const postRepository = AppSource.getRepository(Posts);

const createPost = async (data: PostDataType, user: User): Promise<Posts> => {
  const redis = RedisDataSource.getClient();
  const response = await postRepository.save(
    postRepository.create({ ...data, createdBy: user })
  );

  redis.publish("posts", `${user.id}`);
  return response;
};

const getPostsByUser = async (userId: number) => {
  const data = await postRepository.findBy({ createdBy: { id: userId } });
  const redis = RedisDataSource.getClient();
  // setting up redis data for 1 hour
  // await redis.setex(`posts-${userId}`, 1 * 60 * 60, JSON.stringify(data));
  await redis.set(`posts-${userId}`, JSON.stringify(data));
  return data;
};

const getAllPost = async () => {
  return await postRepository.find({
    relations: { createdBy: true },
    select: {
      createdBy: { id: true, name: true },
    },
  });
};

export { createPost, getPostsByUser, getAllPost };
