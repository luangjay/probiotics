import { DeleteVisitDataDialog } from "@/components/delete-visit-data-dialog";
import {
  type MicrobiomeChangeRow,
  type VisitDataRow,
} from "@/types/visit-data";
import { Trash2Icon } from "lucide-react";
import { type RenderHeaderCellProps } from "react-data-grid";

interface ReadsHeaderCellProps
  extends RenderHeaderCellProps<MicrobiomeChangeRow, MicrobiomeChangeRow> {
  visitData: VisitDataRow;
}

export function ReadsHeaderCell({
  column,
  tabIndex,
  visitData,
}: ReadsHeaderCellProps) {
  return (
    <div className="relative -mx-[8px] flex h-full w-[calc(100%+16px)] justify-between pl-[8px]">
      <span className="flex-1 truncate">{column.name}</span>
      <span className="flex h-[40px] w-[40px] items-center justify-center">
        <DeleteVisitDataDialog
          visitData={visitData}
          trigger={
            <button
              tabIndex={tabIndex}
              className="rounded-sm text-xs leading-none text-secondary-foreground ring-offset-background transition-colors hover:text-secondary-foreground/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <Trash2Icon className="h-[18px] w-[18px]" />
            </button>
          }
        />
      </span>
    </div>
  );
}
