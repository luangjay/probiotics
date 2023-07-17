import { useSelectPatientStore } from "@/hooks/use-select-patient-store";
import { type PatientRow } from "@/types/patient";
import {
  SelectCellFormatter,
  type Column,
  type RenderCellProps,
  type RenderHeaderCellProps,
} from "react-data-grid";

const SELECT_COLUMN_KEY = "select-row";

export const selectPatientColumn: Column<PatientRow> = {
  key: SELECT_COLUMN_KEY,
  name: "",
  width: 40,
  minWidth: 40,
  maxWidth: 40,
  resizable: false,
  sortable: false,
  frozen: true,
  renderHeaderCell: (p) => <HeaderRenderer {...p} />,
  renderCell: (p) => <SelectRenderer {...p} />,
};

function HeaderRenderer({ tabIndex }: RenderHeaderCellProps<PatientRow>) {
  const { patient, setPatient } = useSelectPatientStore();
  const value = patient !== undefined;
  return (
    <SelectCellFormatter
      aria-label="Select All"
      tabIndex={tabIndex}
      value={value}
      onChange={(checked) => {
        if (!checked) {
          void setPatient(undefined);
        }
      }}
    />
  );
}

function SelectRenderer({ row, tabIndex }: RenderCellProps<PatientRow>) {
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
