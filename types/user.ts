import type { Admin, Doctor, Patient, User } from "@prisma/client";

export enum UserType {
  Doctor = "Doctor",
  Patient = "Patient",
  Admin = "Admin",
}

export type UserInfo = Omit<
  User,
  "password" | "salt" | "createdAt" | "updatedAt"
>;

export type DoctorInfo = Omit<Doctor, "userId">;

export type PatientInfo = Omit<Patient, "userId">;

export type AdminInfo = Omit<Admin, "userId">;

export type UserTypeInfo =
  | ({ type: UserType.Doctor } & DoctorInfo)
  | ({ type: UserType.Patient } & PatientInfo)
  | ({ type: UserType.Admin } & AdminInfo);
