import { z } from "zod";

export const EditUserValidator = z.object({
  username: z
    .string()
    .min(3, {
      message: "The username must be at least 3 characters long.",
    })
    .max(15, {
      message: "The username must be less than 30 characters long.",
    })
    .regex(new RegExp("^[a-zA-Z]+$"), {
      message: "Invalid username. The username must contains only letters.",
    }),
});

export type EditUserRequest = z.infer<typeof EditUserValidator>;
