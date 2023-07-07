import { type DoctorInfo } from "@/types/api/doctor";
import { type ProbioticBrand, type ProbioticRecord } from "@prisma/client";

export type ProbioticRecordWithDoctor = ProbioticRecord & {
  doctor: DoctorInfo;
};

export type ProbioticRecordResult = {
  Probiotic: string | null;
  Value: number | null;
};

export type ProbioticRecordResultRow = {
  idx: number;
  probiotic: string | null;
  value: string | null;
};

export type TimeSeriesResult = {
  probiotic: string;
  [timepoint: string]: string | number;
};

export type ProbioticRecordWithBrands = {
  probioticBrands: ProbioticBrand[];
};
