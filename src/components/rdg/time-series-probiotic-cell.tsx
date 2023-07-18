import { type TimeSeriesResultRow } from "@/types/probiotic-record";
import { XIcon } from "lucide-react";
import { type RenderCellProps } from "react-data-grid";

interface TimeSeriesProbioticCellProps
  extends RenderCellProps<TimeSeriesResultRow, TimeSeriesResultRow> {
  onExpand: () => void;
}

export function TimeSeriesProbioticCell({
  row,
  tabIndex,
  onExpand,
}: TimeSeriesProbioticCellProps) {
  const { probiotic, expanded } = row;
  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      onExpand();
    }
  };
  return (
    <div className="relative flex items-center">
      {expanded === undefined && (
        <div className="flex w-[40px] items-center before:absolute before:left-[10px] before:h-full before:w-0 before:rounded-full before:border-r before:border-r-secondary-foreground after:absolute after:left-[10px] after:h-0 after:w-[20px] after:rounded-full after:border-t after:border-t-secondary-foreground">
          <XIcon className="ml-px h-[20px] w-[20px]" strokeWidth={1} />
        </div>
      )}
      {probiotic}
      {expanded !== undefined && (
        <button
          tabIndex={tabIndex}
          className="absolute right-0 rounded-sm text-xs leading-none text-secondary-foreground transition-colors hover:text-secondary-foreground/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-transparent"
          onClick={onExpand}
          onKeyDown={handleKeyDown}
        >
          {expanded ? "\u25BC" : "\u25B6"}
        </button>
      )}
    </div>
  );
}
