import { type JWT } from "next-auth/jwt";
import { NextResponse, type NextRequest } from "next/server";

export interface ApiRequest extends NextRequest {
  token: JWT | null;
}

export interface ApiContext {
  params: {
    [k: string]: string;
  };
}

export class ApiResponse extends NextResponse {
  static csv(
    body?: BodyInit | null | undefined,
    init?: ResponseInit | undefined
  ) {
    return new ApiResponse(body, {
      ...init,
      headers: { ...init?.headers, "Content-Type": "text/csv;charset=UTF-8" },
    });
  }
}

export type ApiHandler = (
  req: ApiRequest,
  ctx: ApiContext
) => ApiResponse | Promise<ApiResponse>;
