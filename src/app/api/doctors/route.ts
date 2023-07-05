import { saltHashPassword } from "@/lib/auth";
import { doctorSchema } from "@/lib/schema";
import { prisma } from "@/server/db";
import { UserType } from "@/types/api/user";
import { ApiResponse } from "@/types/rest";
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
