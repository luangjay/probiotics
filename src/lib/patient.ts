import { fullName } from "@/lib/user";
import { prisma } from "@/server/db";
import { UserType, type DoctorInfo, type PatientInfo } from "@/types/user";
import { type MedicalCondition, type ProbioticRecord } from "@prisma/client";
import { notFound } from "next/navigation";

export async function getPatients(): Promise<
  (PatientInfo & { fullName: string })[]
> {
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
      fullName: fullName(userInfo),
    };
  });
}

export async function getPatient(userId: string): Promise<
  PatientInfo & {
    probioticRecords: (ProbioticRecord & { doctor: DoctorInfo })[];
    medicalConditions: MedicalCondition[];
  } & { fullName: string }
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
      fullName: fullName(pUserPatient),
    };
  } catch (error) {
    notFound();
  }
}
