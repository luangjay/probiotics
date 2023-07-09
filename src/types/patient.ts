import { type PartialUserInfo, type UserType } from "@/types/user";
import { type Gender, type Patient } from "@prisma/client";
import { type MedicalConditionRow } from "./medical-condition";

// Special types
export type PatientInfo = { type: UserType.Patient } & PartialUserInfo &
  Omit<Patient, "userId">;

export type PatientRow = {
  id: string;
  ssn: string;
  prefix: string;
  firstName: string;
  lastName: string;
  name: string;
  gender: Gender;
  birthDate: Date;
  ethnicity: string | null;
  medicalConditions: MedicalConditionRow[];
};
