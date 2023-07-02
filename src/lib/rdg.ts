import { type SortFunction } from "@/types/rdg";
import { type SortColumn } from "react-data-grid";

interface Row {
  [x: string]: unknown;
}

const numberColumns = new Set<string | number | symbol>(["ssn"]);

const dateColumns = new Set<string | number | symbol>(["birthDate"]);

export function filtered<R extends Row>(rows: R[], filter?: string | null) {
  if (!filter) return rows;
  const t = filter.toLowerCase().split(/\s+/);
  if (t.length === 0) return rows;
  return rows.filter((row) =>
    t.reduce(
      (acc, cur) =>
        acc &&
        Object.keys(row).some((key) => {
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

export function sorted<R extends Row>(
  rows: R[],
  sortColumns: readonly SortColumn[]
) {
  // if (rows.length === 0) return rows;

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
  return (a, b) => (a[key] as string).localeCompare(b[key] as string);
}

function numberSortFunction<R extends Row>(key: keyof R): SortFunction<R> {
  return (a, b) => (a[key] as number) - (b[key] as number);
}

function dateSortFunction<R extends Row>(key: keyof R): SortFunction<R> {
  return (a, b) => (a[key] as Date).getTime() - (b[key] as Date).getTime();
}
