import { csvFileType, xlsFileType, xlsxFileType } from "@/lib/file";
import { Gender } from "@prisma/client";
import { z } from "zod";

export const MIN_USERNAME = 4;
export const MIN_PASSWORD = 4;
export const MAX_USERNAME = 16;
export const MAX_PASSWORD = 16;
export const REGEX_USERNAME = /^[a-zA-Z0-9_.]+$/;
export const REGEX_FIRSTNAME = /^[a-zA-Z]+$/;
export const REGEX_LASTNAME = /^[a-zA-Z]+$/;
export const REGEX_SSN = /^\d+$/;
export const PATTERN_USERNAME = "^[a-zA-Z0-9_.]+$";
export const PATTERN_SSN = "^[0-9]+$";
export const ENUM_GENDER = ["Male", "Female", "Others"] as const;

function refineInput(input: Record<string, unknown>) {
  return Object.values(input).some((field) => field !== undefined);
}

// CRUD
export const adminSchema = z
  .object({
    username: z
      .string()
      .trim()
      .min(MIN_USERNAME)
      .max(MAX_USERNAME)
      .regex(REGEX_USERNAME),
    password: z.string().min(MIN_PASSWORD).max(MAX_PASSWORD),
    email: z.preprocess((field) => {
      if (field === undefined) return undefined;
      if (typeof field !== "string" || field.trim() === "") return null;
      return field;
    }, z.string().trim().email().toLowerCase().nullable().optional()),
    prefix: z.string().trim().min(1),
    firstName: z.string().trim().min(1).regex(REGEX_FIRSTNAME),
    lastName: z.string().trim().min(1).regex(REGEX_LASTNAME),
  })
  .strict();

export const partialAdminSchema = adminSchema.partial().refine(refineInput);

export const doctorSchema = z
  .object({
    username: z
      .string()
      .trim()
      .min(MIN_USERNAME)
      .max(MAX_USERNAME)
      .regex(REGEX_USERNAME),
    password: z.string().min(MIN_PASSWORD).max(MAX_PASSWORD),
    email: z.preprocess((field) => {
      if (field === undefined) return undefined;
      if (typeof field !== "string" || field.trim() === "") return null;
      return field;
    }, z.string().trim().email().toLowerCase().nullable().optional()),
    prefix: z.string().trim().min(1),
    firstName: z.string().trim().min(1).regex(REGEX_FIRSTNAME),
    lastName: z.string().trim().min(1).regex(REGEX_LASTNAME),
  })
  .strict();

export const partialDoctorSchema = doctorSchema.partial().refine(refineInput);

export const patientSchema = z
  .object({
    username: z
      .string()
      .trim()
      .min(MIN_USERNAME)
      .max(MAX_USERNAME)
      .regex(REGEX_USERNAME)
      .optional(),
    password: z.string().min(MIN_PASSWORD).max(MAX_PASSWORD).optional(),
    email: z.preprocess((field) => {
      if (field === undefined) return undefined;
      if (typeof field !== "string" || field.trim() === "") return null;
      return field;
    }, z.string().trim().email().toLowerCase().nullable().optional()),
    prefix: z.string().trim().min(1, "Prefix is required"),
    firstName: z
      .string()
      .trim()
      .min(1, "First name is required")
      .regex(REGEX_FIRSTNAME, "First name must be alphabetical"),
    lastName: z
      .string()
      .trim()
      .min(1, "Last name is required")
      .regex(REGEX_LASTNAME, "Last name must be alphabetical"),
    ssn: z
      .string()
      .trim()
      .min(1, "SSN is required")
      .regex(REGEX_SSN, "SSN must be numerical"),
    gender: z.nativeEnum(Gender, { required_error: "Gender is required" }), //
    birthDate: z
      .date({ required_error: "Birth date is required" }) //
      .or(z.string().datetime()),
    ethnicity: z.preprocess((field) => {
      if (field === undefined) return undefined;
      if (typeof field !== "string" || field.trim() === "") return null;
      return field;
    }, z.string().trim().nullable().optional()),
    medicalConditionIds: z.array(z.number()).optional(),
  })
  .strict();

export const partialPatientSchema = patientSchema.partial().refine(refineInput);

export const probioticBrandSchema = z.object({
  name: z.string().min(1),
});

export const partialProbioticBrandSchema = probioticBrandSchema
  .partial()
  .refine(refineInput);

export const probioticRecordSchema = z
  .object({
    doctorId: z.string().cuid(),
    patientId: z.string().cuid(),
    fileId: z.string().cuid().nullable().optional(),
    result: z.record(z.string().min(1), z.number()),
  })
  .strict();

export const partialProbioticRecordSchema = probioticRecordSchema
  .partial()
  .refine(refineInput);

export const fileSchema = z.custom<File>().superRefine((file, ctx) => {
  if (file?.type !== csvFileType) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Only .csv files are accepted.",
    });
  }
  if (file?.size > 2 << 20) {
    ctx.addIssue({
      code: z.ZodIssueCode.too_big,
      type: "array",
      message: "Maximum file size is 1 MB.",
      maximum: 2 << 20, // 1 MB
      inclusive: true,
    });
  }
});

// RELATIONS
export const addPatientMedicalConditionSchema = z
  .object({
    medicalConditionId: z.number().int(),
  })
  .strict();

export const addProbioticRecordProbioticBrandSchema = z
  .object({
    probioticBrandId: z.number().int(),
  })
  .strict();

// USE CASES
export const loginSchema = z
  .object({
    username: z
      .string()
      .trim()
      .min(MIN_USERNAME)
      .max(MAX_USERNAME)
      .regex(REGEX_USERNAME),
    password: z.string().min(MIN_PASSWORD).max(MAX_PASSWORD),
  })
  .strict();

export const uploadFileSchema = z.object({
  fileList: z.custom<FileList>().superRefine((fileList, ctx) => {
    const file = fileList && fileList.length !== 0 ? fileList[0] : undefined;
    if (!file) return;
    if (![csvFileType, xlsFileType, xlsxFileType].includes(file.type)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Only .csv, .xls, and .xlsx files are accepted",
      });
    }
    if (file.size > 2 << 20) {
      ctx.addIssue({
        code: z.ZodIssueCode.too_big,
        type: "array",
        message: "Maximum file size is 1 MB",
        maximum: 2 << 20, // 1 MB
        inclusive: true,
      });
    }
  }),
});
