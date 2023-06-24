import { faker } from "@faker-js/faker";
import { Gender, PrismaClient } from "@prisma/client";
import { genSaltSync, hashSync } from "bcrypt-ts";
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
  console.time(`${reset ? "Reset" : `Seeded ${count}`} ${option} in`);
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
    case "probiotics":
      await seedProbiotics({ reset, clear, count });
      break;
    case "probiotic_brands":
      await seedProbioticBrands({ reset, clear, count });
      break;
    case "medical_conditions":
      await seedMedicalConditions({ reset, clear, count });
      break;
    case "probiotic_records":
      await seedProbioticRecords({ reset, clear, count });
      break;
    case "probiotic_brand_probiotic_record":
      await seedProbioticBrandProbioticRecord({ reset, clear, count });
      break;
    case "medical_condition_patient":
      await seedMedicalConditionPatient({ reset, clear, count });
      break;
    default:
      throw new Error("Invalid option");
  }
  console.timeEnd(`${reset ? "Reset" : `Seeded ${count}`} ${option} in`);
}

async function seedAdmins({ reset, clear, count }: SeedOptions) {
  // Options
  faker.seed(42001);
  const rootCount = 1;

  return prisma.$transaction(async (tx) => {
    if (clear) {
      await tx.user.deleteMany({
        where: !reset ? { NOT: { admin: null } } : undefined,
      });
      if (reset) return;
    }
    // Initialize admin roots
    await Promise.all(
      Array.from({ length: rootCount }, async () => {
        // User fields
        const email = "root@luangjay.com";
        const prefix = "Dr.";
        const firstName = "Root*";
        const lastName = "Tree->";
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
              create: { username, password, salt, prefix, firstName, lastName },
            },
          },
        });
      })
    );
  });
}

async function seedDoctors({ reset, clear, count }: SeedOptions) {
  // Options
  faker.seed(42002);

  return prisma.$transaction(async (tx) => {
    if (clear) {
      await tx.user.deleteMany({
        where: { NOT: { doctor: null } },
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
              create: { username, password, salt, prefix, firstName, lastName },
            },
          },
        });
      })
    );
  });
}

async function seedPatients({ reset, clear, count }: SeedOptions) {
  // Options
  faker.seed(42003);

  return prisma.$transaction(async (tx) => {
    if (clear) {
      await tx.user.deleteMany({
        where: { NOT: { patient: null } },
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
        const username = faker.internet.userName({ firstName, lastName });
        const { password, salt } = saltHashPassword("secret");

        // Patient fields
        const cis = faker.datatype.boolean(0.8);
        const ssn = faker.number.int({ min: 4.2e13, max: 4.21e13 }).toString();
        const birthDate = faker.date.birthdate();
        const gender = cis
          ? sex === "male"
            ? Gender.Male
            : Gender.Female
          : Gender.Others;

        // Create patients
        return tx.patient.create({
          data: {
            user: {
              create: { username, password, salt, prefix, firstName, lastName },
            },
            ssn,
            birthDate,
            gender,
          },
        });
      })
    );
  });
}

async function seedProbiotics({ reset, clear, count }: SeedOptions) {
  // Options
  faker.seed(42005);
  const rootCount = 5;

  return prisma.$transaction(async (tx) => {
    if (clear) {
      await tx.probiotic.deleteMany();
      if (reset) return;
    }
    // Initialize probiotic roots
    const probioticIds = await Promise.all(
      Array.from({ length: rootCount }, async (_, idx) => {
        // Probiotic fields
        const name = idx.toString();
        const red = faker.number.int({ min: 0, max: 333 });
        const yellow = faker.number.int({ min: red, max: 666 });
        const green = faker.number.int({ min: yellow, max: 999 });

        // Create probiotics
        const probiotic = await tx.probiotic.create({
          data: { name, red, yellow, green },
        });
        return probiotic.id;
      })
    );

    // Id of the first probiotic created
    const offset = probioticIds[0];

    // Populate probiotic tree
    for (let idx = rootCount; idx < count; idx++) {
      // Probiotic fields
      const parentId = faker.number.int({
        min: offset,
        max: offset + idx - 1,
      });
      const { name: parentName } = await tx.probiotic.findUniqueOrThrow({
        where: { id: parentId },
      });
      const name = `${parentName} ${idx.toString()}`;
      const red = faker.number.int({ min: 0, max: 333 });
      const yellow = faker.number.int({ min: red, max: 666 });
      const green = faker.number.int({ min: yellow, max: 999 });

      // Create probiotics
      await tx.probiotic.create({
        data: { parentId, name, red, yellow, green },
      });
    }
  });
}

async function seedProbioticBrands({ reset, clear, count }: SeedOptions) {
  // Options
  faker.seed(42006);

  // Probiotic brand fields
  const names = faker.helpers.uniqueArray(() => faker.person.lastName(), count);

  // Create probiotic brands
  return prisma.$transaction(async (tx) => {
    if (clear) {
      await tx.probioticBrand.deleteMany();
      if (reset) return;
    }
    await tx.probioticBrand.createMany({
      data: Array.from({ length: count }, (_, idx) => ({
        name: names[idx],
      })),
    });
  });
}

async function seedMedicalConditions({ reset, clear, count }: SeedOptions) {
  // Options
  faker.seed(42007);
  const pool = medicalConditionPool();

  // Medical condition fields
  const names = faker.helpers.uniqueArray(pool, count);

  // Create medical conditions
  return prisma.$transaction(async (tx) => {
    if (clear) {
      await tx.medicalCondition.deleteMany();
      if (reset) return;
    }
    await tx.medicalCondition.createMany({
      data: Array.from({ length: count }, (_, idx) => ({
        name: names[idx],
      })),
    });
  });
}

async function seedProbioticRecords({ reset, clear, count }: SeedOptions) {
  // Options
  faker.seed(42008);

  // Initialize
  const doctors = await prisma.doctor.findMany();
  const patients = await prisma.patient.findMany();
  const probiotics = await prisma.probioticBrand.findMany();

  const doctorIds = doctors.map((doctor) => doctor.userId);
  const patientIds = patients.map((patient) => patient.userId);
  const probioticNames = probiotics.map((probiotic) => probiotic.name);

  return prisma.$transaction(async (tx) => {
    if (clear) {
      await tx.probioticRecord.deleteMany();
      if (reset) return;
    }
    await Promise.all(
      Array.from({ length: count }, () => {
        // Probiotic record fields
        const doctorId = faker.helpers.arrayElement(doctorIds);
        const patientId = faker.helpers.arrayElement(patientIds);
        const entries = faker.number.int({ min: 20, max: 40 });
        const _probioticNames = faker.helpers.arrayElements(
          probioticNames,
          entries
        );
        const result = Array.from({ length: entries }, (_, idx) => ({
          [_probioticNames[idx]]: faker.number.int({ min: 0, max: 999 }),
        })).reduce((acc, cur) => ({ ...acc, ...cur }), {});

        // Create probiotic records
        return tx.probioticRecord.create({
          data: { doctorId, patientId, result },
        });
      })
    );
  });
}

async function seedProbioticBrandProbioticRecord({
  reset,
  clear,
  count,
}: SeedOptions) {
  // Options
  faker.seed(42009);

  // Initialize
  const probioticBrands = await prisma.probioticBrand.findMany();
  const probioticRecords = await prisma.probioticRecord.findMany();

  const probioticBrandIds = probioticBrands.map(
    (probioticBrand) => probioticBrand.id
  );
  const probioticRecordIds = probioticRecords.map(
    (probioticRecord) => probioticRecord.id
  );

  return prisma.$transaction(async (tx) => {
    if (clear) {
      await tx.probioticBrandProbioticRecord.deleteMany();
      if (reset) return;
    }
    await Promise.all(
      Array.from({ length: count }, () => {
        // Probiotic brand probiotic record fields
        const probioticBrandId = faker.helpers.arrayElement(probioticBrandIds);
        const probioticRecordId =
          faker.helpers.arrayElement(probioticRecordIds);

        // Create probiotic brand probiotic record
        return tx.probioticBrandProbioticRecord.create({
          data: { probioticBrandId, probioticRecordId },
        });
      })
    );
  });
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

  return prisma.$transaction(async (tx) => {
    if (clear) {
      await tx.medicalConditionPatient.deleteMany();
      if (reset) return;
    }
    await Promise.all(
      Array.from({ length: count }, (_, idx) => {
        // Medical condition patient fields
        const id = idx;
        const medicalConditionId =
          faker.helpers.arrayElement(medicalConditionIds);
        const patientId = faker.helpers.arrayElement(patientIds);

        // Create medical condition patient
        return tx.medicalConditionPatient.create({
          data: { id, medicalConditionId, patientId },
        });
      })
    );
  });
}

/* Custom pools */
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
/* eslint-disable @typescript-eslint/naming-convention */
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
      probiotics: { type: "number", default: 0 },
      probiotic_brands: { type: "number", default: 0 },
      medical_conditions: { type: "number", default: 0 },
      probiotic_records: { type: "number", default: 0 },
      probiotic_brand_probiotic_record: { type: "number", default: 0 },
      medical_condition_patient: { type: "number", default: 0 },
    })
    .coerce({
      admins: (count: number) =>
        clamp(count > 0 ? Math.max(1, count) : 0, 0, 20),
      doctors: (count: number) => clamp(count, 0, 40),
      patients: (count: number) => clamp(count, 0, 40),
      probiotics: (count: number) =>
        clamp(count > 0 ? Math.max(5, count) : 0, 0, 80),
      probiotic_brands: (count: number) =>
        clamp(count > 0 ? Math.max(5, count) : 0, 0, 80),
      medical_conditions: (count: number) => clamp(count, 0, 80),
      probiotic_records: (count: number) => clamp(count, 0, 400),
      probiotic_brand_probiotic_record: (count: number) => clamp(count, 0, 400),
      medical_condition_patient: (count: number) => clamp(count, 0, 80),
    })
    .parseAsync();

  const { _, $0, all, ...options } = args;
  if (all) {
    return {
      reset: options.reset,
      clear: options.reset || options.clear,
      admins: options.admins || 5,
      doctors: options.doctors || 10,
      patients: options.patients || 10,
      probiotics: options.probiotics || 40,
      probiotic_brands: options.probiotic_brands || 40,
      medical_conditions: options.medical_conditions || 40,
      probiotic_records: options.probiotic_records || 80,
      probiotic_brand_probiotic_record:
        options.probiotic_brand_probiotic_record || 80,
      medical_condition_patient: options.medical_condition_patient || 20,
    };
  }
  return {
    reset: options.reset,
    clear: options.reset || options.clear,
    admins: options.admins || 0,
    doctors: options.doctors || 0,
    patients: options.patients || 0,
    probiotics: options.probiotics || 0,
    probiotic_brands: options.probiotic_brands || 0,
    medical_conditions: options.medical_conditions || 0,
    probiotic_records: options.probiotic_records || 0,
    probiotic_brand_probiotic_record:
      options.probiotic_brand_probiotic_record || 0,
    medical_condition_patient: options.medical_condition_patient || 0,
  };
}
/* eslint-enable @typescript-eslint/naming-convention */
