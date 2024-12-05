import { object, string, TypeOf } from "zod";

const postSchema = object({
  body: object({
    postTitle: string({ message: "postTitle is require" }).min(4),
    postContent: string({ message: "postContent is require" }).min(2),
  }),
});

type PostDataType = TypeOf<typeof postSchema>["body"];
export { postSchema, PostDataType };
