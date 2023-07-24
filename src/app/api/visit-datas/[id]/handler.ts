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
    const id = z.string().cuid().parse(ctx.params.id);
    const probioticRecord = await prisma.visitData.findUnique({
      where: {
        id,
      },
    });
    if (probioticRecord === null) {
      return new ApiResponse("Probiotic record not found", { status: 404 });
    }
    const response = await fn(req, ctx);
    return response;
  });
}
