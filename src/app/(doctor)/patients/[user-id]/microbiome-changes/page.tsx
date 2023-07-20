import { MicrobiomeChanges } from "@/components/microbiome-changes";
import { prisma } from "@/lib/prisma";
import { species } from "@/lib/probiotic";
import { type PatientRow } from "@/types/patient";
import { type MicrobiomeChangeRow } from "@/types/visit-data";
import { notFound } from "next/navigation";

interface PageProps {
  params: {
    "user-id": string;
  };
}

export default async function Page({ params }: PageProps) {
  const userId = params["user-id"];
  const patient = await getPatient(userId);
  const { microbiomeChanges, microbiomeChangeSummary } =
    await getMicrobiomeChanges(userId);

  return (
    <div className="flex h-full flex-col gap-4 text-sm">
      <MicrobiomeChanges
        patient={patient}
        microbiomeChanges={microbiomeChanges}
        microbiomeChangeSummary={microbiomeChangeSummary}
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

async function getMicrobiomeChanges(patientId: string): Promise<{
  microbiomeChanges: MicrobiomeChangeRow[];
  microbiomeChangeSummary: MicrobiomeChangeRow[];
}> {
  const visitDatas = await prisma.visitData.findMany({
    where: {
      patientId,
    },
    include: {
      microorganismRecords: true,
    },
    orderBy: {
      collectionDate: "asc",
    },
  });
  const probiotics = await prisma.microorgranism.findMany({
    orderBy: {
      id: "asc",
    },
  });

  const tree = probiotics.reduce<{ genus: string; species: string[] }[]>(
    (acc, cur) => {
      const { genus, species } = cur;
      const rootIdx = acc.map((root) => root.genus).indexOf(genus);
      if (rootIdx === -1) {
        acc.push({ genus, species: [species] });
      } else {
        acc[rootIdx].species.push(cur.species);
      }
      return acc;
    },
    []
  );

  // console.log(probioticTree);

  const results = visitDatas.map((visitData) =>
    Object.fromEntries<number | undefined>(
      visitData.microorganismRecords.map((microorganismRecord) => [
        species(microorganismRecord.microorganism),
        microorganismRecord.reads,
      ])
    )
  );

  const keys = tree.reduce<string[]>((acc, cur) => {
    const { genus, species } = cur;
    acc.push(genus, ...species);
    return acc;
  }, []);

  // console.log(keys);

  const values = tree.reduce<(number | null)[][]>((acc, cur) => {
    const { species } = cur;
    const values = species.map((species) =>
      visitDatas.map((_, idx) => {
        const value = results[idx][species];
        return value ?? null;
      })
    );
    const total = values[0].map((_, idx) =>
      values.reduce((acc, cur) => acc + (cur[idx] ?? 0), 0)
    );
    acc.push(total, ...values);
    return acc;
  }, []);

  // console.log(values);

  const total = values[0].map((_, idx) =>
    values.reduce((acc, cur) => acc + (cur[idx] ?? 0) / 2, 0)
  );

  const table = Object.fromEntries(
    Array.from({ length: keys.length }, (_, idx) => [keys[idx], values[idx]])
  );

  // console.log(table);

  return {
    microbiomeChanges: tree.map((node) => {
      const { genus, species } = node;
      return {
        microorganism: genus,
        timepoints: Object.fromEntries(
          table[genus].map((value, idx) => [
            visitDatas[idx].collectionDate.getTime().toString(),
            value ?? 0,
          ])
        ),
        expanded: false,
        children: species.map((species) => ({
          microorganism: species,
          timepoints: Object.fromEntries(
            table[species].map((value, idx) => [
              visitDatas[idx].collectionDate.getTime().toString(),
              value ?? 0,
            ])
          ),
        })),
      };
    }),
    microbiomeChangeSummary: [
      {
        microorganism: "Total",
        timepoints: Object.fromEntries(
          total.map((value, idx) => [
            visitDatas[idx].collectionDate.getTime().toString(),
            value,
          ])
        ),
      },
    ],
  };
}

export const dynamic = "force-dynamic";
