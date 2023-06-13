import { z } from "zod";

export const registerSchema = z.object({
  username: z
    .string()
    .min(4)
    .regex(/^[a-zA-Z0-9_]*$/),
  password: z.string().min(4),
  prefix: z.string().min(1),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email().optional(),
});

export const loginSchema = z.object({
  username: z
    .string()
    .min(4)
    .regex(/^[a-zA-Z0-9_]*$/),
  password: z.string().min(4),
});
