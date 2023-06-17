import { NextResponse } from "next/server";

import { UserType } from "@/types/user";
import { handler } from "@/lib/api";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const action = async () => {
    const users = await prisma.user.findMany({
      include: {
        admin: true,
        doctor: true,
        patient: true,
      },
    });

    return NextResponse.json(
      users.map((user) => {
        const { admin, doctor, patient, password, salt, ...userInfo } = user;
        if (admin !== null) {
          const { userId, ...adminInfo } = admin;
          return {
            type: UserType.Admin,
            ...userInfo,
            ...adminInfo,
          };
        }
        if (doctor !== null) {
          const { userId, ...doctorInfo } = doctor;
          return {
            type: UserType.Doctor,
            ...userInfo,
            ...doctorInfo,
          };
        }
        if (patient !== null) {
          const { userId, ...patientInfo } = patient;
          return {
            type: UserType.Patient,
            ...userInfo,
            ...patientInfo,
          };
        }
        throw new Error("User type not found");
      })
    );
  };

  return handler(action);
}
