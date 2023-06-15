import type { UserInfo, UserTypeInfo } from "./user";

declare module "next-auth/jwt" {
  interface JWT extends Record<string, unknown> {
    name?: string | null;
    email?: string | null;
    picture?: string | null;
    sub?: string;
  }
}

declare module "next-auth" {
  interface Session {
    user?: UserInfo & UserTypeInfo;
  }

  interface User {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  }
}
