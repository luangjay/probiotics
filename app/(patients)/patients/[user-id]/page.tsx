import prisma from "@/lib/prisma";
import { UserType, type DoctorInfo, type PatientInfo } from "@/types/user";
import { type ProbioticRecord } from "@prisma/client";
import ProbioticRecords from "./probiotic-records";

interface PageProps {
  params: {
    "user-id": string;
  };
}

export default async function Page({ params }: PageProps) {
  const patient = await getPatient(params["user-id"]);

  return (
    <div className="flex h-full flex-col gap-4">
      <h2 className="text-2xl font-bold">
        {patient.prefix} {patient.firstName} {patient.lastName}
      </h2>
      <p>{patient.ssn}</p>
      <p>{patient.gender}</p>
      <p>{patient.birthDate.toLocaleDateString()}</p>
      <ProbioticRecords data={patient.probioticRecords} />
    </div>
  );
}

async function getPatient(userId: string): Promise<
  PatientInfo & {
    probioticRecords: (ProbioticRecord & { doctor: DoctorInfo })[];
  }
> {
  const patient = await prisma.patient.findUniqueOrThrow({
    where: {
      userId,
    },
    include: {
      user: true,
      probioticRecords: {
        include: {
          doctor: {
            include: {
              user: true,
            },
          },
        },
      },
    },
  });

  const {
    user,
    userId: _,
    probioticRecords: _probioticRecords,
    ...pPatient
  } = patient;
  const { password, salt, ...pUserPatient } = user;
  const probioticRecords = _probioticRecords.map((probioticRecord) => {
    const { doctor, ...pProbioticRecord } = probioticRecord;
    const { user } = doctor;
    const { password, salt, createdAt, updatedAt, ...pUserDoctor } = user;
    return {
      ...pProbioticRecord,
      doctor: {
        type: UserType.Doctor as const,
        ...pUserDoctor,
      },
    };
  });
  return {
    type: UserType.Patient as const,
    ...pPatient,
    ...pUserPatient,
    probioticRecords,
  };
}
