import { Prisma } from "@prisma/client";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";

import {
  ApiResponse,
  type ApiContext,
  type ApiHandler,
  type ApiRequest,
} from "@/types/api";

export function validator(handler: ApiHandler) {
  const validated = async (req: ApiRequest, ctx: ApiContext) => {
    try {
      const response = await handler(req, ctx);
      return response;
    } catch (error) {
      if (error instanceof SyntaxError) {
        const message = "Bad request";
        return new ApiResponse(message, { status: 400 });
      }
      if (error instanceof z.ZodError) {
        const { message } = fromZodError(error, {
          issueSeparator: ". ",
        });
        return new ApiResponse(message, { status: 400 });
      }
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        const message = error.message.split("\n").at(-1);
        return new ApiResponse(message, { status: 409 });
      }
      console.error(error);
      const message = "Internal server error";
      return new ApiResponse(message, { status: 500 });
    }
  };

  return validated;
}
