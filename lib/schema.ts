import { Gender } from "@prisma/client";
import { z } from "zod";

import { csvFileType, xlsFileType, xlsxFileType } from "./utils";

export const MIN_USERNAME = 4;
export const MIN_PASSWORD = 4;
export const MAX_USERNAME = 16;
export const MAX_PASSWORD = 16;
export const REGEX_USERNAME = /^[a-zA-Z0-9_.]*$/;
export const REGEX_SSN = /^\d+$/;
export const PATTERN_USERNAME = "^[a-zA-Z0-9_.]*$";
export const PATTERN_SSN = "^[0-9]+$";
export const ENUM_GENDER = ["Male", "Female", "Others"];

export const createAdminSchema = z
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
    firstName: z.string().trim().min(1),
    lastName: z.string().trim().min(1),
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
    firstName: z.string().trim().min(1).optional(),
    lastName: z.string().trim().min(1).optional(),
  })
  .strict();

export const createDoctorSchema = z
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
    firstName: z.string().trim().min(1),
    lastName: z.string().trim().min(1),
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
    firstName: z.string().trim().min(1).optional(),
    lastName: z.string().trim().min(1).optional(),
  })
  .strict();

export const createPatientSchema = z
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
    firstName: z.string().trim().min(1),
    lastName: z.string().trim().min(1),
    ssn: z.string().trim().min(1).regex(REGEX_SSN),
    gender: z.nativeEnum(Gender),
    birthDate: z.string().datetime(),
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
    firstName: z.string().trim().min(1).optional(),
    lastName: z.string().trim().min(1).optional(),
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

export const createProbioticRecordSchema = z
  .object({
    doctorId: z.string().cuid(),
    patientId: z.string().cuid(),
    fileId: z.string().cuid().nullable().optional(),
    result: z.record(z.string(), z.number()),
  })
  .strict();

export const updateProbioticRecordSchema = z
  .object({
    doctorId: z.string().cuid().optional(),
    patientId: z.string().cuid().optional(),
    fileId: z.string().cuid().nullable().optional(),
    result: z.record(z.string(), z.number()).optional(),
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

export const loginSchema = z.object({
  username: z
    .string()
    .trim()
    .min(MIN_USERNAME)
    .max(MAX_USERNAME)
    .regex(REGEX_USERNAME),
  password: z.string().min(MIN_PASSWORD).max(MAX_PASSWORD),
});

export const uploadFileSchema = z.object({
  fileList: z.custom<FileList>().superRefine((fileList, ctx) => {
    const file = fileList && fileList.length !== 0 ? fileList[0] : undefined;
    if (!file) {
      return ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Only .csv files are accepted.",
      });
    }
    if (![csvFileType, xlsFileType, xlsxFileType].includes(file.type)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Only .csv, .xls, and .xlsx files are accepted.",
      });
    }
    if (file.size > 2 << 20) {
      ctx.addIssue({
        code: z.ZodIssueCode.too_big,
        type: "array",
        message: "Maximum file size is 1 MB.",
        maximum: 2 << 20, // 1 MB
        inclusive: true,
      });
    }
  }),
});
