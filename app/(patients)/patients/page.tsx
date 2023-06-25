import prisma from "@/lib/prisma";
import { UserType, type PatientInfo } from "@/types/user";
import PatientList from "./patient-list";

export default async function Page() {
  const patients = await getPatients();

  return (
    <div className="flex h-full flex-col gap-4">
      <PatientList data={patients} />
    </div>
  );
}

async function getPatients(): Promise<PatientInfo[]> {
  const patients = await prisma.patient.findMany({
    include: {
      user: true,
    },
  });

  return patients.map((patient) => {
    const { user, userId, ...patientInfo } = patient;
    const { password, salt, ...userInfo } = user;
    return {
      type: UserType.Patient,
      ...userInfo,
      ...patientInfo,
    };
  });
}
