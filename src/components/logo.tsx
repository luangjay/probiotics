import { PillIcon } from "lucide-react";
import * as React from "react";

interface LogoProps extends React.HTMLAttributes<HTMLDivElement> {}

const Logo = React.forwardRef<HTMLDivElement, LogoProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className="flex select-none items-center gap-2 font-logo text-[3rem] font-medium leading-none ring-offset-background transition-colors"
      {...props}
    >
      <PillIcon className="h-5 w-5 leading-[2.25rem]" />
      Probiotics
    </div>
  )
);
Logo.displayName = "Logo";

export { Logo };
