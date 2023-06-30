import { useRowSelection } from "@/hooks/use-row-selection";
import {
  type SelectColumnOptions,
  type SelectRendererProps,
} from "@/types/rdg";
import {
  SelectCellFormatter,
  type Column,
  type RenderHeaderCellProps,
} from "react-data-grid";

const SELECT_COLUMN_KEY = "select-row";

function HeaderRenderer({ tabIndex }: RenderHeaderCellProps<any, any>) {
  return (
    <SelectCellFormatter
      disabled
      aria-label="Select All"
      tabIndex={tabIndex}
      value={false}
      onChange={() => {
        /* Do nothing */
      }}
    />
  );
}

function SelectRenderer<R>({
  row,
  rowKeyGetter,
  tabIndex,
}: SelectRendererProps<R, any>) {
  const { key, setKey } = useRowSelection();
  const rowKey = rowKeyGetter(row);
  const selected = key === rowKey;
  return (
    <SelectCellFormatter
      aria-label="Select"
      tabIndex={tabIndex}
      value={selected}
      onChange={(checked) => {
        setKey(checked ? rowKey : undefined);
      }}
    />
  );
}

export function selectColumn<R>(
  options: SelectColumnOptions<R>
): Column<any, any> {
  const { rowKeyGetter } = options;
  return {
    key: SELECT_COLUMN_KEY,
    name: "",
    width: 40,
    minWidth: 40,
    maxWidth: 40,
    resizable: false,
    sortable: false,
    frozen: true,
    renderHeaderCell: (p) => <HeaderRenderer {...p} />,
    renderCell: (p) => <SelectRenderer {...p} rowKeyGetter={rowKeyGetter} />,
  };
}
