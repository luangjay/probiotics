import { type ProbioticRecordWithDoctor } from "@/types/api/probiotic-record";
import { type PartialUserInfo, type UserType } from "@/types/api/user";
import { type MedicalCondition, type Patient } from "@prisma/client";

export type PatientInfo = { type: UserType.Patient } & PartialUserInfo &
  Omit<Patient, "userId">;

export type PatientWithComputed = PatientInfo & {
  fullName: string;
};

export type PatientRow = PatientWithComputed & {
  medicalConditions: MedicalCondition[];
}

export type PatientWithAll = PatientWithComputed & {
  probioticRecords: ProbioticRecordWithDoctor[];
  medicalConditions: MedicalCondition[];
};
