import { cn } from "@/lib/utils";
import { type TimeSeriesResultRow } from "@/types/probiotic-record";
import { type RenderCellProps } from "react-data-grid";

interface TimeSeriesProbioticRendererProps
  extends RenderCellProps<TimeSeriesResultRow, TimeSeriesResultRow> {
  onCellExpand: () => void;
}

export function TimeSeriesProbioticRenderer({
  row,
  tabIndex,
  onCellExpand,
}: TimeSeriesProbioticRendererProps) {
  const { probiotic, expanded } = row;
  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      onCellExpand();
    }
  };
  return (
    <div
      className={cn(
        "relative flex items-center",
        expanded === undefined &&
          "pl-[40px] before:absolute before:left-[10px] before:h-full before:w-0 before:border-r before:border-r-secondary-foreground after:absolute after:left-[10px] after:h-0 after:w-[20px] after:border-t after:border-t-secondary-foreground"
      )}
    >
      {probiotic}
      {expanded !== undefined && (
        <button
          tabIndex={tabIndex}
          className="absolute right-0 rounded-sm text-xs leading-none text-secondary-foreground transition-colors hover:text-secondary-foreground/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-transparent"
          onClick={onCellExpand}
          onKeyDown={handleKeyDown}
        >
          {expanded ? "\u25BC" : "\u25B6"}
        </button>
      )}
    </div>
  );
}
