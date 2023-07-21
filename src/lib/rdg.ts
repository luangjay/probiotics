import { type SortColumn } from "react-data-grid";

interface Row {
  [k: string]: unknown;
}

type SortFunction<R> = (a: R, b: R) => number;

const numberColumns = new Set<string | number | symbol>(["ssn"]);

const dateColumns = new Set<string | number | symbol>(["birthDate"]);

function sortFunction<R extends Row>(key: keyof R): SortFunction<R> {
  if (numberColumns.has(key)) {
    return numberSortFunction(key);
  }
  if (dateColumns.has(key)) {
    return dateSortFunction(key);
  }
  return textSortFunction(key);
}

function textSortFunction<R extends Row>(key: keyof R): SortFunction<R> {
  return (a, b) =>
    ((a[key] ?? "") as string).localeCompare((b[key] ?? "") as string);
}

function numberSortFunction<R extends Row>(key: keyof R): SortFunction<R> {
  return (a, b) => ((a[key] ?? 0) as number) - ((b[key] ?? 0) as number);
}

function dateSortFunction<R extends Row>(key: keyof R): SortFunction<R> {
  return (a, b) =>
    ((a[key] ?? new Date(0)) as Date).getTime() -
    ((b[key] ?? new Date(0)) as Date).getTime();
}

export function filteredRows<R extends Row>(
  rows: R[],
  keys: string[],
  filter?: string | null
) {
  if (!filter) return rows;
  const t = filter.toLowerCase().split(/\s+/);
  if (t.length === 0) return rows;

  return rows.filter((row) =>
    t.reduce(
      (acc, cur) =>
        acc &&
        keys.some((key) => {
          const val = row[key as keyof R];
          if (typeof val === "string") {
            return val.toLowerCase().includes(cur);
          }
          if (val instanceof Date) {
            return val.toLocaleDateString().includes(cur);
          }
          return false;
        }),
      true
    )
  );
}

export function sortedRows<R extends Row>(
  rows: R[],
  sortColumns: readonly SortColumn[]
) {
  return [...rows].sort((a, b) => {
    for (const col of sortColumns) {
      const fn = sortFunction(col.columnKey as keyof R);
      const compResult = fn(a, b);
      if (compResult !== 0) {
        return col.direction === "ASC" ? compResult : -compResult;
      }
    }
    return 0;
  });
}

// Thanks https://gist.github.com/torjusb/7d6baf4b68370b4ef42f
export function splitClipboard(clipboard: string) {
  const rows = clipboard
    .replace(
      /"((?:[^"]*(?:\r\n|\n\r|\n|\r))+[^"]+)"/gm,
      (match: string, p1: string) => {
        return p1.replace(/""/g, '"').replace(/\r\n|\n\r|\n|\r/g, " ");
      }
    )
    .split(/\r\n|\n\r|\n|\r/g)
    .filter((row) => row !== "")
    .map((row) => row.split("\t"));

  console.log(rows);
  return rows;
}

export function formatReads(
  normalized: boolean,
  value: string | number,
  total: string | number
) {
  if (value === 0) return null;
  return normalized && typeof total === "number" && typeof value === "number"
    ? (value / total).toFixed(4)
    : value;
}
