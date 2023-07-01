import { z } from "zod";

import {
  ApiResponse,
  type ApiContext,
  type ApiHandler,
  type ApiRequest,
} from "@/types/api";
import { UserType } from "@/types/user";
import prisma from "@/lib/prisma";

import { validator as baseValidator } from "../../validator";

export function validator(handler: ApiHandler) {
  const validated = baseValidator(async (req: ApiRequest, ctx: ApiContext) => {
    const id = ctx.params.id;
    const brandId = z.number().int().parse(parseInt(ctx.params["brand-id"]));

    const probioticBrandProbioticRecord =
      await prisma.probioticBrandProbioticRecord.findUnique({
        where: {
          probioticBrandId_probioticRecordId: {
            probioticBrandId: brandId,
            probioticRecordId: id,
          },
        },
        include: {
          probioticRecord: true,
        },
      });
    if (probioticBrandProbioticRecord === null) {
      return new ApiResponse("Probiotic brand not found", { status: 404 });
    }
    if (
      Object.keys(ctx.params).length === 2 &&
      ["DELETE"].includes(req.method) &&
      req.token?.type !== UserType.Admin &&
      req.token?.sub !== probioticBrandProbioticRecord.probioticRecord.doctorId
    ) {
      return new ApiResponse("Unauthorized", { status: 401 });
    }
    const response = await handler(req, ctx);
    return response;
  });

  return validated;
}