import { species } from "@/lib/probiotic";
import { cn } from "@/lib/utils";
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
    <div className="relative -mx-[8px] flex h-full w-[calc(100%+16px)] justify-between px-[8px]">
      <span className="truncate">{column.name}</span>
      <span className="flex items-center justify-center">
        <button
          tabIndex={tabIndex}
          className="rounded-sm text-sm leading-none text-secondary-foreground ring-offset-secondary transition-colors hover:text-secondary-foreground/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          onClick={onExpandAll}
          onKeyDown={handleKeyDown}
        >
          {expanded ? "\u25BC" : "\u25B6"}
        </button>
      </span>
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
    <div className="relative -mx-[8px] flex h-full w-[calc(100%+16px)] justify-between px-[8px]">
      {expanded === undefined && (
        <span className="absolute flex h-full w-[40px] items-center before:absolute before:left-[10px] before:h-full before:w-0 before:rounded-full before:border-r before:border-r-secondary-foreground after:absolute after:left-[10px] after:h-0 after:w-[20px] after:rounded-full after:border-t after:border-t-secondary-foreground">
          <XIcon className="ml-px h-[20px] w-[20px]" strokeWidth={1} />
        </span>
      )}
      <span className={cn("truncate", expanded === undefined && "ml-[40px]")}>
        {expanded === undefined ? species(microorganism) : microorganism}
      </span>
      {expanded !== undefined && (
        <span className="flex items-center justify-center">
          <button
            tabIndex={tabIndex}
            className="rounded-sm text-sm leading-none text-secondary-foreground ring-offset-background transition-colors hover:text-secondary-foreground/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
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
