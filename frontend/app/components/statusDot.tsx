import React from "react";
import { cn } from "@/lib/utils";

interface StatusDotProps {
  variant?: "success" | "warning" | "error" | "neutral" | string;
  className?: string;
  colors:any;
}

export function StatusDot({ colors, className }: StatusDotProps) {
  return (
    <span className={cn("relative flex h-2 w-2", className)}>
      <span 
        className={cn(
          "animate-ping absolute inline-flex h-full w-full rounded-full opacity-75", 
          colors ? colors.ping : ""
        )} 
      />
      
      <span 
        className={cn(
          "relative inline-flex rounded-full h-2 w-2", 
          colors ? colors.ping : ""
        )} 
      />
    </span>
  );
}