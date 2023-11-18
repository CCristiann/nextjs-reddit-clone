import { z } from "zod";

export const LinkValidator = z.object({
  linkText: z.string().max(50).nullable(),
  linkUrl: z
    .string()
    .regex(
      new RegExp(
        "^(https?|ftp|file)://[-a-zA-Z0-9+&@#/%?=~_|!:,.;]*[-a-zA-Z0-9+&@#/%=~_|]$",
      ),
      { message: "Invalid URL" },
    ),
});

export type LinkValidatorRequest = z.infer<typeof LinkValidator>;
