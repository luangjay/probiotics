export type ProbioticRecordResult = {
  probiotic?: string;
  value?: number;
};

export type TimeSeriesResult = {
  probiotic: string;
  [timepoint: string]: string | number;
};
