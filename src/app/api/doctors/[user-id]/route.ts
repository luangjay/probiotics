import { saltHashPassword } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { partialDoctorSchema } from "@/lib/schema";
import { ApiResponse } from "@/types/rest";
import { UserType } from "@/types/user";
import { handler } from "./handler";

const GET = handler(async (req, ctx) => {
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

const PUT = handler(async (req, ctx) => {
  const userId = ctx.params["user-id"];
  if (req.token?.type !== UserType.Admin && req.token?.sub !== userId) {
    return new ApiResponse("Unauthorized", { status: 401 });
  }

  // Validate the request body against the schema
  const body: unknown = await req.json();
  const { ...pUser } = partialDoctorSchema.parse(body);

  const doctor = await prisma.doctor.update({
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

const DELETE = handler(async (req, ctx) => {
  const userId = ctx.params["user-id"];
  if (req.token?.type !== UserType.Admin && req.token?.sub !== userId) {
    return new ApiResponse("Unauthorized", { status: 401 });
  }

  await prisma.user.delete({
    where: {
      id: userId,
    },
  });

  return ApiResponse.json(null);
});

export { DELETE, GET, PUT };
