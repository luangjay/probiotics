import { type DoctorInfo } from "@/types/api/doctor";
import { type ProbioticBrand, type ProbioticRecord } from "@prisma/client";

export type TimeSeriesResult = {
  probiotic: string;
  [timepoint: string]: string | number;
};

export type ProbioticRecordResult = {
  [x: string]: number;
};

export type ProbioticRecordWithDoctor = ProbioticRecord & {
  doctor: DoctorInfo;
};

export type ProbioticRecordWithBrands = ProbioticRecord & {
  probioticBrands: ProbioticBrand[];
};

export type ProbioticRecordResultEntry = {
  Probiotic: string | null;
  Value: number | null;
};

export type ProbioticRecordResultRow = {
  idx: number;
  probiotic: string | null;
  value: string | null;
};
