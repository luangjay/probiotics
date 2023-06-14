import { parseArgs } from "node:util";
import { faker } from "@faker-js/faker";
import { Gender, PrismaClient } from "@prisma/client";
import type { Doctor, Patient, User } from "@prisma/client";
import { genSaltSync, hashSync } from "bcrypt-ts";
import yargs from "yargs";

interface Arguments {
  [x: string]: unknown;
  doctor: number;
}

async function main() {
  faker.seed(6969);
  const args = await yargs(process.argv.slice(2))
    .options({
      doctor: { type: "number", default: 0 },
    })
    .strict()
    .parseAsync();

  console.log(args);
  console.log(args.doctor);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

// try {
//   const { values } = parseArgs({ args, options, tokens: true });
//   console.log(values);
// } catch (e) {
//   if (e instanceof TypeError) {
//     console.error(e.message);
//   } else {
//     console.log("haha");
//   }
// }
