import { type DoctorInfo } from "@/types/doctor";
import {
  type Doctor,
  type ProbioticBrand,
  type ProbioticRecord,
} from "@prisma/client";

export type ProbioticRecordRow = ProbioticRecord & {
  doctor: Doctor[];
  probioticBrands: ProbioticBrand[];
};

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
