import { type MicrobiomeChangeRow } from "@/types/visit-data";
import { XIcon } from "lucide-react";
import {
  type RenderCellProps,
  type RenderHeaderCellProps,
} from "react-data-grid";

interface MicroorganismHeaderCellProps
  extends RenderHeaderCellProps<MicrobiomeChangeRow, MicrobiomeChangeRow> {
  expanded: boolean;
  onExpandAll: () => void;
}

export function MicroorganismHeaderCell({
  column,
  tabIndex,
  expanded,
  onExpandAll,
}: MicroorganismHeaderCellProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      onExpandAll();
    }
  };
  return (
    <div className="relative flex items-center">
      {column.name}
      <button
        tabIndex={tabIndex}
        className="absolute right-0 rounded-sm text-xs leading-none text-secondary-foreground transition-colors hover:text-secondary-foreground/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-transparent"
        onClick={onExpandAll}
        onKeyDown={handleKeyDown}
      >
        {expanded ? "\u25BC" : "\u25B6"}
      </button>
    </div>
  );
}

interface MicroorganismCellProps
  extends RenderCellProps<MicrobiomeChangeRow, MicrobiomeChangeRow> {
  onExpand: () => void;
}

export function MicroorganismCell({
  row,
  tabIndex,
  onExpand,
}: MicroorganismCellProps) {
  const { microorganism, expanded } = row;
  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      onExpand();
    }
  };
  return (
    <div className="relative -mx-[8px] h-full w-[calc(100%+16px)] truncate pl-[8px] pr-[40px]">
      {expanded === undefined && (
        <div className="flex w-[40px] items-center before:absolute before:left-[10px] before:h-full before:w-0 before:rounded-full before:border-r before:border-r-secondary-foreground after:absolute after:left-[10px] after:h-0 after:w-[20px] after:rounded-full after:border-t after:border-t-secondary-foreground">
          <XIcon className="ml-px h-[20px] w-[20px]" strokeWidth={1} />
        </div>
      )}
      {microorganism}aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
      {expanded !== undefined && (
        <span className="right-0 h-[40px] w-[40px]">
          <button
            tabIndex={tabIndex}
            className="rounded-sm text-xs leading-none text-secondary-foreground transition-colors hover:text-secondary-foreground/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-transparent"
            onClick={onExpand}
            onKeyDown={handleKeyDown}
          >
            {expanded ? "\u25BC" : "\u25B6"}
          </button>
        </span>
      )}
    </div>
  );
}
