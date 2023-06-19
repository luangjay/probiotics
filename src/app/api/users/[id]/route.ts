import { ApiResponse } from "@/types/api";
import { UserType } from "@/types/user";
import prisma from "@/lib/prisma";

import { validator } from "./validator";

const GET = validator(async (req, ctx) => {
  const id = ctx.params.id as string;
  const user = await prisma.user.findUnique({
    where: {
      id,
    },
    include: {
      admin: true,
      doctor: true,
      patient: true,
    },
  });

  if (user === null) {
    return new ApiResponse(null, { status: 418 });
  }
  const { admin, doctor, patient, password, salt, ...userInfo } = user;
  if (admin !== null) {
    const { userId, ...adminInfo } = admin;
    return ApiResponse.json({
      type: UserType.Admin,
      ...userInfo,
      ...adminInfo,
    });
  }
  if (doctor !== null) {
    const { userId, ...doctorInfo } = doctor;
    return ApiResponse.json({
      type: UserType.Doctor,
      ...userInfo,
      ...doctorInfo,
    });
  }
  if (patient !== null) {
    const { userId, ...patientInfo } = patient;
    return ApiResponse.json({
      type: UserType.Patient,
      ...userInfo,
      ...patientInfo,
    });
  }
  throw new Error("User type not found");
});

export { GET };
