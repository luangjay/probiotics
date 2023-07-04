import { prisma } from "@/server/db";
import {
  ApiResponse,
  type ApiContext,
  type ApiHandler,
  type ApiRequest,
} from "@/types/api";
import { UserType } from "@/types/user";
import { z } from "zod";
import { validator as baseValidator } from "../../validator";

export function validator(handler: ApiHandler) {
  const validated = baseValidator(async (req: ApiRequest, ctx: ApiContext) => {
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

    const response = await handler(req, ctx);
    return response;
  });

  return validated;
}
