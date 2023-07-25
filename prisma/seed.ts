import { faker } from "@faker-js/faker";
import { Gender, PrismaClient } from "@prisma/client";
import { genSaltSync, hashSync } from "bcrypt-ts";
import slugid from "slugid";
import yargs from "yargs";

const prisma = new PrismaClient();

/* Main function */
async function main() {
  console.log();
  const { clear, reset, ...options } = await getOptions();

  let option: keyof typeof options;
  for (option in options) {
    const count = options[option];
    await seed({ option, count, clear, reset });
  }
}

/* Execution */
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

/* Seed functions */
interface SeedOptions {
  reset: boolean;
  clear: boolean;
  count: number;
}

async function seed({
  option,
  reset,
  clear,
  count,
}: { option: string } & SeedOptions) {
  if (typeof count !== "number") {
    throw new Error("Invalid type");
  }
  if (!reset && count === 0) return;
  const tag = `${reset ? "Reset" : `Seeded ${count}`} ${option} in`;
  console.time(tag);
  switch (option) {
    case "admins":
      await seedAdmins({ reset, clear, count });
      break;
    case "doctors":
      await seedDoctors({ reset, clear, count });
      break;
    case "patients":
      await seedPatients({ reset, clear, count });
      break;
    case "microorganisms":
      await seedMicroorganisms({ reset, clear, count });
      break;
    case "probiotic-brands":
      await seedProbioticBrands({ reset, clear, count });
      break;
    case "medical-conditions":
      await seedMedicalConditions({ reset, clear, count });
      break;
    case "visit-datas":
      await seedVisitDatas({ reset, clear, count });
      break;
    case "microorganism-probiotic-brand":
      await seedMicroorganismProbioticBrand({ reset, clear, count });
      break;
    case "medical-condition-patient":
      await seedMedicalConditionPatient({ reset, clear, count });
      break;
  }
  console.timeEnd(tag);
}

async function seedAdmins({ reset, clear, count }: SeedOptions) {
  // Options
  faker.seed(42001);
  const rootCount = 1;

  return prisma.$transaction(
    async (tx) => {
      if (clear) {
        await tx.user.deleteMany({
          where: !reset
            ? {
                OR: [
                  {
                    NOT: {
                      admin: null,
                    },
                  },
                  {
                    admin: null,
                    doctor: null,
                    patient: null,
                  },
                ],
              }
            : undefined,
        });
        if (reset) return;
      }

      await Promise.all(
        Array.from({ length: rootCount }, async () => {
          // User fields
          const email = "root@luangjay.com";
          const prefix = "Dr.";
          const firstName = "Root*";
          const lastName = "Tree-<";
          const username = "root";
          const { password, salt } = saltHashPassword("1234");

          // Create admin roots
          return tx.admin.create({
            data: {
              user: {
                create: {
                  username,
                  password,
                  salt,
                  email,
                  prefix,
                  firstName,
                  lastName,
                },
              },
            },
          });
        })
      );

      await Promise.all(
        Array.from({ length: count - rootCount }, () => {
          // User fields
          const sex = faker.helpers.arrayElement(["male", "female"] as const);
          const prefix = "Dr.";
          const firstName = faker.person.firstName(sex);
          const lastName = faker.person.lastName(sex);
          const username = faker.internet.userName({ firstName, lastName });
          const { password, salt } = saltHashPassword("secret");

          // Create admins
          return tx.admin.create({
            data: {
              user: {
                create: {
                  username,
                  password,
                  salt,
                  prefix,
                  firstName,
                  lastName,
                },
              },
            },
          });
        })
      );
    },
    { timeout: 10 * 60 * 1000 }
  );
}

async function seedDoctors({ reset, clear, count }: SeedOptions) {
  // Options
  faker.seed(42002);

  return prisma.$transaction(
    async (tx) => {
      if (clear) {
        await tx.user.deleteMany({
          where: !reset
            ? {
                OR: [
                  {
                    NOT: {
                      doctor: null,
                    },
                  },
                  {
                    admin: null,
                    doctor: null,
                    patient: null,
                  },
                ],
              }
            : undefined,
        });
        if (reset) return;
      }
      await Promise.all(
        Array.from({ length: count }, () => {
          // User fields
          const sex = faker.helpers.arrayElement(["male", "female"] as const);
          const prefix = "Dr.";
          const firstName = faker.person.firstName(sex);
          const lastName = faker.person.lastName(sex);
          const username = faker.internet.userName({ firstName, lastName });
          const { password, salt } = saltHashPassword("secret");

          // Create doctors
          return tx.doctor.create({
            data: {
              user: {
                create: {
                  username,
                  password,
                  salt,
                  prefix,
                  firstName,
                  lastName,
                },
              },
            },
          });
        })
      );
    },
    { timeout: 10 * 60 * 1000 }
  );
}

async function seedPatients({ reset, clear, count }: SeedOptions) {
  // Options
  faker.seed(42003);

  return prisma.$transaction(
    async (tx) => {
      if (clear) {
        await tx.user.deleteMany({
          where: !reset
            ? {
                OR: [
                  {
                    NOT: {
                      patient: null,
                    },
                  },
                  {
                    admin: null,
                    doctor: null,
                    patient: null,
                  },
                ],
              }
            : undefined,
        });
        if (reset) return;
      }
      await Promise.all(
        Array.from({ length: count }, () => {
          // User fields
          const sex = faker.helpers.arrayElement(["male", "female"] as const);
          const prefix =
            sex === "male"
              ? "Mr."
              : faker.helpers.arrayElement(["Ms.", "Mrs."] as const);
          const firstName = faker.person.firstName(sex);
          const lastName = faker.person.lastName(sex);
          // const username = faker.internet.userName({ firstName, lastName });
          // const { password, salt } = saltHashPassword("secret");
          const username = slugid.nice();
          const password = "none";
          const salt = "none";

          // Patient fields
          const cis = faker.datatype.boolean(0.8);
          const ssn = faker.number
            .int({ min: 4.2e13, max: 4.21e13 })
            .toString();
          const birthDate = faker.date.birthdate();
          const gender = cis
            ? sex === "male"
              ? Gender.Male
              : Gender.Female
            : Gender.Others;
          const ethnicity = faker.location.country();

          // Create patients
          return tx.patient.create({
            data: {
              user: {
                create: {
                  username,
                  password,
                  salt,
                  prefix,
                  firstName,
                  lastName,
                },
              },
              ssn,
              birthDate,
              gender,
              ethnicity,
            },
          });
        })
      );
    },
    { timeout: 10 * 60 * 1000 }
  );
}

async function seedMicroorganisms({ reset, clear, count }: SeedOptions) {
  // Options
  faker.seed(42005);
  const pool = microorganismPool();

  return prisma.$transaction(
    async (tx) => {
      if (clear) {
        await tx.microorgranism.deleteMany();
        if (reset) return;
      }
      await Promise.all(
        Array.from({ length: count }, (_, idx) => {
          // Probiotic fields
          const { name, probiotic, essential } = pool[idx];

          // Create probiotics
          return tx.microorgranism.create({
            data: { name, probiotic, essential },
          });
        })
      );
    },
    { timeout: 10 * 60 * 1000 }
  );
}

async function seedProbioticBrands({ reset, clear, count }: SeedOptions) {
  // Options
  faker.seed(42006);

  // Probiotic brand fields
  const names = faker.helpers.uniqueArray(() => faker.person.lastName(), count);

  // Create probiotic brands
  return prisma.$transaction(
    async (tx) => {
      if (clear) {
        await tx.probioticBrand.deleteMany();
        if (reset) return;
      }
      await tx.probioticBrand.createMany({
        data: Array.from({ length: count }, (_, idx) => ({
          name: names[idx],
        })),
      });
    },
    { timeout: 10 * 60 * 1000 }
  );
}

async function seedMedicalConditions({ reset, clear, count }: SeedOptions) {
  // Options
  faker.seed(42007);
  const pool = medicalConditionPool();

  // Medical condition fields
  const names = [...pool].slice(0, count);

  // Create medical conditions
  return prisma.$transaction(
    async (tx) => {
      if (clear) {
        await tx.medicalCondition.deleteMany();
        if (reset) return;
      }
      await tx.medicalCondition.createMany({
        data: Array.from({ length: count }, (_, idx) => ({
          name: names[idx],
        })),
      });
    },
    { timeout: 10 * 60 * 1000 }
  );
}

async function seedVisitDatas({ reset, clear, count }: SeedOptions) {
  // Options
  faker.seed(42008);

  // Initialize
  const doctors = await prisma.doctor.findMany();
  const patients = await prisma.patient.findMany();
  const probiotics = await prisma.microorgranism.findMany();

  const doctorIds = doctors.map((doctor) => doctor.userId);
  const patientIds = patients.map((patient) => patient.userId);
  const probioticNames = probiotics.map((probiotic) => probiotic.name);

  return prisma.$transaction(
    async (tx) => {
      if (clear) {
        await tx.visitData.deleteMany();
        if (reset) return;
      }
      await Promise.all(
        Array.from({ length: count }, (_, idx) => {
          // Probiotic record fields
          const doctorId = faker.helpers.arrayElement(doctorIds);
          const patientId = faker.helpers.arrayElement(patientIds);
          const length = faker.number.int({ min: 20, max: 40 });
          const names = faker.helpers.arrayElements(probioticNames, length);
          const microorganismRecords = names.map((name) => ({
            microorganism: name,
            reads: faker.number.int({ min: 0, max: 999 }),
          }));
          const createdAt = new Date(
            Date.now() - (count - idx) * 60 * 60 * 1000
          );
          const collectionDate = faker.date.past({ refDate: createdAt });

          // Create probiotic records
          return tx.visitData.create({
            data: {
              doctorId,
              patientId,
              microorganismRecords: {
                createMany: {
                  data: microorganismRecords,
                },
              },
              collectionDate,
              createdAt,
            },
          });
        })
      );
    },
    { timeout: 10 * 60 * 1000 }
  );
}

async function seedMicroorganismProbioticBrand({
  reset,
  clear,
  count,
}: SeedOptions) {
  // Options
  faker.seed(42009);

  // Initialize
  const microorganisms = await prisma.microorgranism.findMany();
  const probioticBrands = await prisma.probioticBrand.findMany();

  const microorganismIds = microorganisms.map(
    (probioticRecord) => probioticRecord.id
  );
  const probioticBrandIds = probioticBrands.map(
    (probioticBrand) => probioticBrand.id
  );

  return prisma.$transaction(
    async (tx) => {
      if (clear) {
        await tx.microorgranismProbioticBrand.deleteMany();
        if (reset) return;
      }
      await Promise.all(
        Array.from({ length: count }, () => {
          // Probiotic brand probiotic record fields
          const microorganismId = faker.helpers.arrayElement(microorganismIds);
          const probioticBrandId =
            faker.helpers.arrayElement(probioticBrandIds);

          // Create probiotic brand probiotic record
          // NOTE: skip duplicates
          return tx.microorgranismProbioticBrand.upsert({
            where: {
              microorganismId_probioticBrandId: {
                microorganismId,
                probioticBrandId,
              },
            },
            update: {},
            create: { probioticBrandId, microorganismId },
          });
        })
      );
    },
    { timeout: 10 * 60 * 1000 }
  );
}

async function seedMedicalConditionPatient({
  reset,
  clear,
  count,
}: SeedOptions) {
  // Options
  faker.seed(42010);

  // Initialize
  const medicalConditions = await prisma.medicalCondition.findMany();
  const patients = await prisma.patient.findMany();

  const medicalConditionIds = medicalConditions.map(
    (medicalCondition) => medicalCondition.id
  );
  const patientIds = patients.map((patient) => patient.userId);

  return prisma.$transaction(
    async (tx) => {
      if (clear) {
        await tx.medicalConditionPatient.deleteMany();
        if (reset) return;
      }
      await Promise.all(
        Array.from({ length: count }, () => {
          // Medical condition patient fields
          const medicalConditionId =
            faker.helpers.arrayElement(medicalConditionIds);
          const patientId = faker.helpers.arrayElement(patientIds);

          // Create medical condition patient
          return tx.medicalConditionPatient.create({
            data: { medicalConditionId, patientId },
          });
        })
      );
    },
    { timeout: 10 * 60 * 1000 }
  );
}

/* Custom pools */
function microorganismPool() {
  return [
    {
      name: "Bacteria;Bacteroidetes;Bacteroidia;Bacteroidales;Bacteroidaceae;Bacteroides;Bacteroides caccae",
      probiotic: true,
      essential: false,
    },
    {
      name: "Bacteria;Bacteroidetes;Bacteroidia;Bacteroidales;Bacteroidaceae;Bacteroides;Bacteroides clarus",
      probiotic: true,
      essential: false,
    },
    {
      name: "Bacteria;Bacteroidetes;Bacteroidia;Bacteroidales;Bacteroidaceae;Bacteroides;Bacteroides dorei",
      probiotic: true,
      essential: true,
    },
    {
      name: "Bacteria;Bacteroidetes;Bacteroidia;Bacteroidales;Bacteroidaceae;Bacteroides;Bacteroides eggerthii",
      probiotic: true,
      essential: true,
    },
    {
      name: "Bacteria;Bacteroidetes;Bacteroidia;Bacteroidales;Bacteroidaceae;Bacteroides;Bacteroides faecis",
      probiotic: true,
      essential: true,
    },
    {
      name: "Bacteria;Bacteroidetes;Bacteroidia;Bacteroidales;Bacteroidaceae;Bacteroides;Bacteroides finegoldii",
      probiotic: true,
      essential: true,
    },
    {
      name: "Bacteria;Bacteroidetes;Bacteroidia;Bacteroidales;Bacteroidaceae;Bacteroides;Bacteroides massiliensis",
      probiotic: true,
      essential: true,
    },
    {
      name: "Bacteria;Bacteroidetes;Bacteroidia;Bacteroidales;Bacteroidaceae;Bacteroides;Bacteroides ovatus",
      probiotic: true,
      essential: true,
    },
    {
      name: "Bacteria;Bacteroidetes;Bacteroidia;Bacteroidales;Bacteroidaceae;Bacteroides;Bacteroides thetaiotaomicron",
      probiotic: true,
      essential: true,
    },
    {
      name: "Bacteria;Bacteroidetes;Bacteroidia;Bacteroidales;Bacteroidaceae;Bacteroides;Bacteroides uniformis",
      probiotic: true,
      essential: true,
    },
    {
      name: "Bacteria;Bacteroidetes;Bacteroidia;Bacteroidales;Bacteroidaceae;Bacteroides;Bacteroides vulgatus",
      probiotic: true,
      essential: true,
    },
    {
      name: "Bacteria;Bacteroidetes;Bacteroidia;Bacteroidales;Porphyromonadaceae;Barnesiella;Barnesiella intestinihominis",
      probiotic: true,
      essential: false,
    },
    {
      name: "Bacteria;Bacteroidetes;Bacteroidia;Bacteroidales;Porphyromonadaceae;Butyricimonas;Butyricimonas paravirosa",
      probiotic: true,
      essential: true,
    },
    {
      name: "Bacteria;Bacteroidetes;Bacteroidia;Bacteroidales;Porphyromonadaceae;Odoribacter;Odoribacter laneus",
      probiotic: true,
      essential: false,
    },
    {
      name: "Bacteria;Bacteroidetes;Bacteroidia;Bacteroidales;Porphyromonadaceae;Parabacteroides;Parabacteroides distasonis",
      probiotic: true,
      essential: true,
    },
    {
      name: "Bacteria;Bacteroidetes;Bacteroidia;Bacteroidales;Porphyromonadaceae;Parabacteroides;Parabacteroides merdae",
      probiotic: true,
      essential: true,
    },
    {
      name: "Bacteria;Bacteroidetes;Bacteroidia;Bacteroidales;Prevotellaceae;Prevotella;Prevotella copri",
      probiotic: true,
      essential: false,
    },
    {
      name: "Bacteria;Bacteroidetes;Bacteroidia;Bacteroidales;Rikenellaceae;Alistipes;Alistipes senegalensis",
      probiotic: true,
      essential: false,
    },
    {
      name: "Bacteria;Firmicutes;Clostridia;Clostridiales;Eubacteriaceae;Eubacterium;Eubacterium coprostanoligenes",
      probiotic: true,
      essential: false,
    },
    {
      name: "Bacteria;Firmicutes;Clostridia;Clostridiales;Lachnospiraceae;Anaerostipes;Anaerostipes hadrus",
      probiotic: true,
      essential: true,
    },
    {
      name: "Bacteria;Firmicutes;Clostridia;Clostridiales;Lachnospiraceae;Blautia;Blautia obeum",
      probiotic: true,
      essential: true,
    },
    {
      name: "Bacteria;Firmicutes;Clostridia;Clostridiales;Lachnospiraceae;Clostridium XlVa;Clostridium amygdalinum",
      probiotic: true,
      essential: true,
    },
    {
      name: "Bacteria;Firmicutes;Clostridia;Clostridiales;Lachnospiraceae;Clostridium XlVa;Clostridium clostridioforme",
      probiotic: true,
      essential: false,
    },
    {
      name: "Bacteria;Firmicutes;Clostridia;Clostridiales;Lachnospiraceae;Clostridium XlVa;Clostridium indolis",
      probiotic: true,
      essential: true,
    },
    {
      name: "Bacteria;Firmicutes;Clostridia;Clostridiales;Lachnospiraceae;Clostridium XlVa;Clostridium saccharolyticum",
      probiotic: true,
      essential: false,
    },
    {
      name: "Bacteria;Firmicutes;Clostridia;Clostridiales;Lachnospiraceae;Clostridium XlVa;Eubacterium contortum",
      probiotic: true,
      essential: false,
    },
    {
      name: "Bacteria;Firmicutes;Clostridia;Clostridiales;Lachnospiraceae;Clostridium XlVa;Eubacterium fissicatena",
      probiotic: true,
      essential: true,
    },
    {
      name: "Bacteria;Firmicutes;Clostridia;Clostridiales;Lachnospiraceae;Clostridium XlVb;Clostridium lactatifermentans",
      probiotic: true,
      essential: false,
    },
    {
      name: "Bacteria;Firmicutes;Clostridia;Clostridiales;Lachnospiraceae;Dorea;Dorea longicatena",
      probiotic: true,
      essential: true,
    },
    {
      name: "Bacteria;Firmicutes;Clostridia;Clostridiales;Lachnospiraceae;Fusicatenibacter;Fusicatenibacter saccharivorans",
      probiotic: true,
      essential: false,
    },
    {
      name: "Bacteria;Firmicutes;Clostridia;Clostridiales;Lachnospiraceae;Lachnobacterium;Lachnobacterium bovis",
      probiotic: true,
      essential: true,
    },
    {
      name: "Bacteria;Firmicutes;Clostridia;Clostridiales;Lachnospiraceae;Lachnospira;Lachnospira pectinoschiza",
      probiotic: true,
      essential: false,
    },
    {
      name: "Bacteria;Firmicutes;Clostridia;Clostridiales;Lachnospiraceae;Lachnospiracea_incertae_sedis;Eubacterium eligens",
      probiotic: true,
      essential: false,
    },
    {
      name: "Bacteria;Firmicutes;Clostridia;Clostridiales;Lachnospiraceae;Lachnospiracea_incertae_sedis;Eubacterium hallii",
      probiotic: true,
      essential: true,
    },
    {
      name: "Bacteria;Firmicutes;Clostridia;Clostridiales;Lachnospiraceae;Lachnospiracea_incertae_sedis;Eubacterium ruminantium",
      probiotic: true,
      essential: true,
    },
    {
      name: "Bacteria;Firmicutes;Clostridia;Clostridiales;Lachnospiraceae;Lachnospiracea_incertae_sedis;Eubacterium xylanophilum",
      probiotic: true,
      essential: false,
    },
    {
      name: "Bacteria;Firmicutes;Clostridia;Clostridiales;Lachnospiraceae;Lachnospiracea_incertae_sedis;Lachnospira pectinoschiza",
      probiotic: true,
      essential: false,
    },
    {
      name: "Bacteria;Firmicutes;Clostridia;Clostridiales;Lachnospiraceae;Lachnospiracea_incertae_sedis;Ruminococcus gnavus",
      probiotic: true,
      essential: false,
    },
    {
      name: "Bacteria;Firmicutes;Clostridia;Clostridiales;Lachnospiraceae;Roseburia;Roseburia inulinivorans",
      probiotic: true,
      essential: true,
    },
    {
      name: "Bacteria;Firmicutes;Clostridia;Clostridiales;Lachnospiraceae;Ruminococcus2;Ruminococcus torques",
      probiotic: true,
      essential: false,
    },
    {
      name: "Bacteria;Firmicutes;Clostridia;Clostridiales;Peptococcaceae;Desulfonispora;Desulfonispora thiosulfatigenes",
      probiotic: false,
      essential: false,
    },
    {
      name: "Bacteria;Firmicutes;Clostridia;Clostridiales;Ruminococcaceae;Anaerotruncus;Anaerotruncus colihominis",
      probiotic: false,
      essential: false,
    },
    {
      name: "Bacteria;Firmicutes;Clostridia;Clostridiales;Ruminococcaceae;Butyricicoccus;Butyricicoccus pullicaecorum",
      probiotic: false,
      essential: false,
    },
    {
      name: "Bacteria;Firmicutes;Clostridia;Clostridiales;Ruminococcaceae;Clostridium IV;Eubacterium siraeum",
      probiotic: false,
      essential: false,
    },
    {
      name: "Bacteria;Firmicutes;Clostridia;Clostridiales;Ruminococcaceae;Faecalibacterium;Faecalibacterium prausnitzii",
      probiotic: false,
      essential: false,
    },
    {
      name: "Bacteria;Firmicutes;Clostridia;Clostridiales;Ruminococcaceae;Flavonifractor;Flavonifractor plautii",
      probiotic: false,
      essential: false,
    },
    {
      name: "Bacteria;Firmicutes;Clostridia;Clostridiales;Ruminococcaceae;Gemmiger;Gemmiger formicilis",
      probiotic: false,
      essential: false,
    },
    {
      name: "Bacteria;Firmicutes;Clostridia;Clostridiales;Ruminococcaceae;Intestinimonas;Intestinimonas butyriciproducens",
      probiotic: false,
      essential: false,
    },
    {
      name: "Bacteria;Firmicutes;Clostridia;Clostridiales;Ruminococcaceae;Oscillibacter;Oscillibacter valericigenes",
      probiotic: false,
      essential: false,
    },
    {
      name: "Bacteria;Firmicutes;Clostridia;Clostridiales;Ruminococcaceae;Ruminococcus;Ruminococcus callidus",
      probiotic: false,
      essential: false,
    },
    {
      name: "Bacteria;Firmicutes;Negativicutes;Selenomonadales;Acidaminococcaceae;Phascolarctobacterium;Phascolarctobacterium faecium",
      probiotic: false,
      essential: false,
    },
    {
      name: "Bacteria;Fusobacteria;Fusobacteriia;Fusobacteriales;Fusobacteriaceae;Fusobacterium;Clostridium rectum",
      probiotic: false,
      essential: false,
    },
    {
      name: "Bacteria;Proteobacteria;Alphaproteobacteria;Kiloniellales;Kiloniellaceae;Kiloniella;Kiloniella laminariae",
      probiotic: false,
      essential: false,
    },
    {
      name: "Bacteria;Proteobacteria;Betaproteobacteria;Burkholderiales;Sutterellaceae;Parasutterella;Parasutterella excrementihominis",
      probiotic: false,
      essential: false,
    },
    {
      name: "Bacteria;Proteobacteria;Deltaproteobacteria;Desulfovibrionales;Desulfovibrionaceae;Bilophila;Bilophila wadsworthia",
      probiotic: false,
      essential: false,
    },
    {
      name: "Bacteria;Proteobacteria;Deltaproteobacteria;Desulfovibrionales;Desulfovibrionaceae;Desulfovibrio;Desulfovibrio fairfieldensis",
      probiotic: false,
      essential: false,
    },
    {
      name: "Bacteria;Proteobacteria;Gammaproteobacteria;Enterobacteriales;Enterobacteriaceae;Escherichia/Shigella;Escherichia coli",
      probiotic: false,
      essential: false,
    },
    {
      name: "Bacteria;Proteobacteria;Gammaproteobacteria;Enterobacteriales;Enterobacteriaceae;Klebsiella;Klebsiella pneumoniae",
      probiotic: false,
      essential: false,
    },
    {
      name: "Bacteria;Verrucomicrobia;Verrucomicrobiae;Verrucomicrobiales;Verrucomicrobiaceae;Akkermansia;Akkermansia muciniphila",
      probiotic: false,
      essential: false,
    },
  ];
}

function medicalConditionPool() {
  return [
    "High blood pressure",
    "Type 2 diabetes",
    "Bronchial asthma",
    "Heart disease",
    "Osteoarthritis",
    "Rheumatoid arthritis",
    "Migraine headaches",
    "Mood disorder",
    "Anxiety",
    "Psychosis",
    "Mood swings",
    "Memory loss",
    "Tremors",
    "Nerve damage",
    "Chronic lung disease",
    "Brain attack",
    "Kidney disease",
    "Liver disease",
    "Underactive thyroid",
    "Overactive thyroid",
    "Acid reflux",
    "Stomach ulcers",
    "Inflammatory bowel disease",
    "Digestive issues",
    "Chronic bronchitis",
    "Lung infection",
    "Tuberculosis",
    "Immune deficiency",
    "Bone thinning",
    "Chronic pain syndrome",
    "Chronic fatigue",
    "Gynecological disorder",
    "Hormonal disorder",
    "Erectile dysfunction",
    "Premenstrual symptoms",
    "Hormonal changes",
    "Eye condition",
    "Skin condition",
    "Allergies",
    "Low red blood cell count",
    "Clogged arteries",
    "Irregular heartbeat",
    "Heart dysfunction",
    "Kidney dysfunction",
    "Liver dysfunction",
    "Eating disorder",
    "Seizures",
    "Gallbladder issues",
    "Stomach inflammation",
    "Swollen blood vessels",
    "Liver inflammation",
    "Cold sores",
    "Sleeping difficulties",
    "Bone disorder",
    "Pancreas inflammation",
    "Non-cancerous growths",
    "Prostate inflammation",
    "Blood clot in lung",
    "Spinal curvature",
    "Sleep disorder",
    "Thyroid growths",
    "Ringing in the ears",
    "Urinary tract issues",
    "Uterine growths",
    "Vein abnormalities",
    "Skin pigmentation disorder",
    "Inherited metabolic disorder",
    "Gluten intolerance",
    "Jaw joint disorder",
    "Blood circulation disorder",
    "Restless legs",
    "Recurring ear disorder",
    "Muscle weakness",
    "High blood pressure during pregnancy",
    "Gallbladder inflammation",
    "Allergic rhinitis",
    "Irritable bowel syndrome",
    "Seasonal affective disorder (SAD)",
    "Tension headache",
    "Rosacea",
  ] as const;
}

/* Encryption */
function saltHashPassword(password: string) {
  const saltRounds = 10;
  const salt = genSaltSync(saltRounds);
  const hash = hashSync(password, salt);
  return { password: hash, salt };
}

/* Bound number inputs */
function clamp(x: number, min: number, max: number) {
  return Math.max(min, Math.min(x, max));
}

/* Options */
async function getOptions() {
  const args = await yargs(process.argv.slice(2))
    .strict()
    .options({
      reset: { type: "boolean", default: false },
      all: { type: "boolean", default: false },
      clear: { type: "boolean", default: false },
      admins: { type: "number", default: 0 },
      doctors: { type: "number", default: 0 },
      patients: { type: "number", default: 0 },
      microorganisms: { type: "number", default: 0 },
      "probiotic-brands": { type: "number", default: 0 },
      "medical-conditions": { type: "number", default: 0 },
      "visit-datas": { type: "number", default: 0 },
      "microorganism-probiotic-brand": { type: "number", default: 0 },
      "medical-condition-patient": { type: "number", default: 0 },
    })
    .coerce({
      admins: (count: number) =>
        clamp(count > 0 ? Math.max(1, count) : 0, 0, 20),
      doctors: (count: number) => clamp(count, 0, 40),
      patients: (count: number) => clamp(count, 0, 50000),
      microorganisms: (count: number) => clamp(count, 0, 59),
      "probiotic-brands": (count: number) =>
        clamp(count > 0 ? Math.max(5, count) : 0, 0, 80),
      "medical-conditions": (count: number) => clamp(count, 0, 80),
      "visit-datas": (count: number) => clamp(count, 0, 400),
      "microorganism-probiotic-brand": (count: number) => clamp(count, 0, 400),
      "medical-condition-patient": (count: number) => clamp(count, 0, 80),
    })
    .parseAsync();

  const { _, $0, all, ...options } = args;
  if (all) {
    return {
      reset: options.reset,
      clear: options.reset || options.clear,
      admins: options.admins || 5,
      doctors: options.doctors || 10,
      patients: options.patients || 40,
      microorganisms: options.microorganisms || 59,
      "probiotic-brands": options["probiotic-brands"] || 40,
      "medical-conditions": options["medical-conditions"] || 40,
      "visit-datas": options["visit-datas"] || 100,
      "microorganism-probiotic-brand":
        options["microorganism-probiotic-brand"] || 160,
      "medical-condition-patient": options["medical-condition-patient"] || 20,
    };
  }
  return {
    reset: options.reset,
    clear: options.reset || options.clear,
    admins: options.admins || 0,
    doctors: options.doctors || 0,
    patients: options.patients || 0,
    microorganisms: options.microorganisms || 0,
    "probiotic-brands": options["probiotic-brands"] || 0,
    "medical-conditions": options["medical-conditions"] || 0,
    "visit-datas": options["visit-datas"] || 0,
    "microorganism-probiotic-brand":
      options["microorganism-probiotic-brand"] || 0,
    "medical-condition-patient": options["medical-condition-patient"] || 0,
  };
}
