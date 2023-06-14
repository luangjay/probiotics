import { faker } from "@faker-js/faker";
import { Gender, Prisma, PrismaClient } from "@prisma/client";
import { genSaltSync, hashSync } from "bcrypt-ts";
import yargs from "yargs";

const prisma = new PrismaClient();

/* Main function */
async function main() {
  console.log();
  const options = await getOptions();
  console.log(options);
  for (const option in options) {
    const count = options[option];
    await seed(option, count);
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
async function seed(option: string, count: unknown) {
  if (typeof count === "number") {
    if (count === 0) return;
    console.time(option);
    switch (option) {
      case "doctors":
        await seedDoctors(count);
        break;
      case "patients":
        await seedPatients(count);
        break;
      default:
        throw new Error("Invalid option");
    }
    console.timeEnd(option);
    return;
  }
  if (typeof count === "boolean") {
    if (!count) return;
    console.time(option);
    switch (option) {
      case "probiotics":
        await seedProbiotics();
        break;
      default:
        throw new Error("Invalid option");
    }
    console.timeEnd(option);
    return;
  }
  throw new Error("Invalid type");
}

async function seedDoctors(count: number) {
  faker.seed(42001);
  return prisma.$transaction(
    Array.from({ length: count }, () => {
      // User fields
      const sex = faker.helpers.arrayElement(["male", "female"] as const);
      const prefix = "Dr.";
      const firstName = faker.person.firstName(sex);
      const lastName = faker.person.lastName(sex);
      const username = faker.internet.userName({ firstName, lastName });
      const { password, salt } = saltHashPassword("secret");

      // Create doctors
      const data = Prisma.validator<Prisma.DoctorCreateInput>()({
        user: {
          create: { username, password, salt, prefix, firstName, lastName },
        },
      });
      return prisma.doctor.create({ data });
    })
  );
}

async function seedPatients(count: number) {
  faker.seed(42002);
  return prisma.$transaction(
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

      const data = Prisma.validator<Prisma.PatientCreateInput>()({
        user: {
          create: { username, password, salt, prefix, firstName, lastName },
        },
        ssn,
        birthDate,
        gender,
      });
      return prisma.patient.create({ data });
    })
  );
}

async function seedProbiotics() {
  faker.seed(42004);
  const pool = probioticPool();
  return prisma.$transaction(async (tx) => {
    // Initialize probiotic roots
    const roots = pool.map((name) => {
      // Each probiotic fields
      const red = faker.number.int({ min: 0, max: 333 });
      const yellow = faker.number.int({ min: red, max: 666 });
      const green = faker.number.int({ min: yellow, max: 999 });

      const data = Prisma.validator<Prisma.ProbioticCreateInput>()({
        name,
        red,
        yellow,
        green,
      });
      return data;
    });
    await tx.probiotic.createMany({
      data: roots,
    });

    // Populate probiotic tree
    const probiotics = Array.from({length:44}, ()=>{
      // Probiotic fields
      const parentId = 
    })
  });
}

/* Custom pools */
function probioticPool() {
  return ["Pig", "Dog", "Crow", "Chicken", "Cow", "Buffalo"] as const;
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
      doctors: { type: "number", default: 0 },
      patients: { type: "number", default: 0 },
      probiotics: { type: "boolean", default: false },
    })
    .coerce({
      doctors: (count: number) => clamp(count, 0, 20),
      patients: (count: number) => clamp(count, 0, 20),
    })
    .parseAsync();

  const { _, $0, ...options } = args;
  return options;
}
