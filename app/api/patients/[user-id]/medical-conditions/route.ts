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
    medicalConditionPatient.map((mcp) => mcp.medicalCondition)
  );
});

const POST = validator(async (req, ctx) => {
  // Validate the request body against the schema
  const body: unknown = await req.json();
  const medicalConditionInfo = addPatientMedicalConditionSchema.parse(body);
  const userId = ctx.params["user-id"];

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
