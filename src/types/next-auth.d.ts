import type { PartialUser, UserSubType } from "./user";

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
    user?: PartialUser & UserSubType;
  }

  type User = PartialUser & UserSubType;
}
