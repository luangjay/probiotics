import { PatientList } from "@/components/patient-list";
import { getMedicalConditions } from "@/server/api/medical-condition";
import { getPatients } from "@/server/api/patient";

export default async function Page() {
  const patients = await getPatients();
  const medicalConditions = await getMedicalConditions();

  return (
    <div className="flex h-full flex-col gap-4">
      <PatientList patients={patients} medicalConditions={medicalConditions} />
    </div>
  );
}
