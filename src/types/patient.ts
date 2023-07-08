import { type ProbioticRecordWithDoctor } from "@/types/probiotic-record";
import { type PartialUserInfo, type UserType } from "@/types/user";
import {
  type Gender,
  type MedicalCondition,
  type Patient,
  type ProbioticBrand,
} from "@prisma/client";

// Special types
export type PatientInfo = { type: UserType.Patient } & PartialUserInfo &
  Omit<Patient, "userId">;

export type PatientWithComputed = PatientInfo & {
  fullName: string;
};

export type PatientRow = {
  id: string;
  ssn: string;
  name: string;
  gender: Gender;
  birthDate: Date;
  ethnicity: string | null;
  medicalConditions: MedicalCondition[];
};

export type PatientWithAll = PatientWithComputed & {
  probioticRecords: (ProbioticRecordWithDoctor & {
    probioticBrands: ProbioticBrand[];
  })[];
  medicalConditions: MedicalCondition[];
};
