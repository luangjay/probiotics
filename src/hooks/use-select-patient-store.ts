import { type PatientRow } from "@/types/patient";
import { create } from "zustand";

type SetPatientAction = PatientRow | ((patient?: PatientRow) => PatientRow);

interface SelectPatientStore {
  patient?: PatientRow;
  setPatient: (patient?: SetPatientAction) => void;
}

export const useSelectPatientStore = create<SelectPatientStore>((set) => ({
  setPatient: (patient) =>
    set((state) =>
      typeof patient === "function"
        ? { ...state, patient: patient(state.patient) }
        : { ...state, patient }
    ),
}));
