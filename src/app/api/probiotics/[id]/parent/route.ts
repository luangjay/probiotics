import { ApiResponse } from "@/types/api";
import { UserType } from "@/types/user";
import prisma from "@/lib/prisma";

import { validator } from "../validator";

const GET = validator(async (req, ctx) => {
  const userId = ctx.params["user-id"] as string;
  const patient = await prisma.patient.findUnique({
    where: {
      userId,
    },
    include: {
      user: true,
    },
  });
  if (patient === null) {
    return new ApiResponse("Patient not found", { status: 404 });
  }

  const { user, userId: _, ...patientInfo } = patient;
  const { password, salt, ...userInfo } = user;
  return ApiResponse.json({
    type: UserType.Patient,
    ...userInfo,
    ...patientInfo,
  });
});