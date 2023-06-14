import type { UserInfo, UserTypeInfo } from "./user";

declare module "next-auth/jwt" {
  interface JWT {
    id: string;

    // Default JWT properties
    sub: string;
    iat: number;
    exp: number;
    jti: string;
  }
}

declare module "next-auth" {
  interface Session {
    user?: UserInfo & UserTypeInfo;
  }

  type User = UserInfo & UserTypeInfo;
}
