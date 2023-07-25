import { type DoctorRow } from "@/types/doctor";
import { type MicroorganismRecord } from "@prisma/client";

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
  essential?: boolean;
  probiotic?: boolean;
  expanded?: boolean;
  children?: MicrobiomeChangeRow[];
};
