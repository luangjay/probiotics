import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { BadgeAlertIcon } from "lucide-react";
import { useState } from "react";

interface FormErrorTooltipProps {
  message?: string;
}

export function FormErrorTooltip({ message }: FormErrorTooltipProps) {
  const [open, setOpen] = useState(false);

  if (!message) {
    return <></>;
  }
  return (
    <TooltipProvider>
      <Tooltip delayDuration={200} open={open} onOpenChange={setOpen}>
        <TooltipTrigger asChild>
          <button
            type="button"
            className={cn(
              "overflow-hidden focus-visible:outline-destructive/50"
            )}
            onClick={() => void setOpen(true)}
          >
            <BadgeAlertIcon className="h-5 w-5 fill-destructive text-destructive-foreground" />
          </button>
        </TooltipTrigger>
        <TooltipContent className="bg-destructive text-sm text-destructive-foreground">
          <p>{message}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
