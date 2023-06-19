import { z } from "zod";

import {
  ApiResponse,
  type ApiContext,
  type ApiHandler,
  type ApiRequest,
} from "@/types/api";
import prisma from "@/lib/prisma";

import { validator as baseValidator } from "../../validator";

export function validator(handler: ApiHandler) {
  const validated = baseValidator(async (req: ApiRequest, ctx: ApiContext) => {
    const userId = ctx.params["user-id"];
    const conditionId = z
      .number()
      .int()
      .parse(parseInt(ctx.params["condition-id"]));

    const medicalCondition = await prisma.medicalConditionPatient.findUnique({
      where: {
        medicalConditionId_patientId: {
          medicalConditionId: conditionId,
          patientId: userId,
        },
      },
    });
    if (medicalCondition === null) {
      return new ApiResponse("Medical condition not found", { status: 404 });
    }
    const response = await handler(req, ctx);
    return response;
  });

  return validated;
}
