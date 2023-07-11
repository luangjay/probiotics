import { cn } from "@/lib/utils";
import { PillIcon } from "lucide-react";
import * as React from "react";

interface LogoProps extends React.HTMLAttributes<HTMLSpanElement> {}

const Logo = React.forwardRef<HTMLSpanElement, LogoProps>(
  ({ className, ...props }, ref) => (
    <span
      className={cn(
        "inline-flex select-none items-center gap-2 font-logo text-[3rem] font-medium leading-none",
        className
      )}
      ref={ref}
      {...props}
    >
      <PillIcon className="h-6 w-6" />
      Probiotics
    </span>
  )
);
Logo.displayName = "Logo";

export { Logo };
