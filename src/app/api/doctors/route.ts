import { saltHashPassword } from "@/lib/auth";
import { doctorSchema } from "@/lib/schema";
import { prisma } from "@/server/db";
import { ApiResponse } from "@/types/api";
import { UserType } from "@/types/user";
import { validator } from "../validator";

const GET = validator(async () => {
  const doctors = await prisma.doctor.findMany({
    include: {
      user: true,
    },
  });

  return ApiResponse.json(
    doctors.map((doctor) => {
      const { user, userId, ...doctorInfo } = doctor;
      const { password, salt, ...userInfo } = user;
      return {
        type: UserType.Doctor,
        ...userInfo,
        ...doctorInfo,
      };
    })
  );
});

const POST = validator(async (req) => {
  // Validate the request body against the schema
  const body: unknown = await req.json();
  const { ..._userInfo } = doctorSchema.parse(body);

  const doctor = await prisma.doctor.create({
    data: {
      user: {
        create: {
          ..._userInfo,
          ...saltHashPassword(_userInfo.password),
        },
      },
    },
    include: {
      user: true,
    },
  });

  const { user, userId, ...doctorInfo } = doctor;
  const { password, salt, ...userInfo } = user;
  return ApiResponse.json({
    type: UserType.Doctor,
    ...userInfo,
    ...doctorInfo,
  });
});

export { GET, POST };
