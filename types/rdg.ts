import { type Key } from "react";
import { type RenderCellProps } from "react-data-grid";

export type SortFunction<R> = (a: R, b: R) => number;

export type RowKeyGetter<R> = (row: R) => Key;

export interface SelectRendererProps<R, SR> extends RenderCellProps<R, SR> {
  row: R;
  rowKeyGetter: RowKeyGetter<R>;
}

export interface SelectColumnOptions<R> {
  rowKeyGetter: RowKeyGetter<R>;
}
