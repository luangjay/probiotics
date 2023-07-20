import { prisma } from "@/lib/prisma";
import { ApiResponse } from "@/types/api";
import { handler } from "./handler";

const DELETE = handler(async (req, ctx) => {
  // Validate the request body against the schema
  const userId = ctx.params["user-id"];
  const conditionId = parseInt(ctx.params["medical-condition-id"]);

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
