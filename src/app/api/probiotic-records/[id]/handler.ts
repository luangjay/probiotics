import { prisma } from "@/server/db";
import { UserType } from "@/types/api/user";
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
    const id = z.string().cuid().parse(ctx.params.id);
    const probioticRecord = await prisma.probioticRecord.findUnique({
      where: {
        id,
      },
    });
    if (probioticRecord === null) {
      return new ApiResponse("Probiotic record not found", { status: 404 });
    }
    if (
      Object.keys(ctx.params).length === 1 &&
      ["POST", "PUT", "DELETE"].includes(req.method) &&
      req.token?.type !== UserType.Admin &&
      req.token?.sub !== probioticRecord.doctorId
    ) {
      return new ApiResponse("Unauthorized", { status: 401 });
    }

    const response = await fn(req, ctx);
    return response;
  });
}
