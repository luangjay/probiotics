import { ApiResponse } from "@/types/api";
import { UserType } from "@/types/user";
import { prisma } from "@/lib/prisma";

import { validator } from "../validator";

const GET = validator(async () => {
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
