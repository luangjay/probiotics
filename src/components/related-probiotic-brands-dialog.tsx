import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { type ProbioticBrandRow } from "@/types/probiotic-brand";
import { DollarSignIcon } from "lucide-react";

interface RelatedProbioticBrandsDialogProps {
  probioticBrands: ProbioticBrandRow[];
}

export function RelatedProbioticBrandsDialog({
  probioticBrands,
}: RelatedProbioticBrandsDialogProps) {
  return (
    <Dialog>
      <DialogTrigger>
        <DollarSignIcon className="h-[18px] w-[18px]" />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Related probiotic brands</DialogTitle>
          <div>
            {probioticBrands
              .map((probioticBrand) => probioticBrand.name)
              .join(", ")}
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
