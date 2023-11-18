import { z } from "zod";

export const CommentValidator = z.object({
  postId: z.string(),
  replyToId: z.string().optional(),
  content: z.object({ type: z.string(), content: z.any() }),
});

export type CommentCreationRequest = z.infer<typeof CommentValidator>;
