import { ApiResponse } from "@/types/api";
import { UserType } from "@/types/user";
import { saltHashPassword } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { updatePatientSchema } from "@/lib/schema";

import { validator } from "./validator";

const GET = validator(async (req, ctx) => {
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

const PUT = validator(async (req, ctx) => {
  // Validate the request body against the schema
  const userId = ctx.params["user-id"];
  const body: unknown = await req.json();
  const { ssn, gender, birthDate, ethnicity, ..._userInfo } =
    updatePatientSchema.parse(body);

  const patient = await prisma.patient.update({
    where: {
      userId,
    },
    data: {
      user: {
        update: {
          ..._userInfo,
          ...(_userInfo.password && saltHashPassword(_userInfo.password)),
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

const DELETE = validator(async (req, ctx) => {
  const userId = ctx.params["user-id"];

  await prisma.user.delete({
    where: {
      id: userId,
    },
  });

  return ApiResponse.json(null);
});

export { GET, PUT, DELETE };
