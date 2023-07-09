import { prisma } from "@/lib/prisma";
import {
  ApiResponse,
  type ApiContext,
  type ApiHandler,
  type ApiRequest,
} from "@/types/api";
import { z } from "zod";
import { handler as baseHandler } from "../../handler";

export function handler(fn: ApiHandler) {
  return baseHandler(async (req: ApiRequest, ctx: ApiContext) => {
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
    const response = await fn(req, ctx);
    return response;
  });
}
