import { NextResponse, type NextRequest } from "next/server";
import type { JWT } from "next-auth/jwt";

export interface ApiRequest extends NextRequest {
  token: JWT | null;
}

export interface ApiContext {
  params: Record<string, string>;
}

export class ApiResponse extends NextResponse {}

export type ApiHandler = (
  req: ApiRequest,
  ctx: ApiContext
) => ApiResponse | Promise<ApiResponse>;
