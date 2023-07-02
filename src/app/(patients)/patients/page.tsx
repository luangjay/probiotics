import { PatientList } from "@/components/patient-list";
import { getPatients } from "@/lib/patient";

export default async function Page() {
  const patients = await getPatients();

  return (
    <div className="flex h-full flex-col gap-4">
      <PatientList patients={patients} />
    </div>
  );
}
