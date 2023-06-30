import { type Key } from "react";
import { Row, type RenderRowProps } from "react-data-grid";

export function renderRow<R>(
  key: Key,
  p: RenderRowProps<R>,
  selectedRowKey?: Key
) {
  if (key !== selectedRowKey) {
    return <Row {...p} key={key} />;
  }
  return <Row {...p} aria-selected key={key} />;
}
