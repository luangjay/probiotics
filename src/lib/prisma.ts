import { PrismaClient } from "@prisma/client";

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
//
// Learn more:
// https://pris.ly/d/help/next-js-best-practices

const client = () =>
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  }).$extends({
    result: {
      user: {
        name: {
          needs: { prefix: true, firstName: true, lastName: true },
          compute: (user) =>
            `${user.prefix} ${user.firstName} ${user.lastName}`,
        },
      },
      probiotic: {
        alias: {
          needs: { name: true },
          compute: (probiotic) => probiotic.name.split(";").at(-1) ?? "",
        },
      },
    },
  });

const globalForPrisma = global as unknown as {
  prisma: ReturnType<typeof client>;
};

export const prisma = globalForPrisma.prisma || client();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
