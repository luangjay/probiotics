import { type DoctorRow } from "@/types/doctor";
import { type ProbioticBrandRow } from "@/types/probiotic-brand";
import { type Prisma } from "@prisma/client";

export type ProbioticRecordRow = {
  id: string;
  fileUri: string | null;
  result: Prisma.JsonValue;
  createdAt: Date;
  updatedAt: Date;
  doctor: DoctorRow;
  probioticBrands: ProbioticBrandRow[];
};

export type TimeSeriesResult = {
  probiotic: string;
  [timepoint: string]: string | number;
};

export type ProbioticRecordResultEntry = {
  probiotic: string;
  value: number;
};

export type ProbioticRecordResultRow = {
  idx: number;
  probiotic: string | null;
  value: string | null;
};
