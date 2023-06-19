import { ApiResponse } from "@/types/api";
import { UserType } from "@/types/user";
import { saltHashPassword } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { updateDoctorSchema } from "@/lib/schema";

import { validator } from "./validator";

const GET = validator(async (req, ctx) => {
  const userId = ctx.params["user-id"];

  const doctor = await prisma.doctor.findUniqueOrThrow({
    where: {
      userId,
    },
    include: {
      user: true,
    },
  });

  const { user, userId: _, ...doctorInfo } = doctor;
  const { password, salt, ...userInfo } = user;
  return ApiResponse.json({
    type: UserType.Doctor,
    ...userInfo,
    ...doctorInfo,
  });
});

const PUT = validator(async (req, ctx) => {
  // Validate the request body against the schema
  const body: unknown = await req.json();
  const { ..._userInfo } = updateDoctorSchema.parse(body);
  const userId = ctx.params["user-id"];

  const doctor = await prisma.doctor.update({
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
    },
    include: {
      user: true,
    },
  });

  const { user, userId: _, ...doctorInfo } = doctor;
  const { password, salt, ...userInfo } = user;
  return ApiResponse.json({
    type: UserType.Doctor,
    ...userInfo,
    ...doctorInfo,
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
