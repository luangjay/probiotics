import { NextResponse, type NextRequest } from "next/server";

import { UserType } from "@/types/user";
import { handler } from "@/lib/api";
import { saltHashPassword } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { updatePatientSchema } from "@/lib/schema";

export async function GET(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  const action = async () => {
    const patient = await prisma.patient.findUnique({
      where: {
        userId: params.userId,
      },
      include: {
        user: true,
        medicalConditions: true,
        probioticRecords: true,
      },
    });

    if (patient === null) {
      return new NextResponse("Patient not found", { status: 404 });
    }
    const { user, userId, ...patientInfo } = patient;
    const { password, salt, ...userInfo } = user;
    return NextResponse.json({
      type: UserType.Patient,
      ...userInfo,
      ...patientInfo,
    });
  };

  return handler(action);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  const action = async () => {
    // Validate the request body against the schema
    const body: unknown = await req.json();
    const { ssn, gender, birthDate, ethnicity, ..._userInfo } =
      updatePatientSchema.parse(body);

    const _patient = await prisma.patient.findUnique({
      where: {
        userId: params.userId,
      },
    });
    if (_patient === null) {
      return new NextResponse("Patient not found", { status: 404 });
    }

    const patient = await prisma.patient.update({
      where: {
        userId: params.userId,
      },
      data: {
        user: {
          update: {
            ..._userInfo,
            ...(_userInfo.password && saltHashPassword(_userInfo.password)),
          },
        },
        ssn,
        gender,
        birthDate,
        ethnicity,
      },
      include: {
        user: true,
      },
    });

    const { user, userId, ...patientInfo } = patient;
    const { password, salt, ...userInfo } = user;
    return NextResponse.json({
      type: UserType.Patient,
      ...userInfo,
      ...patientInfo,
    });
  };

  return handler(action);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  const action = async () => {
    const patient = await prisma.patient.findUnique({
      where: {
        userId: params.userId,
      },
    });
    if (patient === null) {
      return new NextResponse("Patient not found", { status: 404 });
    }

    await prisma.user.delete({
      where: {
        id: params.userId,
      },
    });
    return NextResponse.json({});
  };

  return handler(action);
}
