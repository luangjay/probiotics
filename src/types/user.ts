import { type AdminInfo } from "@/types/admin";
import { type DoctorInfo } from "@/types/doctor";
import { type PatientInfo } from "@/types/patient";
import { type User } from "@prisma/client";

export enum UserType {
  Doctor = "Doctor",
  Patient = "Patient",
  Admin = "Admin",
}

export type PartialUserInfo = Omit<
  User & { name: string },
  "password" | "salt" | "createdAt" | "updatedAt"
>;

export type UserInfo = AdminInfo | DoctorInfo | PatientInfo;
