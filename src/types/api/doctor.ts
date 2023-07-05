import { type Doctor } from "@prisma/client";
import { type PartialUserInfo, type UserType } from "./user";

export type DoctorInfo = { type: UserType.Doctor } & PartialUserInfo &
  Omit<Doctor, "userId">;
