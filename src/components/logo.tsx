import { PillIcon } from "lucide-react";
import * as React from "react";

interface LogoProps extends React.HTMLAttributes<HTMLSpanElement> {}

const Logo = React.forwardRef<HTMLSpanElement, LogoProps>(
  ({ className, ...props }, ref) => (
    <span
      className="inline-flex select-none items-center gap-2 font-logo text-[3rem] font-medium leading-[36px]"
      ref={ref}
      {...props}
    >
      <PillIcon className="h-5 w-5" />
      Probiotics
    </span>
  )
);
Logo.displayName = "Logo";

export { Logo };
