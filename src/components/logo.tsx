import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "cva";
import { PillIcon } from "lucide-react";
import * as React from "react";

const logoVariants = cva(
  "inline-flex select-none items-center gap-2 font-logo text-[3rem] font-medium leading-none",
  {
    variants: {
      size: {
        default: "gap-2 text-[3rem] leading-[36px]",
        lg: "gap-2.5 text-[3.75rem] leading-[45px]",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
);

interface LogoProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof logoVariants> {}

const Logo = React.forwardRef<HTMLSpanElement, LogoProps>(
  ({ className, size, ...props }, ref) => (
    <span
      className={cn(logoVariants({ size, className }))}
      ref={ref}
      {...props}
    >
      <PillIcon
        className={cn(
          size !== "lg" ? "h-5 w-5" : "h-[1.5625rem] w-[1.5625rem]"
        )}
      />
      Probiotics
    </span>
  )
);
Logo.displayName = "Logo";

export { Logo };
