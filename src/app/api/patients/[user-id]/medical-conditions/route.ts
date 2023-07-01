import { ApiResponse } from "@/types/api";
import prisma from "@/lib/prisma";
import { addPatientMedicalConditionSchema } from "@/lib/schema";

import { validator } from "../validator";

const GET = validator(async (req, ctx) => {
  const userId = ctx.params["user-id"];

  const medicalConditionPatient = await prisma.medicalConditionPatient.findMany(
    {
      where: {
        patientId: userId,
      },
      include: {
        medicalCondition: true,
      },
    }
  );

  return ApiResponse.json(
    medicalConditionPatient.map((m21t) => m21t.medicalCondition)
  );
});

const POST = validator(async (req, ctx) => {
  const userId = ctx.params["user-id"];

  // Validate the request body against the schema
  const body: unknown = await req.json();
  const medicalConditionInfo = addPatientMedicalConditionSchema.parse(body);

  const { medicalCondition } = await prisma.medicalConditionPatient.create({
    data: {
      patientId: userId,
      ...medicalConditionInfo,
    },
    include: {
      medicalCondition: true,
    },
  });

  return ApiResponse.json(medicalCondition);
});

export { GET, POST };