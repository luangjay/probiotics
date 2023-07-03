import * as React from "react";

import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

interface ValidateNumberKeyOptions {
  op: boolean;
  float: boolean;
  expo: boolean;
}

const validateNumberKey = (
  e: React.KeyboardEvent<HTMLInputElement>,
  options: Partial<ValidateNumberKeyOptions> = {}
) => {
  const { op = false, float = false, expo = false } = options;

  const invalidKeys = [" "];
  const opKeys = ["+", "-"];
  const floatKeys = ["."];
  const expoKeys = ["e", "E"];

  if (
    invalidKeys.includes(e.key) ||
    (!op && opKeys.includes(e.key)) ||
    (!float && floatKeys.includes(e.key)) ||
    (!expo && expoKeys.includes(e.key))
  ) {
    e.preventDefault();
  }
};

export { Input, validateNumberKey };
