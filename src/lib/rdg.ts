import { type SortColumn } from "react-data-grid";

interface Row {
  [k: string]: unknown;
}

type SortFunction<R> = (a: R, b: R) => number;

type objectKey = string | number | symbol;

const numberColumns = new Set<objectKey>(["ssn"]);

const dateColumns = new Set<objectKey>(["birthDate"]);

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

export function filter<R extends Row>(
  rows: R[],
  keys: (keyof R)[],
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
          const val = row[key];
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

export function sort<R extends Row>(
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
  return clipboard
    .replace(
      /"((?:[^"]*(?:\r\n|\n\r|\n|\r))+[^"]+)"/gm,
      (match: string, p1: string) => {
        return p1.replace(/""/g, '"').replace(/\r\n|\n\r|\n|\r/g, " ");
      }
    )
    .split(/\r\n|\n\r|\n|\r/g)
    .filter((row) => row !== "")
    .map((row) => row.split("\t"));
}
