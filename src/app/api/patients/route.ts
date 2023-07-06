import { saltHashPassword } from "@/lib/auth";
import { patientSchema } from "@/lib/schema";
import { prisma } from "@/server/db";
import { UserType } from "@/types/api/user";
import { ApiResponse } from "@/types/rest";
import slugid from "slugid";
import { handler } from "../handler";

const GET = handler(async () => {
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

const POST = handler(async (req) => {
  // Validate the request body against the schema
  const body: unknown = await req.json();
  const {
    ssn,
    gender,
    birthDate,
    ethnicity,
    medicalConditionIds,
    username: pUsername = slugid.nice(),
    password: pPassword = slugid.v4(),
    ...pUser
  } = patientSchema.parse(body);

  const patient = await prisma.$transaction(async (tx) => {
    const txPatient = await tx.patient.create({
      data: {
        user: {
          create: {
            ...pUser,
            ...saltHashPassword(pPassword),
            username: pUsername,
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
    if (medicalConditionIds !== undefined) {
      await Promise.all(
        medicalConditionIds.map((medicalConditionId) => {
          // Create medical condition patient
          return tx.medicalConditionPatient.create({
            data: { medicalConditionId, patientId: txPatient.userId },
          });
        })
      );
    }
    return txPatient;
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
