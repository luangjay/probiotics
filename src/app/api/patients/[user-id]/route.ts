import { saltHashPassword } from "@/lib/auth";
import { partialPatientSchema } from "@/lib/schema";
import { prisma } from "@/server/db";
import { UserType } from "@/types/api/user";
import { ApiResponse } from "@/types/rest";
import { handler } from "./handler";

const GET = handler(async (req, ctx) => {
  const userId = ctx.params["user-id"];

  const patient = await prisma.patient.findUniqueOrThrow({
    where: {
      userId,
    },
    include: {
      user: true,
    },
  });

  const { user, userId: _, ...patientInfo } = patient;
  const { password, salt, ...userInfo } = user;
  return ApiResponse.json({
    type: UserType.Patient,
    ...userInfo,
    ...patientInfo,
  });
});

const PUT = handler(async (req, ctx) => {
  const userId = ctx.params["user-id"];

  // Validate the request body against the schema
  const body: unknown = await req.json();
  const { ssn, gender, birthDate, ethnicity, ...pUser } =
    partialPatientSchema.parse(body);

  const patient = await prisma.patient.update({
    where: {
      userId,
    },
    data: {
      user: {
        update: {
          ...pUser,
          ...(pUser.password && saltHashPassword(pUser.password)),
        },
      },
      ssn,
      gender,
      birthDate,
      ethnicity,
    },
    include: {
      user: true,
    },
  });

  const { user, userId: _, ...patientInfo } = patient;
  const { password, salt, ...userInfo } = user;
  return ApiResponse.json({
    type: UserType.Patient,
    ...userInfo,
    ...patientInfo,
  });
});

const DELETE = handler(async (req, ctx) => {
  const userId = ctx.params["user-id"];

  await prisma.user.delete({
    where: {
      id: userId,
    },
  });

  return ApiResponse.json(null);
});

export { DELETE, GET, PUT };
