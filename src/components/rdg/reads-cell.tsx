import { EditVisitDataDialog } from "@/components/edit-visit-data-dialog";
import { type MicroorganismRow } from "@/types/microorganism";
import {
  type MicrobiomeChangeRow,
  type VisitDataRow,
} from "@/types/visit-data";
import { EditIcon } from "lucide-react";
import { type RenderHeaderCellProps } from "react-data-grid";

interface ReadsHeaderCellProps
  extends RenderHeaderCellProps<MicrobiomeChangeRow, MicrobiomeChangeRow> {
  visitData: VisitDataRow;
  microorganisms: MicroorganismRow[];
}

export function ReadsHeaderCell({
  column,
  tabIndex,
  visitData,
  microorganisms,
}: ReadsHeaderCellProps) {
  return (
    <div className="relative flex">
      {column.name}
      <span className="flex items-center gap-[8px]">
        <EditVisitDataDialog
          visitData={visitData}
          microorganisms={microorganisms}
          trigger={
            <button
              tabIndex={tabIndex}
              onClick={(e) => {
                void e.stopPropagation();
              }}
            >
              <EditIcon className="h-[18px] w-[18px]" />
            </button>
          }
        />
      </span>
    </div>
  );
}
