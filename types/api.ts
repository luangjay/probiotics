import { NextResponse, type NextRequest } from "next/server";

export interface ApiRequest extends NextRequest {}

export interface ApiContext {
  params: {
    [x: string]: unknown;
  };
}

export class ApiResponse extends NextResponse {}

export type ApiHandler = (
  req: ApiRequest,
  ctx: ApiContext
) => ApiResponse | Promise<ApiResponse>;
