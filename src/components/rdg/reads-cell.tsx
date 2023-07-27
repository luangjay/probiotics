import { DeleteVisitDataDialog } from "@/components/delete-visit-data-dialog";
import { RelatedProbioticBrandsDialog } from "@/components/related-probiotic-brands-dialog";
import { type ProbioticBrandRow } from "@/types/probiotic-brand";
import {
  type MicrobiomeChangeRow,
  type VisitDataRow,
} from "@/types/visit-data";
import { Trash2Icon } from "lucide-react";
import { type RenderHeaderCellProps } from "react-data-grid";

interface ReadsHeaderCellProps
  extends RenderHeaderCellProps<MicrobiomeChangeRow, MicrobiomeChangeRow> {
  visitData: VisitDataRow;
  probioticBrands: ProbioticBrandRow[];
}

export function ReadsHeaderCell({
  column,
  tabIndex,
  visitData,
  probioticBrands,
}: ReadsHeaderCellProps) {
  return (
    <div className="relative flex h-full w-full justify-between">
      <span className="truncate">{column.name}</span>
      <span className="flex items-center gap-2">
        <RelatedProbioticBrandsDialog probioticBrands={probioticBrands} />
        <DeleteVisitDataDialog
          visitData={visitData}
          trigger={
            <button
              tabIndex={tabIndex}
              className="rounded-sm text-secondary-foreground ring-offset-background transition-colors hover:text-secondary-foreground/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <Trash2Icon className="h-[18px] w-[18px]" />
            </button>
          }
        />
      </span>
    </div>
  );
}
