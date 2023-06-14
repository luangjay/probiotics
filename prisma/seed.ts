import { faker } from "@faker-js/faker";
import { Prisma, PrismaClient } from "@prisma/client";
import { genSaltSync, hashSync } from "bcrypt-ts";
import yargs from "yargs";

const prisma = new PrismaClient();

/* Main function */
async function main() {
  faker.seed(6969);
  const options = await getOptions();
  for (const option in options) {
    const count = options[option];
    if (typeof count !== "number") {
      throw new TypeError("Invalid count");
    }
    if (count > 0) {
      console.time(option);
      await seed(option, count);
      console.timeEnd(option);
    }
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
async function seed(option: string, count: number) {
  switch (option) {
    case "doctor":
      await seedDoctors(count);
      break;
    default:
      throw new Error("Invalid option");
  }
}

async function seedDoctors(count: number) {
  return prisma.$transaction(
    Array.from({ length: count }, () => {
      // User fields
      const sex = faker.datatype.boolean(0.5) ? "male" : "female";
      const prefix = faker.person.prefix(sex);
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

// async function seedPatients(count: number) {
//   return prisma.$transaction(
//     Array.from({ length: count }, () => {
//       // User fields
//       const sex = faker.datatype.boolean(0.5) ? "male" : "female";
//       const prefix = faker.person.prefix(sex);
//       const firstName = faker.person.firstName(sex);
//       const lastName = faker.person.lastName(sex);
//       const username = faker.internet.userName({ firstName, lastName });
//       const { password, salt } = saltHashPassword("secret");

//       // Patient fields
//       const birthDate = faker.date.birthdate();

//       const data = Prisma.validator<Prisma.PatientCreateInput>()({
//         user: {
//           create: { username, password, salt, prefix, firstName, lastName },
//         },
//       });
//       return prisma.patient.create({ data });
//     })
//   );
// }

/* Encryption */
function saltHashPassword(password: string) {
  const saltRounds = 10;
  const salt = genSaltSync(saltRounds);
  const hash = hashSync(password, salt);
  return { password: hash, salt };
}

/* Limit number inputs */
function clamp(x: number, min: number, max: number) {
  return Math.max(min, Math.min(x, max));
}

/* Options */
async function getOptions() {
  const args = await yargs(process.argv.slice(2))
    .strict()
    .options({
      doctor: { type: "number", default: 0 },
    })
    .coerce({
      doctor: (count: number) => clamp(count, 1, 20),
    })
    .parseAsync();

  const { _, $0, ...options } = args;
  return options;
}
