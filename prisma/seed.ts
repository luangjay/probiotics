import { faker } from "@faker-js/faker";
import { Gender, PrismaClient } from "@prisma/client";
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
  // Options
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
      return prisma.doctor.create({
        data: {
          user: {
            create: { username, password, salt, prefix, firstName, lastName },
          },
        },
      });
    })
  );
}

async function seedPatients(count: number) {
  // Options
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

      // Create patients
      return prisma.patient.create({
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
}

async function seedProbiotics() {
  // Options
  faker.seed(42004);
  const count = 50;
  const rootCount = 5;

  return prisma.$transaction(async (tx) => {
    // Initialize probiotic roots
    await Promise.all(
      Array.from({ length: rootCount }, async (_, idx) => {
        // Probiotic fields
        const id = idx;
        const name = id.toString();
        const red = faker.number.int({ min: 0, max: 333 });
        const yellow = faker.number.int({ min: red, max: 666 });
        const green = faker.number.int({ min: yellow, max: 999 });

        // Create probiotics
        return tx.probiotic.create({
          data: { id, name, red, yellow, green },
        });
      })
    );

    // Populate probiotic tree
    for (let idx = 0; idx < count - rootCount; idx++) {
      // Probiotic fields
      const id = idx + rootCount;
      const parentId = faker.number.int({ min: 0, max: id - 1 });
      const { name: parentName } = await tx.probiotic.findUniqueOrThrow({
        where: { id: parentId },
      });
      const name = `${parentName} ${id.toString()}`;
      const red = faker.number.int({ min: 0, max: 333 });
      const yellow = faker.number.int({ min: red, max: 666 });
      const green = faker.number.int({ min: yellow, max: 999 });

      // Create probiotics
      await tx.probiotic.create({
        data: { id, parentId, name, red, yellow, green },
      });
    }
  });
}

/* Custom pools */
// function probioticPool() {
//   return ["Pig", "Dog", "Crow", "Chicken", "Cow", "Buffalo"] as const;
// }

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
