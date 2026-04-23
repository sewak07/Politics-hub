import { z } from "zod";

export const postSchema = z.object({
  title: z.string().min(3).max(200),

  content: z.string().min(10),

  category: z.enum([
    "national",
    "international",
    "economy",
    "election",
    "opinion",
    "other",
  ]),

  // accepts array OR string (safe for real APIs)
  tags: z
    .union([
      z.array(z.string()),
      z.string()
    ])
    .optional(),
});