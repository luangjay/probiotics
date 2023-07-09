import { prisma } from "@/lib/prisma";
import { UserType } from "@/types/user";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { type PrismaClient } from "@prisma/client";
import { compareSync, genSaltSync, hashSync } from "bcrypt-ts";
import { getServerSession, type NextAuthOptions, type User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  adapter: PrismaAdapter(prisma as unknown as PrismaClient),
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
        const u = await authorizeUser({ username, password });
        return u;
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      const u = user as User;
      if (u) {
        token.type = u.type;
        token.sub = u.id;
        token.name = u.username;
        token.email = u.email;
      }
      return token;
    },
    async session({ token, session }) {
      const { sub: id } = token;
      const u = await authorizeUser({ id });
      if (u !== null) {
        session.user = u;
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

async function authorizeUser({
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
      admin: true,
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
    admin,
    doctor,
    patient,
    password: _password,
    salt: _salt,
    createdAt,
    updatedAt,
    ...userInfo
  } = user;

  if (admin !== null) {
    const { userId, ...adminInfo } = admin;
    return {
      type: UserType.Admin,
      ...userInfo,
      ...adminInfo,
    };
  }
  if (doctor !== null) {
    const { userId, ...doctorInfo } = doctor;
    return {
      type: UserType.Doctor,
      ...userInfo,
      ...doctorInfo,
    };
  }
  if (patient !== null) {
    const { userId, ...patientInfo } = patient;
    return {
      type: UserType.Patient,
      ...userInfo,
      ...patientInfo,
    };
  }
  throw new Error("User type not found");
}

export async function getCurrentUser() {
  const session = await getServerSession(authOptions);
  return session?.user;
}

export function saltHashPassword(password: string) {
  const saltRounds = 10;
  const salt = genSaltSync(saltRounds);
  const hash = hashSync(password, salt);
  return { password: hash, salt };
}
