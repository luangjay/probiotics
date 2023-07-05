import { fullName } from "@/lib/api/user";
import { prisma } from "@/server/db";
import { type PatientRow, type PatientWithAll } from "@/types/api/patient";
import { UserType } from "@/types/api/user";
import { notFound } from "next/navigation";

export async function getPatients(): Promise<PatientRow[]> {
  const patients = await prisma.patient.findMany({
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

  return patients.map((patient) => {
    const {
      user,
      userId: _,
      probioticRecords: p13ns,
      medicalConditions: m14ns,
      ...pPatient
    } = patient;
    const { password, salt, ...pUserPatient } = user;
    const medicalConditions = m14ns.map((m14n) => m14n.medicalCondition);
    return {
      type: UserType.Patient as const,
      ...pUserPatient,
      fullName: fullName(pUserPatient),
      ...pPatient,
      medicalConditions,
    };
  });
}

export async function getPatient(userId: string): Promise<PatientWithAll> {
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
      probioticRecords: p13ns,
      medicalConditions: m14ns,
      ...pPatient
    } = patient;
    const { password, salt, ...pUserPatient } = user;
    const probioticRecords = p13ns.map((probioticRecord) => {
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
    const medicalConditions = m14ns.map((m14n) => m14n.medicalCondition);
    return {
      type: UserType.Patient as const,
      ...pUserPatient,
      fullName: fullName(pUserPatient),
      ...pPatient,
      probioticRecords,
      medicalConditions,
    };
  } catch (error) {
    notFound();
  }
}
