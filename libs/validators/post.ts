import { z } from "zod";

export const PostValidator = z.object({
  title: z
    .string()
    .min(3, { message: "The title must be at least 3 characters long." })
    .max(300, { message: "The title must be less than 300 characters long." }),
  subredditId: z.string(),
  content: z.any(),
});

export type PostCreationRequest = z.infer<typeof PostValidator>;
