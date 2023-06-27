import { type RenderHeaderCellProps } from "react-data-grid";

export interface FilterRendererProps<T> extends RenderHeaderCellProps<T> {
  children: JSX.Element;
}

export function FilterRenderer<T>({
  column,
  children,
}: FilterRendererProps<T>) {
  return (
    <>
      <div
        className="flex h-[39px] items-center px-2 font-semibold leading-[38px] text-accent-foreground"
        style={{
          borderBlockEnd: "1px solid var(--accent-foreground)",
        }}
      >
        {column.name}
      </div>
      <div className="flex h-[40px] px-2 py-1 font-normal">{children}</div>
    </>
  );
}
