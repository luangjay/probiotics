export type ProbioticRecordResult = {
  probiotic: string | null;
  value: string | null;
};

export type TimeSeriesResult = {
  probiotic: string;
  [timepoint: string]: string | number;
};
