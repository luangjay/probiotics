import { Gender } from "@prisma/client";
import { z } from "zod";

import { csvFileType, xlsFileType, xlsxFileType } from "@/lib/s3";

export const MIN_USERNAME = 4;
export const MIN_PASSWORD = 4;
export const MAX_USERNAME = 16;
export const MAX_PASSWORD = 16;
export const REGEX_USERNAME = /^[a-zA-Z0-9_.]*$/;
export const REGEX_FIRSTNAME = /^[a-zA-Z]+$/;
export const REGEX_LASTNAME = /^[a-zA-Z]+$/;
export const REGEX_SSN = /^\d+$/;
export const PATTERN_USERNAME = "^[a-zA-Z0-9_.]*$";
export const PATTERN_SSN = "^[0-9]+$";
export const ENUM_GENDER = ["Male", "Female", "Others"] as const;

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

export const updateAdminSchema = z
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
    prefix: z.string().trim().min(1).optional(),
    firstName: z.string().trim().min(1).regex(REGEX_FIRSTNAME).optional(),
    lastName: z.string().trim().min(1).regex(REGEX_LASTNAME).optional(),
  })
  .strict();

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

export const updateDoctorSchema = z
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
    prefix: z.string().trim().min(1).optional(),
    firstName: z.string().trim().min(1).regex(REGEX_FIRSTNAME).optional(),
    lastName: z.string().trim().min(1).regex(REGEX_LASTNAME).optional(),
  })
  .strict();

export const patientSchema = z
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
    firstName: z.string().trim().min(1).regex(REGEX_LASTNAME),
    lastName: z.string().trim().min(1).regex(REGEX_LASTNAME),
    ssn: z.string().trim().min(1).regex(REGEX_SSN),
    gender: z.nativeEnum(Gender),
    birthDate: z.date().or(z.string().datetime()),
    ethnicity: z.string().trim().min(1).nullable().optional(),
  })
  .strict();

export const updatePatientSchema = z
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
    prefix: z.string().trim().min(1).optional(),
    firstName: z.string().trim().min(1).regex(REGEX_FIRSTNAME).optional(),
    lastName: z.string().trim().min(1).regex(REGEX_LASTNAME).optional(),
    ssn: z.string().trim().min(1).regex(REGEX_SSN).optional(),
    gender: z.nativeEnum(Gender).optional(),
    birthDate: z.string().datetime().optional(),
    ethnicity: z.string().trim().min(1).nullable().optional(),
  })
  .strict();

export const addPatientMedicalConditionSchema = z
  .object({
    medicalConditionId: z.number().int(),
  })
  .strict();

export const resultSchema = z.array(
  z
    .object({
      key: z.string(),
      value: z.number(),
    })
    .strict()
);

export const probioticRecordSchema = z
  .object({
    doctorId: z.string().cuid(),
    patientId: z.string().cuid(),
    fileId: z.string().cuid().nullable().optional(),
    result: resultSchema,
  })
  .strict();

export const updateProbioticRecordSchema = z
  .object({
    doctorId: z.string().cuid().optional(),
    patientId: z.string().cuid().optional(),
    fileId: z.string().cuid().nullable().optional(),
    result: resultSchema,
  })
  .strict();

export const addProbioticRecordProbioticBrandSchema = z
  .object({
    probioticBrandId: z.number().int(),
  })
  .strict();

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

export const uploadSheetSchema = z.object({
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
