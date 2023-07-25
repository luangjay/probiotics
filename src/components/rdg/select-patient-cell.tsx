import { useSelectPatientStore } from "@/hooks/use-select-patient-store";
import { type PatientRow } from "@/types/patient";
import {
  SelectCellFormatter,
  type RenderCellProps,
  type RenderHeaderCellProps,
} from "react-data-grid";

interface SelectPatientHeaderCellProps<R, SR = unknown>
  extends RenderHeaderCellProps<R, SR> {}

export function SelectPatientHeaderCell({
  tabIndex,
}: SelectPatientHeaderCellProps<PatientRow>) {
  const { patient, setPatient } = useSelectPatientStore();
  const value = patient !== undefined;
  return (
    <SelectCellFormatter
      aria-label="Select All"
      value={value}
      tabIndex={tabIndex}
      onChange={(checked) => {
        if (!checked) {
          void setPatient(undefined);
        }
      }}
    />
  );
}

interface SelectPatientCellProps<R, SR = unknown>
  extends RenderCellProps<R, SR> {}

export function SelectPatientCell({
  row,
  tabIndex,
}: SelectPatientCellProps<PatientRow>) {
  const { patient, setPatient } = useSelectPatientStore();
  const value = patient?.id === row.id;
  return (
    <SelectCellFormatter
      aria-label="Select"
      tabIndex={tabIndex}
      value={value}
      onChange={(checked) => {
        void setPatient(checked ? row : undefined);
      }}
    />
  );
}
