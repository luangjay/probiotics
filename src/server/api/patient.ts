import { prisma } from "@/lib/prisma";
import { fullName } from "@/lib/user";
import { type PatientRow, type PatientWithAll } from "@/types/patient";
import { UserType } from "@/types/user";
import { notFound } from "next/navigation";

export async function getPatientRows(): Promise<PatientRow[]> {
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
    orderBy: {
      userId: "asc",
    },
  });
  // console.log(patients.map((p) => p.user.firstName));

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

export async function getPatientWithAll(
  userId: string
): Promise<PatientWithAll> {
  const patient = await prisma.patient.findUnique({
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
          probioticBrands: {
            include: {
              probioticBrand: true,
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

  if (patient === null) return notFound();

  const {
    user,
    userId: _,
    probioticRecords: p13ns,
    medicalConditions: m14ns,
    ...pPatient
  } = patient;
  const { password, salt, ...pUserPatient } = user;
  const probioticRecords = p13ns.map((probioticRecord) => {
    const {
      doctor,
      probioticBrands: pProbioticBrands,
      ...pProbioticRecord
    } = probioticRecord;
    const { user } = doctor;
    const { password, salt, createdAt, updatedAt, ...pUserDoctor } = user;
    const probioticBrands = pProbioticBrands.map(
      (p13ds) => p13ds.probioticBrand
    );
    return {
      ...pProbioticRecord,
      doctor: {
        type: UserType.Doctor as const,
        ...pUserDoctor,
      },
      probioticBrands,
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
}
