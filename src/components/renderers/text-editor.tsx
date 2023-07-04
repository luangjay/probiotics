import { type RenderEditCellProps } from "react-data-grid";

function ref(input: HTMLInputElement | null) {
  input?.focus();
  input?.select();
}

export function TextEditor<R, SR>({
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
        const targetValue = e.target.value.replace(/[^a-zA-Z0-9.;]/g, "");
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
