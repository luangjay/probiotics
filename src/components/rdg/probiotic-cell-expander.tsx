import { type RenderCellProps } from "react-data-grid";

interface ProbioticCellExpanderProps extends RenderCellProps<any, any> {
  expanded?: boolean;
  onCellExpand: () => void;
  children: React.ReactNode;
}

export function ProbioticCellExpander({
  tabIndex,
  expanded,
  onCellExpand,
  children,
}: ProbioticCellExpanderProps) {
  function handleKeyDown(e: React.KeyboardEvent<HTMLSpanElement>) {
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      onCellExpand();
    }
  }

  return (
    <div className="relative">
      {children}
      {expanded !== undefined && (
        <span className="absolute right-0">
          <button
            tabIndex={tabIndex}
            className="rounded-sm text-base leading-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
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
