import { saltHashPassword } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { doctorSchema } from "@/lib/schema";
import { ApiResponse } from "@/types/rest";
import { UserType } from "@/types/user";
import { handler } from "../handler";

const GET = handler(async () => {
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

const POST = handler(async (req) => {
  // Validate the request body against the schema
  const body: unknown = await req.json();
  const { ...pUser } = doctorSchema.parse(body);

  const doctor = await prisma.doctor.create({
    data: {
      user: {
        create: {
          ...pUser,
          ...saltHashPassword(pUser.password),
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
