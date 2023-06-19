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
    const id = z
      .number()
      .int()
      .parse(parseInt(ctx.params.id as string));
    const probiotic = await prisma.probiotic.findUnique({
      where: {
        id,
      },
    });
    if (probiotic === null) {
      return new ApiResponse("Probiotic not found", { status: 404 });
    }
    const response = await handler(req, ctx);
    return response;
  });

  return validated;
}
