import { type TimeSeriesResultRow } from "@/types/probiotic-record";
import { type RenderCellProps } from "react-data-grid";

interface ProbioticCellExpanderProps
  extends RenderCellProps<TimeSeriesResultRow, TimeSeriesResultRow> {
  expanded?: boolean;
  onCellExpand: () => void;
}

export function ProbioticCellExpander({
  row,
  tabIndex,
  expanded,
  onCellExpand,
}: ProbioticCellExpanderProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      onCellExpand();
    }
  };

  return (
    <div className="relative">
      {row.probiotic}
      {expanded !== undefined && (
        <span className="absolute right-0">
          <button
            tabIndex={tabIndex}
            className="rounded-sm text-xs leading-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
            onClick={onCellExpand}
            onKeyDown={handleKeyDown}
          >
            {expanded ? "\u25BC" : "\u25B6"}
          </button>
        </span>
      )}
    </div>
  );
}
