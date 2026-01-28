import React from "react";
import { cn } from "@/lib/utils"; // Assuming you have a cn utility (standard in Shadcn)
// If no cn utility, just use template literals: `classA ${className}`

interface StatusDotProps {
  variant?: "success" | "warning" | "error" | "neutral";
  className?: string;
}

export function StatusDot({ variant = "success", className }: StatusDotProps) {
  
  // Color mapping matching your friendly theme
  const colorMap = {
    success: { bg: "bg-emerald-500", ping: "bg-emerald-400" }, // Open
    warning: { bg: "bg-amber-500", ping: "bg-amber-400" },     // Closing Soon
    error:   { bg: "bg-rose-500", ping: "bg-rose-400" },       // Closed
    neutral: { bg: "bg-slate-400", ping: "bg-slate-300" },     // Unknown
  };

  const colors = colorMap[variant];

  return (
    <span className={cn("relative flex h-3 w-3", className)}>
      {/* The Ping Animation (Outer Ring) */}
      <span 
        className={cn(
          "animate-ping absolute inline-flex h-full w-full rounded-full opacity-75", 
          colors.ping
        )} 
      />
      
      {/* The Solid Dot (Inner Circle) */}
      <span 
        className={cn(
          "relative inline-flex rounded-full h-3 w-3", 
          colors.bg
        )} 
      />
    </span>
  );
}