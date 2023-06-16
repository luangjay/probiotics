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
        const currentUser = await getCurrentUser({ username, password });
        return currentUser;
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      const u = user as User;
      if (u) {
        token.sub = u.id;
        token.name = u.username;
        token.email = u.email;
      }
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
  ) {
    return null;
  }
  const {
    doctor,
    patient,
    password: _password,
    salt: _salt,
    createdAt,
    updatedAt,
    ...userInfo
  } = user;

  if (doctor !== null) {
    const { userId, ...doctorInfo } = doctor;
    return {
      type: UserType.Doctor,
      ...userInfo,
      ...doctorInfo,
    };
  } else if (patient !== null) {
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
