import { z } from "zod";

export const registerSchema = z.object({
  username: z
    .string()
    .min(4)
    .regex(/^[a-zA-Z0-9_]*$/),
  password: z.string().min(4),
  attr1: z.string().min(1),
  attr2: z.number().min(0),
});

export const loginSchema = z.object({
  username: z
    .string()
    .min(4)
    .regex(/^[a-zA-Z0-9_]*$/),
  password: z.string().min(4),
});
