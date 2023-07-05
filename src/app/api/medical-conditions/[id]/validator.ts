import { prisma } from "@/server/db";
import {
  ApiResponse,
  type ApiContext,
  type ApiHandler,
  type ApiRequest,
} from "@/types/rest";
import { z } from "zod";
import { validator as baseValidator } from "../../validator";

export function validator(handler: ApiHandler) {
  const validated = baseValidator(async (req: ApiRequest, ctx: ApiContext) => {
    const id = z.number().int().parse(parseInt(ctx.params.id));
    const medicalCondition = await prisma.medicalCondition.findUnique({
      where: {
        id,
      },
    });
    if (medicalCondition === null) {
      return new ApiResponse("Probiotic not found", { status: 404 });
    }
    const response = await handler(req, ctx);
    return response;
  });

  return validated;
}
