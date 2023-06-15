import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { compareSync, genSaltSync, hashSync } from "bcrypt-ts";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import { UserType, type UserInfo, type UserTypeInfo } from "@/types/user";
import { prisma } from "@/lib/prisma";

type User = UserInfo & UserTypeInfo;

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (credentials === undefined) return null;
        const { username, password } = credentials;
        const currentUser = await getCurrentUser({ username, password });
        if (currentUser === null) return null;
        return { id: currentUser.id };
      },
    }),
  ],
  callbacks: {
    jwt({ token }) {
      return token;
    },
    async session({ token, session }) {
      const { sub: id } = token;
      const user = await getCurrentUser({ id });
      if (user !== null) {
        session.user = user;
      }
      return session;
    },
  },
};

interface GetCurrentUserInput {
  id?: string;
  username?: string;
  password?: string;
}

export async function getCurrentUser({
  id,
  username,
  password,
}: GetCurrentUserInput): Promise<User | null> {
  if (id === undefined && username === undefined) return null;
  const user = await prisma.user.findUnique({
    where: {
      id,
      username,
    },
    include: {
      doctor: true,
      patient: true,
    },
  });

  if (
    user === null ||
    (password !== undefined && !compareSync(password, user.password))
  )
    return null;
  const {
    doctor,
    patient,
    password: _password,
    salt: _salt,
    createdAt,
    updatedAt,
    ...userInfo
  } = user;

  if (doctor) {
    const { userId, ...doctorInfo } = doctor;
    return {
      type: UserType.Doctor,
      ...userInfo,
      ...doctorInfo,
    };
  } else if (patient) {
    const { userId, ...patientInfo } = patient;
    return {
      type: UserType.Patient,
      ...userInfo,
      ...patientInfo,
    };
  } else {
    throw new Error("User type not found");
  }
}

export function saltHashPassword(password: string) {
  const saltRounds = 10;
  const salt = genSaltSync(saltRounds);
  const hash = hashSync(password, salt);
  return { password: hash, salt };
}
