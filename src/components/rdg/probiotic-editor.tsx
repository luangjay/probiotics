import { type RenderEditCellProps } from "react-data-grid";

const PROBIOTIC_REGEX = /^[a-zA-Z0-9\s/_;]*$/;

function ref(input: HTMLInputElement | null) {
  input?.focus();
  input?.select();
}

export function refineProbiotic(
  probiotic: string | null,
  newProbiotic: string
) {
  return newProbiotic.match(PROBIOTIC_REGEX) ? newProbiotic : probiotic;
}

export function ProbioticEditor<R, SR>({
  row,
  column,
  onRowChange,
  onClose,
}: RenderEditCellProps<R, SR>) {
  const value = row[column.key as keyof R];
  return (
    <input
      ref={ref}
      value={typeof value === "string" ? value : ""}
      className="-mx-2 h-full w-[calc(100%+1rem)] p-2 focus:outline-none"
      spellCheck={false}
      onChange={(e) => {
        const targetValue = e.target.value.match(PROBIOTIC_REGEX)
          ? e.target.value
          : value;
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
