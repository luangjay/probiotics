export type ProbioticRecordResult = {
  probiotic: string | null;
  value: number | null;
};

export type TimeSeriesResult = {
  probiotic: string;
  [timepoint: string]: string | number;
};
