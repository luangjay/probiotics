// import { type PatientRow } from "@/types/patient";
// import { SelectCellFormatter, type RenderCellProps } from "react-data-grid";

// function LinkCellRenderer({ row, tabIndex }: RenderCellProps<PatientRow, any>) {
//   const { patient, setPatient } = useSelectPatientStore();
//   const value = patient?.id === row.id;
//   return (
//     <SelectCellFormatter
//       aria-label="Select"
//       tabIndex={tabIndex}
//       value={value}
//       onChange={(checked) => {
//         void setPatient(checked ? row : undefined);
//       }}
//     />
//   );
// }
