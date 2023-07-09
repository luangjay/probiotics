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
    const doctor = await prisma.doctor.findUnique({
      where: {
        userId,
      },
    });
    if (doctor === null) {
      return new ApiResponse("Doctor not found", { status: 404 });
    }
    const response = await fn(req, ctx);
    return response;
  });
}
