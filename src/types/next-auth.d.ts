import type { JWT } from "next-auth/jwt";
import type { User } from "next-auth";
import type { PartialUser, UserSubType } from "./user";

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  type JWT = PartialUser &
    UserSubType & {
      // Default JWT properties
      sub: string;
      iat: number;
      exp: number;
      jti: string;
    };
}

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user?: PartialUser & UserSubType;
  }

  type User = PartialUser & UserSubType;
}
