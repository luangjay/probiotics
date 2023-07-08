import { prisma } from "@/lib/prisma";
import { ApiResponse } from "@/types/rest";
import { UserType } from "@/types/user";
import { handler } from "../handler";

const GET = handler(async (req) => {
  if (req.token?.type !== UserType.Admin) {
    return new ApiResponse("Unauthorized", { status: 401 });
  }
  const users = await prisma.user.findMany({
    include: {
      admin: true,
      doctor: true,
      patient: true,
    },
  });

  return ApiResponse.json(
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
});

export { GET };
