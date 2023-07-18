import { type TimeSeriesResultRow } from "@/types/probiotic-record";
import { type RenderHeaderCellProps } from "react-data-grid";

interface TimeSeriesProbioticHeaderProps
  extends RenderHeaderCellProps<TimeSeriesResultRow, TimeSeriesResultRow> {
  expanded: boolean;
  onExpandAll: () => void;
}

export function TimeSeriesProbioticHeader({
  tabIndex,
  expanded,
  onExpandAll,
}: TimeSeriesProbioticHeaderProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      onExpandAll();
    }
  };
  return (
    <div className="relative flex items-center">
      Probiotic
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
