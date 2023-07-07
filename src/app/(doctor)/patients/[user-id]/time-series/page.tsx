import { TimeSeriesResults } from "@/components/time-series-results";
import { getPatientWithAll } from "@/server/api/patient";
import { getTimeSeriesResults } from "@/server/api/probiotic-record";

interface PageProps {
  params: {
    "user-id": string;
  };
}

export default async function Page({ params }: PageProps) {
  const userId = params["user-id"];
  const patient = await getPatientWithAll(userId);
  const timeSeriesResults = await getTimeSeriesResults(
    patient.probioticRecords
  );

  return (
    <div className="flex h-full flex-col gap-4 text-sm">
      <TimeSeriesResults
        patient={patient}
        timeSeriesResults={timeSeriesResults}
      />
    </div>
  );
}
