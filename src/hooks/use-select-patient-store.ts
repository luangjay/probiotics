import { type PatientWithAll } from "@/types/api/patient";
import { create } from "zustand";

interface SelectPatientStore {
  patient?: PatientWithAll;
  setPatient: (patient?: PatientWithAll) => void;
}

export const useSelectPatientStore = create<SelectPatientStore>((set) => ({
  setPatient: (patient) => set((state) => ({ ...state, patient })),
}));
