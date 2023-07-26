import { MicrobiomeChanges } from "@/components/microbiome-changes";
import { prisma } from "@/lib/prisma";
import { genus, species } from "@/lib/probiotic";
import { type MicroorganismRow } from "@/types/microorganism";
import { type PatientRow } from "@/types/patient";
import {
  type MicrobiomeChangeRow,
  type VisitDataRow,
} from "@/types/visit-data";
import { notFound } from "next/navigation";

interface PageProps {
  params: {
    "user-id": string;
  };
}

export default async function Page({ params }: PageProps) {
  const userId = params["user-id"];
  const patient = await getPatient(userId);
  const { microbiomeChanges, keys } = await getMicrobiomeChanges(userId);
  const [microorganisms, visitDatas] = await Promise.all([
    getMicroorganisms(),
    getVisitDatas(userId),
  ]);

  return (
    <div className="flex h-full flex-col gap-4 text-sm">
      <MicrobiomeChanges
        patient={patient}
        microbiomeChanges={microbiomeChanges}
        keys={keys}
        microorganisms={microorganisms}
        visitDatas={visitDatas}
      />
    </div>
  );
}

async function getPatient(userId: string): Promise<PatientRow> {
  const patient = await prisma.patient.findUnique({
    where: {
      userId,
    },
    include: {
      user: true,
      medicalConditions: {
        include: {
          medicalCondition: true,
        },
        orderBy: {
          id: "asc",
        },
      },
    },
  });

  if (patient === null) notFound();

  return {
    id: patient.userId,
    ssn: patient.ssn,
    prefix: patient.user.prefix,
    firstName: patient.user.firstName,
    lastName: patient.user.lastName,
    name: patient.user.name,
    gender: patient.gender,
    birthDate: patient.birthDate,
    ethnicity: patient.ethnicity,
    medicalConditions: patient.medicalConditions.map(
      (m14n) => m14n.medicalCondition
    ),
  };
}

async function getMicrobiomeChanges(
  patientId: string
): Promise<{ microbiomeChanges: MicrobiomeChangeRow[]; keys: string[] }> {
  const visitDatas = (
    await prisma.visitData.findMany({
      where: {
        patientId,
      },
      include: {
        microorganismRecords: true,
      },
      orderBy: {
        collectionDate: "asc",
      },
    })
  ).slice(-2);
  const microorganisms = await prisma.microorgranism.findMany({
    orderBy: {
      id: "asc",
    },
  });

  const tree = microorganisms
    .reduce<{ genus: string; species: string[] }[]>((acc, microorganism) => {
      const { genus, species: _species } = microorganism;
      const species = `${genus};${_species}`;
      const nodeIdx = acc.map((node) => node.genus).indexOf(genus);
      if (nodeIdx === -1) {
        acc.push({ genus, species: [species] });
      } else {
        acc[nodeIdx].species.push(species);
      }
      return acc;
    }, [])
    .map((microorganism) => {
      microorganism.species.sort((a, b) => a.localeCompare(b));
      return microorganism;
    })
    .sort((a, b) => a.genus.localeCompare(b.genus));

  const timepoints = visitDatas.map((visitData) =>
    Object.fromEntries<number | undefined>(
      visitData.microorganismRecords.map((microorganismRecord) => [
        `${genus(microorganismRecord.microorganism)};${species(
          microorganismRecord.microorganism
        )}`,
        microorganismRecord.reads,
      ])
    )
  );

  const keys = tree.reduce<string[]>((acc, node) => {
    const { genus, species } = node;
    acc.push(genus, ...species);
    return acc;
  }, []);

  const readsMatrix = tree.reduce<(number | null)[][]>((acc, node) => {
    const { species } = node;
    const values = species.map((species) =>
      visitDatas.map((_, idx) => {
        const value = timepoints[idx][species];
        return value ?? null;
      })
    );
    const total = values[0].map((_, idx) =>
      values.reduce((acc, value) => acc + (value[idx] ?? 0), 0)
    );
    acc.push(total, ...values);
    return acc;
  }, []);

  const readsTable = Object.fromEntries(
    Array.from({ length: keys.length }, (_, idx) => [
      keys[idx],
      readsMatrix[idx],
    ])
  );

  const infoTable = Object.fromEntries(
    microorganisms.map((microorganism) => {
      const { genus, species: _species, essential, probiotic } = microorganism;
      const species = `${genus};${_species}`;
      return [species, { essential, probiotic }];
    })
  );

  return {
    microbiomeChanges: tree.map<MicrobiomeChangeRow>((node) => {
      const { genus, species } = node;
      return {
        microorganism: genus,
        timepoints: Object.fromEntries(
          readsTable[genus].map((value, idx) => [
            visitDatas[idx].collectionDate.getTime().toString(),
            value ?? 0,
          ])
        ),
        expanded: false,
        children: species.map((species) => {
          const { essential, probiotic } = infoTable[species];
          return {
            microorganism: species,
            timepoints: Object.fromEntries(
              readsTable[species].map((value, idx) => [
                visitDatas[idx].collectionDate.getTime().toString(),
                value ?? 0,
              ])
            ),
            essential,
            probiotic,
          };
        }),
      };
    }),
    keys: visitDatas.map((visitData) =>
      visitData.collectionDate.getTime().toString()
    ),
  };
}

async function getMicroorganisms(): Promise<MicroorganismRow[]> {
  const microorganisms = await prisma.microorgranism.findMany();
  return microorganisms.map((microorganism) => ({
    id: microorganism.id,
    name: microorganism.name,
    probiotic: microorganism.probiotic,
    essential: microorganism.essential,
  }));
}

async function getVisitDatas(patientId: string): Promise<VisitDataRow[]> {
  const visitDatas = (
    await prisma.visitData.findMany({
      where: {
        patientId,
      },
      include: {
        doctor: {
          include: {
            user: true,
          },
        },
        microorganismRecords: true,
      },
      orderBy: {
        collectionDate: "asc",
      },
    })
  ).slice(-2);

  return visitDatas.map((visitData) => ({
    id: visitData.id,
    fileUri: visitData.fileUri,
    collectionDate: visitData.collectionDate,
    microorganismRecords: visitData.microorganismRecords,
    createdAt: visitData.createdAt,
    updatedAt: visitData.updatedAt,
    doctor: {
      userId: visitData.doctor.userId,
      name: visitData.doctor.user.name,
    },
  }));
}

export const dynamic = "force-dynamic";
