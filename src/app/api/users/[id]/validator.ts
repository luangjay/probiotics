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
    const id = z.string().cuid().parse(ctx.params.id);
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    });
    if (user === null) {
      return new ApiResponse("User not found", { status: 404 });
    }
    const response = await handler(req, ctx);
    return response;
  });

  return validated;
}
