import { prisma } from "@/server/db";
import { ApiResponse } from "@/types/api";
import { UserType } from "@/types/user";
import { validator } from "./validator";

const GET = validator(async (req, ctx) => {
  const id = ctx.params.id;
  if (req.token?.type !== UserType.Admin) {
    return new ApiResponse("Unauthorized", { status: 401 });
  }
  const user = await prisma.user.findUniqueOrThrow({
    where: {
      id,
    },
    include: {
      admin: true,
      doctor: true,
      patient: true,
    },
  });

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
