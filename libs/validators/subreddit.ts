import { z } from "zod";

export const SubredditCreationValidator = z.object({
  name: z
    .string()
    .min(3, {
      message: "The community name must be at least 3 characters long.",
    })
    .max(21, {
      message: "The community name must be less than 21 characters long.",
    }),
});

export const SubredditSubscriptionValidator = z.object({
  subredditId: z.string(),
});

export type SubredditCreationRequest = z.infer<
  typeof SubredditCreationValidator
>;
export type SubscribeToSubredditRequest = z.infer<
  typeof SubredditSubscriptionValidator
>;
