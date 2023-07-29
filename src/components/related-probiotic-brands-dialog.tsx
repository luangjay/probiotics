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
      <DialogContent className="h-[90vh]">
        <DialogHeader>
          <DialogTitle>Related probiotic brands</DialogTitle>
        </DialogHeader>
        <div className="custom-scroll flex h-full flex-col overflow-auto text-sm">
          {probioticBrands.map((probioticBrand, idx) => (
            <div key={`related_probiotic_brand_${idx}`}>
              {probioticBrand.name}
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
