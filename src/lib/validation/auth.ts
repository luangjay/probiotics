import { z } from "zod";

export const registerSchema = z.object({
  username: z
    .string()
    .trim()
    .toLowerCase()
    .min(4)
    .regex(/^[a-zA-Z0-9_]*$/),
  password: z.string().min(4),
  prefix: z.string().trim().min(1),
  firstName: z.string().trim().min(1),
  lastName: z.string().trim().min(1),
  email: z.preprocess((field) => {
    if (!field || typeof field !== "string" || field.trim() === "") return null;
    return field;
  }, z.string().email().toLowerCase().nullable()),
});

export const loginSchema = z.object({
  username: z
    .string()
    .trim()
    .toLowerCase()
    .min(4)
    .regex(/^[a-zA-Z0-9_]*$/),
  password: z.string().min(4),
});
