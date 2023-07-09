import { type PartialUserInfo, type UserType } from "@/types/user";
import { type Doctor } from "@prisma/client";

export type DoctorInfo = { type: UserType.Doctor } & PartialUserInfo &
  Omit<Doctor, "userId">;

export type DoctorRow = {
  userId: string;
  name: string;
};
