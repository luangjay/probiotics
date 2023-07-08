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
    const id = z.string().cuid().parse(ctx.params.id);
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    });
    if (user === null) {
      return new ApiResponse("User not found", { status: 404 });
    }
    const response = await fn(req, ctx);
    return response;
  });
}
