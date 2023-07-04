export interface ProbioticRecordResult {
  probiotic: string | null;
  value: number | null;
}

export interface ProbioticRecordResultRow {
  idx: number;
  probiotic: string | null;
  value: string | null;
}

export interface TimeSeriesResult {
  probiotic: string;
  [timepoint: string]: string | number;
}
