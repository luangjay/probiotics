import { saltHashPassword } from "@/lib/auth";
import { patientSchema } from "@/lib/schema";
import { prisma } from "@/server/db";
import { UserType } from "@/types/api/user";
import { ApiResponse } from "@/types/rest";
import { validator } from "../validator";

const GET = validator(async () => {
  const patients = await prisma.patient.findMany({
    include: {
      user: true,
    },
  });

  return ApiResponse.json(
    patients.map((patient) => {
      const { user, userId, ...patientInfo } = patient;
      const { password, salt, ...userInfo } = user;
      return {
        type: UserType.Patient,
        ...userInfo,
        ...patientInfo,
      };
    })
  );
});

const POST = validator(async (req) => {
  // Validate the request body against the schema
  const body: unknown = await req.json();
  const { ssn, gender, birthDate, ethnicity, ...pUser } =
    patientSchema.parse(body);

  const patient = await prisma.patient.create({
    data: {
      user: {
        create: {
          ...pUser,
          ...saltHashPassword(pUser.password),
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

  const { user, userId, ...patientInfo } = patient;
  const { password, salt, ...userInfo } = user;
  return ApiResponse.json({
    type: UserType.Patient,
    ...userInfo,
    ...patientInfo,
  });
});

export { GET, POST };
