import { cx } from "cva";
import { type ClassValue } from "cva/dist/types";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(cx(inputs));
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export function union<T>(...sets: Set<T>[]): Set<T> {
  const arr = ([] as T[]).concat(...sets.map((set) => Array.from(set)));
  return new Set<T>(arr);
}
