import { ApiResponse } from "@/types/api";
import prisma from "@/lib/prisma";

import { validator } from "./validator";

const DELETE = validator(async (req, ctx) => {
  // Validate the request body against the schema
  const userId = ctx.params["user-id"];
  const id = parseInt(ctx.params.id);

  await prisma.medicalConditionPatient.delete({
    where: {
      medicalConditionId_patientId: {
        medicalConditionId: id,
        patientId: userId,
      },
    },
    include: {
      medicalCondition: true,
    },
  });

  return ApiResponse.json(null);
});

export { DELETE };
