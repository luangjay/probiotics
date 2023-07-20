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
    const id = z.number().int().parse(parseInt(ctx.params.id));
    const probiotic = await prisma.microorgranism.findUnique({
      where: {
        id,
      },
    });
    if (probiotic === null) {
      return new ApiResponse("Microorganism not found", { status: 404 });
    }
    const response = await fn(req, ctx);
    return response;
  });
}
