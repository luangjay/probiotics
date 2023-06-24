import type { Admin, Doctor, Patient, User } from "@prisma/client";

export enum UserType {
  Doctor = "Doctor",
  Patient = "Patient",
  Admin = "Admin",
}

export type PartialUserInfo = Omit<
  User,
  "password" | "salt" | "createdAt" | "updatedAt"
>;

export type AdminInfo = { type: UserType.Admin } & PartialUserInfo &
  Omit<Admin, "userId">;

export type DoctorInfo = { type: UserType.Doctor } & PartialUserInfo &
  Omit<Doctor, "userId">;

export type PatientInfo = { type: UserType.Patient } & PartialUserInfo &
  Omit<Patient, "userId">;

export type UserInfo = AdminInfo | DoctorInfo | PatientInfo;
