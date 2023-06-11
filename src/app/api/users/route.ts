import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const revalidate = 10;

export async function GET() {
  const users = await prisma.user.findMany();
  return NextResponse.json(users);
}
