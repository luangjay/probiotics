import { z } from "zod";

export const minUsername = 4;
export const minPassword = 4;
export const maxUsername = 16;
export const maxPassword = 16;
export const regexUsername = /^[a-zA-Z0-9_.]*$/;
export const patternUsername = "^[a-zA-Z0-9_.]*$";

enum Gender {
  Male = "Male",
  Female = "Female",
  Others = "Others",
}

export const loginSchema = z.object({
  username: z
    .string()
    .trim()
    .min(minUsername)
    .max(maxUsername)
    .regex(regexUsername),
  password: z.string().min(minPassword).max(maxPassword),
});

export const userSchema = z.object({
  username: z
    .string()
    .trim()
    .min(minUsername)
    .max(maxUsername)
    .regex(regexUsername),
  password: z.string().min(minPassword).max(maxPassword),
  email: z.preprocess((field) => {
    if (field === undefined) return undefined;
    if (typeof field !== "string" || field.trim() === "") return null;
    return field;
  }, z.string().trim().email().toLowerCase().nullable().optional()),
  prefix: z.string().trim().min(1),
  firstName: z.string().trim().min(1),
  lastName: z.string().trim().min(1),
});

export const createDoctorSchema = z.object({
  username: z
    .string()
    .trim()
    .min(minUsername)
    .max(maxUsername)
    .regex(regexUsername),
  password: z.string().min(minPassword).max(maxPassword),
  email: z.preprocess((field) => {
    if (field === undefined) return undefined;
    if (typeof field !== "string" || field.trim() === "") return null;
    return field;
  }, z.string().trim().email().toLowerCase().nullable().optional()),
  prefix: z.string().trim().min(1),
  firstName: z.string().trim().min(1),
  lastName: z.string().trim().min(1),
});

export const updateDoctorSchema = z.object({
  username: z
    .string()
    .trim()
    .min(minUsername)
    .max(maxUsername)
    .regex(regexUsername)
    .optional(),
  password: z.string().min(minPassword).max(maxPassword).optional(),
  email: z.preprocess((field) => {
    if (field === undefined) return undefined;
    if (typeof field !== "string" || field.trim() === "") return null;
    return field;
  }, z.string().trim().email().toLowerCase().nullable().optional()),
  prefix: z.string().trim().min(1).optional(),
  firstName: z.string().trim().min(1).optional(),
  lastName: z.string().trim().min(1).optional(),
});

// export const doctorSchema = z.object({
//   userId: z.string(),
// });

export const patientSchema = z.object({
  userId: z.string(),
  ssn: z.string(),
  gender: z.nativeEnum(Gender),
  birthDate: z.date(),
  ethnicity: z.string().nullable(),
});

export const adminSchema = z.object({
  userId: z.string(),
});

export const fileSchema = z.object({
  id: z.string(),
  uri: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const probioticSchema = z.object({
  id: z.number(),
  parentId: z.number().nullable(),
  name: z.string(),
  red: z.number(),
  yellow: z.number(),
  green: z.number(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const probioticBrandSchema = z.object({
  id: z.number(),
  name: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const medicalConditionSchema = z.object({
  id: z.number(),
  name: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const probioticRecordSchema = z.object({
  id: z.string(),
  doctorId: z.string(),
  patientId: z.string(),
  fileId: z.string().nullable(),
  result: z.any().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const probioticBrandProbioticRecordSchema = z.object({
  id: z.number(),
  probioticBrandId: z.number(),
  probioticRecordId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const medicalConditionPatientSchema = z.object({
  id: z.number(),
  medicalConditionId: z.number(),
  patientId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});
