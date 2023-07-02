import { TimeSeriesResults } from "@/components/time-series-results";
import { getPatient } from "@/lib/patient";
import { getTimeSeriesResults } from "@/lib/probiotic-record";

interface PageProps {
  params: {
    "user-id": string;
  };
}

export default async function Page({ params }: PageProps) {
  const userId = params["user-id"];
  const { probioticRecords, ...patient } = await getPatient(userId);
  const {keys, timeSeriesResults} = await getTimeSeriesResults(probioticRecords);

  return (
    <div className="flex h-full flex-col gap-4 text-sm">
      <TimeSeriesResults
        patient={patient}
        timeSeriesResults={timeSeriesResults}
      />
    </div>
  );
}
