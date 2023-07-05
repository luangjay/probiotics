import { type AdminInfo } from "@/types/api/admin";
import { type DoctorInfo } from "@/types/api/doctor";
import { type PatientInfo } from "@/types/api/patient";
import { type User } from "@prisma/client";

export enum UserType {
  Doctor = "Doctor",
  Patient = "Patient",
  Admin = "Admin",
}

export type PartialUserInfo = Omit<
  User,
  "password" | "salt" | "createdAt" | "updatedAt"
>;

export type UserInfo = AdminInfo | DoctorInfo | PatientInfo;
