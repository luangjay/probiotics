import { prisma } from "@/server/db";
import { ApiResponse } from "@/types/rest";
import { validator } from "./validator";

const DELETE = validator(async (req, ctx) => {
  // Validate the request body against the schema
  const userId = ctx.params["user-id"];
  const conditionId = parseInt(ctx.params["condition-id"]);

  await prisma.medicalConditionPatient.delete({
    where: {
      medicalConditionId_patientId: {
        medicalConditionId: conditionId,
        patientId: userId,
      },
    },
  });

  return ApiResponse.json(null);
});

export { DELETE };
