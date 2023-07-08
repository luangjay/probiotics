import { prisma } from "@/lib/prisma";
import {
  ApiResponse,
  type ApiContext,
  type ApiHandler,
  type ApiRequest,
} from "@/types/rest";
import { z } from "zod";
import { handler as baseHandler } from "../../handler";

export function handler(fn: ApiHandler) {
  return baseHandler(async (req: ApiRequest, ctx: ApiContext) => {
    const id = z.number().int().parse(parseInt(ctx.params.id));
    const probioticBrand = await prisma.probioticBrand.findUnique({
      where: {
        id,
      },
    });
    if (probioticBrand === null) {
      return new ApiResponse("Probiotic not found", { status: 404 });
    }
    const response = await fn(req, ctx);
    return response;
  });
}
