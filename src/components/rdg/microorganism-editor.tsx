import { type RenderEditCellProps } from "react-data-grid";

const PROBIOTIC_REGEX = /^[a-zA-Z0-9\s/_;]*$/;

function ref(input: HTMLInputElement | null) {
  input?.focus();
  input?.select();
}

export function refineMicroorganism(
  microorganism: string | null,
  newMicroorganism: string | number | null
) {
  return typeof newMicroorganism === "string" &&
    newMicroorganism.match(PROBIOTIC_REGEX)
    ? newMicroorganism
    : microorganism;
}

interface MicroorgranismEditorProps<R, SR> extends RenderEditCellProps<R, SR> {}

export function MicroorganismEditor<R, SR>({
  row,
  column,
  onRowChange,
  onClose,
}: MicroorgranismEditorProps<R, SR>) {
  const microorganism = row[column.key as keyof R];
  return (
    <input
      ref={ref}
      value={typeof microorganism === "string" ? microorganism : ""}
      className="-mx-[8px] h-full w-[calc(100%+16px)] bg-inherit px-[8px] py-0 focus:outline-none"
      spellCheck={false}
      onChange={(e) => {
        const targetValue = e.target.value.match(PROBIOTIC_REGEX)
          ? e.target.value
          : microorganism;
        onRowChange({
          ...row,
          [column.key]:
            typeof targetValue === "string" && targetValue.length !== 0
              ? targetValue
              : null,
        });
      }}
      onBlur={() => onClose(true, false)}
    />
  );
}
