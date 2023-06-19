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
    const id = ctx.params.id;
    const brandId = z.number().int().parse(parseInt(ctx.params["brand-id"]));

    const medicalCondition =
      await prisma.probioticBrandProbioticRecord.findUnique({
        where: {
          probioticBrandId_probioticRecordId: {
            probioticBrandId: brandId,
            probioticRecordId: id,
          },
        },
      });
    if (medicalCondition === null) {
      return new ApiResponse("Probiotic brand not found", { status: 404 });
    }
    const response = await handler(req, ctx);
    return response;
  });

  return validated;
}
