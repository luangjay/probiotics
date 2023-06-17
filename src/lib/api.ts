import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { z } from "zod";
import { fromZodError } from "zod-validation-error";

type Action = () => Promise<Response>;

export async function handler(action: Action) {
  try {
    const response = await action();
    return response;
  } catch (error) {
    if (error instanceof SyntaxError) {
      const message = "Bad request";
      return new NextResponse(message, { status: 400 });
    }
    if (error instanceof z.ZodError) {
      const { message } = fromZodError(error, {
        issueSeparator: ". ",
      });
      return new NextResponse(message, { status: 400 });
    }
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      const message = error.message.split("\n").at(-1);
      return new NextResponse(message, { status: 409 });
    }
    console.error(error);
    const message = "Internal server error";
    return new NextResponse(message, { status: 500 });
  }
}
