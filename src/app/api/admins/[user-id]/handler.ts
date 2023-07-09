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
    const userId = z.string().cuid().parse(ctx.params["user-id"]);
    const admin = await prisma.admin.findUnique({
      where: {
        userId,
      },
    });
    if (admin === null) {
      return new ApiResponse("Admin not found", { status: 404 });
    }
    const response = await fn(req, ctx);
    return response;
  });
}
