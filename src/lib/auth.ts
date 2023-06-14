import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { compareSync, genSaltSync, hashSync } from "bcrypt-ts";
import type { NextAuthOptions, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import { UserType } from "@/types/user";
import { prisma } from "@/lib/prisma";

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
        const currentUser = await getCurrentUser(username, password);
        return currentUser;
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        const u = user as User;
        token = { ...token, id: u.id, name: u.username };
        console.log(token);
      }
      return token;
    },
    async session({ token, session }) {
      const { name: username } = token;
      if (username) {
        const user = await getCurrentUser(username);
        if (user) {
          session.user = user;
        }
      }
      return session;
    },
  },
};

export async function getCurrentUser(
  username: string,
  password?: string
): Promise<User | null> {
  const user = await prisma.user.findUnique({
    where: {
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
