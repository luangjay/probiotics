import { ProbioticRecordList } from "@/components/probiotic-record-list";
import { getPatient } from "@/lib/patient";

interface PageProps {
  params: {
    "user-id": string;
  };
}

export default async function Page({ params }: PageProps) {
  const userId = params["user-id"];
  const { probioticRecords, ...patient } = await getPatient(userId);

  return (
    <div className="flex h-full flex-col gap-4 text-sm">
      <ProbioticRecordList patient={patient} probioticRecords={probioticRecords} />
    </div>
  );
}
