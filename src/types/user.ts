import type { User, Doctor, Patient } from "@prisma/client";

export enum UserType {
  Doctor = "Doctor",
  Patient = "Patient",
}

export type PartialUser = Omit<
  User,
  "password" | "salt" | "createdAt" | "updatedAt"
>;

export type PartialDoctor = Omit<Doctor, "userId">;

export type PartialPatient = Omit<Patient, "userId">;

export type UserSubType =
  | ({ type: UserType.Doctor } & PartialDoctor)
  | ({ type: UserType.Patient } & PartialPatient);
