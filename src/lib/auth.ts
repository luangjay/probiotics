import { PrismaAdapter } from "@next-auth/prisma-adapter";
import type { NextAuthOptions, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "./prisma";
import { compareSync, genSaltSync, hashSync } from "bcrypt-ts";
import { UserType } from "@/types/user";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  pages: {
    // signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "admin" },
        password: { label: "Password", type: "password", placeholder: "1234" },
      },
      async authorize(credentials) {
        if (credentials === undefined) return null;
        // const authUser = await authenticate(username, password);
        const user = await prisma.user.findUnique({
          where: {
            username: credentials.username,
          },
          include: {
            doctor: true,
            patient: true,
          },
        });

        // if (
        //   user === null ||
        //   !compareSync(credentials.password, user.password)
        // )
        // return null;
        if (user === null) return null;
        const {
          doctor,
          patient,
          password,
          createdAt,
          updatedAt,
          ...partialUser
        } = user;

        if (doctor) {
          const { userId, ...partialDoctor } = doctor;
          return {
            type: UserType.Doctor,
            ...partialUser,
            ...partialDoctor,
          };
        } else if (patient) {
          const { userId, ...partialPatient } = patient;
          return {
            type: UserType.Patient,
            ...partialUser,
            ...partialPatient,
          };
        } else {
          throw new Error("User type not found");
        }
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        const u = user as User;
        token.id = u.id;
        token.username = u.username;
        token = { ...u, ...token };
      }
      return token;
    },
    session({ token, session }) {
      if (session.user) {
        const { sub, iat, exp, jti, ...partialToken } = token;
        session.user = partialToken;
      }
      return session;
    },
  },
};

export function saltHashPassword(password: string) {
  const saltRounds = 10;
  const salt = genSaltSync(saltRounds);
  const hash = hashSync(password, salt);
  return { salt: salt, hash: hash };
}
