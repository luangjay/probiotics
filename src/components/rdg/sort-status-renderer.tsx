import { type RenderSortStatusProps } from "react-data-grid";

export function SortStatusRenderer({
  sortDirection,
  priority,
}: RenderSortStatusProps) {
  if (!sortDirection) return <></>;
  return (
    <>
      {sortDirection === "ASC" ? "\u25B2" : "\u25BC"}
      {priority}
    </>
  );
}
