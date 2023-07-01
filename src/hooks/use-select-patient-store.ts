import { type PatientInfo } from "@/types/user";
import { create } from "zustand";

interface SelectPatientStore {
  patient?: PatientInfo;
  setPatient: (patient?: PatientInfo) => void;
}

export const useSelectPatientStore = create<SelectPatientStore>((set) => ({
  setPatient: (patient) => set((state) => ({ ...state, patient })),
}));
