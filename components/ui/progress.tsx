// components/ui/progress.tsx
'use client';

import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";

import { cn } from "@/lib/utils"; // Ensure this path is correct

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>
>(({ className, value = 0, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn(
      "relative h-4 w-full overflow-hidden rounded-full bg-secondary border border-black",
      className
    )}
    {...props}
  >
    <ProgressPrimitive.Indicator
      className={cn(
        "h-full w-full flex-1 transition-all",
        (value ?? 0) < 40 ? "bg-green-500" : // Green if less than 40
        (value ?? 0) >= 40 && (value ?? 0) <= 70 ? "bg-yellow-500" : // Yellow if between 40 and 70
        "bg-red-500" // Red if above 70
      )}
      style={{ transform: `translateX(-${100 - (value ?? 0)}%)` }} // Handle the case where value could be null or undefined
    />
  </ProgressPrimitive.Root>
));

Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress };
