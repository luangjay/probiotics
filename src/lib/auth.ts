import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { compareSync, genSaltSync, hashSync } from "bcrypt-ts";
import { getServerSession, type NextAuthOptions, type User } from "next-auth";
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
        token.type = u.type;
        token.sub = u.id;
        token.name = u.username;
        token.email = u.email;
      }
      return token;
    },
    async session({ token, session }) {
      const { sub: id } = token;
      const currentUser = await getCurrentUser({ id });
      if (currentUser !== null) {
        session.user = currentUser;
      }
      return session;
    },
  },
};

export async function getSessionUser() {
  const session = await getServerSession(authOptions);
  return session?.user;
}

export function saltHashPassword(password: string) {
  const saltRounds = 10;
  const salt = genSaltSync(saltRounds);
  const hash = hashSync(password, salt);
  return { password: hash, salt };
}

interface GetCurrentUserInput {
  id?: string;
  username?: string;
  password?: string;
}

async function getCurrentUser({
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
