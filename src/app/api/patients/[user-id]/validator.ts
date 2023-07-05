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
    const userId = z.string().cuid().parse(ctx.params["user-id"]);
    const patient = await prisma.patient.findUnique({
      where: {
        userId,
      },
    });
    if (patient === null) {
      return new ApiResponse("Patient not found", { status: 404 });
    }
    const response = await handler(req, ctx);
    return response;
  });

  return validated;
}
