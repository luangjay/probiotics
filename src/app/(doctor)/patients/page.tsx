import { PatientList } from "@/components/patient-list";
import { prisma } from "@/lib/prisma";
import { fullName } from "@/lib/user";
import { type PatientRow } from "@/types/patient";

export default async function Page() {
  const patients = await getPatientRows();
  const medicalConditions = await getMedicalConditions();

  return (
    <div className="flex h-full flex-col gap-4">
      <PatientList patients={patients} medicalConditions={medicalConditions} />
    </div>
  );
}

async function getPatientRows(): Promise<PatientRow[]> {
  const patients = await prisma.patient.findMany({
    include: {
      user: true,
      medicalConditions: {
        include: {
          medicalCondition: true,
        },
      },
    },
    orderBy: {
      userId: "asc",
    },
  });

  return patients.map((patient) => ({
    id: patient.userId,
    ssn: patient.ssn,
    name: fullName(patient.user),
    gender: patient.gender,
    birthDate: patient.birthDate,
    ethnicity: patient.ethnicity,
    medicalConditions: patient.medicalConditions.map(
      (m14n) => m14n.medicalCondition
    ),
  }));
}

async function getMedicalConditions() {
  const medicalConditions = await prisma.medicalCondition.findMany({
    orderBy: {
      id: "asc",
    },
  });
  return medicalConditions;
}
