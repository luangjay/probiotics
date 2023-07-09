import { PatientList } from "@/components/patient-list";
import { prisma } from "@/lib/prisma";
import { type MedicalConditionRow } from "@/types/medical-condition";
import { type PatientRow } from "@/types/patient";

export default async function Page() {
  const patients = await getPatients();
  const medicalConditions = await getMedicalConditions();

  return (
    <div className="flex h-full flex-col gap-4">
      <PatientList patients={patients} medicalConditions={medicalConditions} />
    </div>
  );
}

async function getPatients(): Promise<PatientRow[]> {
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
    prefix: patient.user.prefix,
    firstName: patient.user.firstName,
    lastName: patient.user.lastName,
    name: patient.user.name,
    gender: patient.gender,
    birthDate: patient.birthDate,
    ethnicity: patient.ethnicity,
    medicalConditions: patient.medicalConditions.map((m14n) => ({
      id: m14n.medicalCondition.id,
      name: m14n.medicalCondition.name,
    })),
  }));
}

async function getMedicalConditions(): Promise<MedicalConditionRow[]> {
  const medicalConditions = await prisma.medicalCondition.findMany({
    orderBy: {
      id: "asc",
    },
  });
  return medicalConditions.map((medicalCondition) => ({
    id: medicalCondition.id,
    name: medicalCondition.name,
  }));
}
