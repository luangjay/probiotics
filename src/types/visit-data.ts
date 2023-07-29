import { type DoctorRow } from "@/types/doctor";
import { type MicroorganismRecord } from "@prisma/client";
import { type ProbioticBrandRow } from "./probiotic-brand";

export type VisitDataRow = {
  id: string;
  fileUri: string | null;
  collectionDate: Date;
  microorganismRecords: MicroorganismRecord[];
  createdAt: Date;
  updatedAt: Date;
  doctor: DoctorRow;
};

export type MicrobiomeChangeRow = {
  microorganism: string;
  timepoints: {
    [timepoint: string]: number;
  };
  probiotic?: boolean;
  essential?: boolean;
  active?: boolean;
  probioticBrands?: ProbioticBrandRow[];
  expanded?: boolean;
  children?: MicrobiomeChangeRow[];
};
