import { useSelectPatientStore } from "@/hooks/use-select-patient-store";
import { type PatientInfo } from "@/types/api/patient";
import {
  SelectCellFormatter,
  type Column,
  type RenderCellProps,
  type RenderHeaderCellProps,
} from "react-data-grid";

const SELECT_COLUMN_KEY = "select-row";

export const selectPatientColumn: Column<
  PatientInfo & { fullName: string },
  any
> = {
  key: SELECT_COLUMN_KEY,
  name: "",
  width: 40,
  minWidth: 40,
  maxWidth: 40,
  resizable: false,
  sortable: false,
  frozen: true,
  renderHeaderCell: (p) => <HeaderPatientRenderer {...p} />,
  renderCell: (p) => <SelectPatientRenderer {...p} />,
};

function HeaderPatientRenderer({
  tabIndex,
}: RenderHeaderCellProps<PatientInfo & { fullName: string }, any>) {
  return (
    <SelectCellFormatter
      disabled
      aria-label="Select All"
      tabIndex={tabIndex}
      value={false}
      onChange={() => {
        /* Do nothing */
      }}
    />
  );
}

function SelectPatientRenderer({
  row,
  tabIndex,
}: RenderCellProps<PatientInfo & { fullName: string }, any>) {
  const { patient, setPatient } = useSelectPatientStore();
  const selected = patient?.id === row.id;
  return (
    <SelectCellFormatter
      aria-label="Select"
      tabIndex={tabIndex}
      value={selected}
      onChange={(checked) => {
        setPatient(checked ? row : undefined);
      }}
    />
  );
}
