import { type PatientRow } from "@/types/api/patient";
import { create } from "zustand";

interface SelectPatientStore {
  patient?: PatientRow;
  setPatient: (patient?: PatientRow) => void;
}

export const useSelectPatientStore = create<SelectPatientStore>((set) => ({
  setPatient: (patient) => set((state) => ({ ...state, patient })),
}));
