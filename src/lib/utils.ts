import { cx } from "cva";
import { type ClassValue } from "cva/dist/types";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(cx(inputs));
}
