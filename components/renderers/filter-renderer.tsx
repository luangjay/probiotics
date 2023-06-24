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
      <div className="h-[40px] font-semibold leading-[40px]">{column.name}</div>
      <div className="flex h-[40px] py-1 font-normal">{children}</div>
    </>
  );
}
