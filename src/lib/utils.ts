import { cx } from "cva";
import { type ClassValue } from "cva/dist/types";
import pluralizer from "pluralize";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(cx(inputs));
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export function pluralize(word: string, count?: number, inclusive?: boolean) {
  return pluralizer(word, count, inclusive);
}
