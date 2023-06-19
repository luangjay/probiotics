import { NextResponse, type NextRequest } from "next/server";

export interface ApiRequest extends NextRequest {}

export interface ApiContext {
  params: Record<string, string>;
}

export class ApiResponse extends NextResponse {}

export type ApiHandler = (
  req: ApiRequest,
  ctx: ApiContext
) => ApiResponse | Promise<ApiResponse>;
