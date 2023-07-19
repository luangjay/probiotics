import { type RenderEditCellProps } from "react-data-grid";

const VALUE_REGEX = /^([0-9]{1,})?(\.)?([0-9]{1,})?$/;

function ref(input: HTMLInputElement | null) {
  input?.focus();
  input?.select();
}

export function refineValue(value: string | null, newValue: string) {
  return newValue.match(VALUE_REGEX) ? newValue : value;
}

export function ValueEditor<R, SR>({
  row,
  column,
  onRowChange,
  onClose,
}: RenderEditCellProps<R, SR>) {
  const value = row[column.key as keyof R];
  return (
    <input
      ref={ref}
      spellCheck={false}
      value={typeof value === "string" ? value : ""}
      className="-mx-2 h-full w-[calc(100%+16px)] bg-inherit px-[8px] py-0 focus:outline-none"
      onChange={(e) => {
        const targetValue = e.target.value.match(VALUE_REGEX)
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
