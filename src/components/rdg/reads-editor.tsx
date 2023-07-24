import { type RenderEditCellProps } from "react-data-grid";

const VALUE_REGEX = /^([0-9]{1,})?(\.)?([0-9]{1,})?$/;

function ref(input: HTMLInputElement | null) {
  input?.focus();
  input?.select();
}

export function refineReads(
  reads: string | null,
  newReads: string | number | null
) {
  return typeof newReads === "string" && newReads.match(VALUE_REGEX)
    ? newReads
    : reads;
}

export function ReadsEditor<R, SR>({
  row,
  column,
  onRowChange,
  onClose,
}: RenderEditCellProps<R, SR>) {
  const reads = row[column.key as keyof R];
  return (
    <input
      ref={ref}
      spellCheck={false}
      value={typeof reads === "string" ? reads : ""}
      className="-mx-2 h-full w-[calc(100%+16px)] bg-inherit px-[8px] py-0 focus:outline-none"
      onChange={(e) => {
        const targetValue = e.target.value.match(VALUE_REGEX)
          ? e.target.value
          : reads;
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
