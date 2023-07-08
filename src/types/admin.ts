import { type PartialUserInfo, type UserType } from "@/types/user";
import { type Admin } from "@prisma/client";

export type AdminInfo = { type: UserType.Admin } & PartialUserInfo &
  Omit<Admin, "userId">;
