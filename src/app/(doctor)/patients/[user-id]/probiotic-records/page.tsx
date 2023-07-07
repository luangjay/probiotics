import { ProbioticRecordList } from "@/components/probiotic-record-list";
import { getPatient } from "@/server/api/patient";
import { getProbiotics } from "@/server/api/probiotic-record";

interface PageProps {
  params: {
    "user-id": string;
  };
}

export default async function Page({ params }: PageProps) {
  const userId = params["user-id"];
  const patient = await getPatient(userId);
  const probiotics = await getProbiotics();

  return (
    <div className="flex h-full flex-col gap-4 text-sm">
      <ProbioticRecordList patient={patient} probiotics={probiotics} />
    </div>
  );
}
