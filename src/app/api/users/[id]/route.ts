import { NextResponse, type NextRequest } from "next/server";

import { UserType } from "@/types/user";
import { handler } from "@/lib/api";
import prisma from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const action = async () => {
    const user = await prisma.user.findUnique({
      where: {
        id: params.id,
      },
      include: {
        admin: true,
        doctor: true,
        patient: true,
      },
    });

    if (user === null) {
      return new NextResponse("User not found", { status: 404 });
    }
    const { admin, doctor, patient, password, salt, ...userInfo } = user;
    if (admin !== null) {
      const { userId, ...adminInfo } = admin;
      return NextResponse.json({
        type: UserType.Admin,
        ...userInfo,
        ...adminInfo,
      });
    }
    if (doctor !== null) {
      const { userId, ...doctorInfo } = doctor;
      return NextResponse.json({
        type: UserType.Doctor,
        ...userInfo,
        ...doctorInfo,
      });
    }
    if (patient !== null) {
      const { userId, ...patientInfo } = patient;
      return NextResponse.json({
        type: UserType.Patient,
        ...userInfo,
        ...patientInfo,
      });
    }
    throw new Error("User type not found");
  };

  return handler(action);
}
