import * as fs from "fs";
import * as xlsx from "xlsx";

/* READ */
const mExcelPath = "prisma/microorganisms.xlsx";
const pExcelPath = "prisma/probiotic-brands.xlsx";

/* WRITE */
const mJsonPath = "prisma/microorganisms.json";
const pJsonPath = "prisma/probiotic-brands.json";
const mpJsonPath = "prisma/microorganism-probiotic-brands.json";

function main() {
  const json1 = readExcel(mExcelPath, 2);
  const mJson = json1.slice(1).map((row) => ({
    name: row.slice(0, 7).join(";"),
    probiotic: Boolean(row[8]),
    essential: Boolean(row[9]),
  }));
  writeJson(mJsonPath, mJson);

  const table = Object.fromEntries(
    json1
      .slice(1, 41)
      .map((row) => [row[10] as string, row.slice(0, 7).join(";")])
  );
  console.log(table);

  const json2 = readExcel(pExcelPath, 0);
  const pJson = json2[0].slice(1, 1492);
  writeJson(pJsonPath, pJson);
}

// Function to read the Excel file
function readExcel(path: string, sheetIdx = 0) {
  const workbook = xlsx.readFile(path);

  const sheetName = workbook.SheetNames[sheetIdx];
  const worksheet = workbook.Sheets[sheetName];

  const json = xlsx.utils.sheet_to_json<unknown[]>(worksheet, {
    header: 1,
  });

  return json;
}

function writeJson(path: string, json: unknown) {
  const text = JSON.stringify(json);
  fs.writeFile(path, text, "utf8", (err) => {
    if (err) {
      console.error("Error writing JSON file:", err);
    } else {
      console.log("JSON file has been saved:", path);
    }
  });
}

main();
