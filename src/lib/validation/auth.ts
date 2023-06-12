import { z } from "zod";

export const userCreateSchema = z.object({
  username: z
    .string()
    .min(1)
    .regex(/^[a-zA-Z0-9_]*$/),
  password: z.string().min(1),
  attr1: z.string(),
  attr2: z.number(),
});
