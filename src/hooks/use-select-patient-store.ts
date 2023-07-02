import { type PatientInfo } from "@/types/user";
import { create } from "zustand";

interface SelectPatientStore {
  patient?: PatientInfo & { fullName: string };
  setPatient: (patient?: PatientInfo & { fullName: string }) => void;
}

export const useSelectPatientStore = create<SelectPatientStore>((set) => ({
  setPatient: (patient) => set((state) => ({ ...state, patient })),
}));
