"use client"

import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"

import { cn } from "@/lib/utils"

function Slider({
  className,
  rangeClassName,
  ...props
}: React.ComponentProps<typeof SliderPrimitive.Root> & { rangeClassName?: string }) {
  return (
    <SliderPrimitive.Root
      data-slot="slider"
      className={cn(
        "relative flex w-full touch-none select-none items-center data-[disabled]:opacity-50  bg-blue-200 rounded-lg h-4",
        className
      )}
      {...props}
    >
      <SliderPrimitive.Track
        data-slot="slider-track"
        className="relative h-4 w-full grow overflow-hidden rounded-full"
      >
        <SliderPrimitive.Range
   style={{ backgroundColor: rangeClassName }}
  
  className={cn("absolute h-full")}>

  </SliderPrimitive.Range>
      </SliderPrimitive.Track>
      <SliderPrimitive.Thumb
        data-slot="slider-thumb"
        className="bg-blue-500 border-blue-800 border-primary bg-background ring-offset-background focus-visible:ring-ring block h-7 w-7 rounded-full border-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
      />
    </SliderPrimitive.Root>
  )
}

export { Slider }