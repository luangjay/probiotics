import { buttonVariants } from "@/components/ui/button";
import prisma from "@/lib/prisma";
import { UserType, type DoctorInfo, type PatientInfo } from "@/types/user";
import { type MedicalCondition, type ProbioticRecord } from "@prisma/client";
import Link from "next/link";
import { notFound } from "next/navigation";
import ProbioticRecords from "./probiotic-records";

interface PageProps {
  params: {
    "user-id": string;
  };
}

export default async function Page({ params }: PageProps) {
  const userId = params["user-id"];
  const { probioticRecords, ...patient } = await getPatient(userId);

  return (
    <div className="flex h-full flex-col gap-4 text-sm">
      <h2 className="text-2xl font-bold">
        {patient.prefix} {patient.firstName} {patient.lastName}
      </h2>
      <div className="space-y-2">
        <p>SSN: {patient.ssn}</p>
        <p>Gender: {patient.gender}</p>
        <p>Birth date: {patient.birthDate.toLocaleDateString()}</p>
        <p>Ethnicity: {patient.ethnicity}</p>
        <p>
          Medical conditions:{" "}
          {patient.medicalConditions.map((m14n) => m14n.name).join(", ")}
        </p>
        <Link
          href={`${userId}/time-series`}
          className={buttonVariants({ size: "sm", variant: "ghost" })}
        >
          Time series
        </Link>
      </div>
      <ProbioticRecords data={probioticRecords} />
    </div>
  );
}

async function getPatient(userId: string): Promise<
  PatientInfo & {
    probioticRecords: (ProbioticRecord & { doctor: DoctorInfo })[];
    medicalConditions: MedicalCondition[];
  }
> {
  try {
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
        medicalConditions: {
          include: {
            medicalCondition: true,
          },
        },
      },
    });

    const {
      user,
      userId: _,
      probioticRecords: _probioticRecords,
      medicalConditions: _medicalConditions,
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
    const medicalConditions = _medicalConditions.map(
      (m14n) => m14n.medicalCondition
    );
    return {
      type: UserType.Patient as const,
      ...pPatient,
      ...pUserPatient,
      probioticRecords,
      medicalConditions,
    };
  } catch (error) {
    notFound();
  }
}
