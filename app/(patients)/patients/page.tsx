import prisma from "@/lib/prisma";

import PatientList from "./patient-list";

export default async function Page() {
  const response = await fetch("http://localhost:3000/api/patients");
  const patients = await response.json();

  console.log(patients);

  return (
    <div>
      <h2>Patients</h2>
      <PatientList patients={patients} />
    </div>
  );
}
