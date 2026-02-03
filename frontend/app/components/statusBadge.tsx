
import { cn, getDynamicStyles } from "@/lib/utils";
import { StatusDot } from "./statusDot";

export function StatusBadge({crowdLevel=0, variant="", className=""}){
    const colorMap = {
        success: { bg: "bg-emerald-100 text-emerald-400", ping: "bg-emerald-400" }, // Open
        warning: { bg: "bg-amber-100 text-ember-400", ping: "bg-amber-400" },     // Closing Soon
        closed:   { bg: "bg-rose-100 text-rose-400", ping: "bg-rose-400", name:'Closed' },       // Closed
        neutral: { bg: "bg-slate-100 text-slate-400", ping: "bg-slate-300" },     // Unknown
        NotCrowded: { bg: "bg-green-100 text-green-400 ", ping: "bg-green-300" },
        NotTooCrowded: { bg: "bg-yellow-100 text-yellow-400", ping: "bg-yellow-300" },
        Crowded: { bg: "bg-orange-100 text-orange-400", ping: "bg-orange-300" },
        AtCapacity: { bg: "bg-red-100 text-red-600", ping: "bg-red-300" }
      };
    //   console.log((variant=="" ? (getDynamicStyles(crowdLevel).statusType || 'success') : variant))
      const colors = colorMap[variant=="" ? (getDynamicStyles(crowdLevel).statusType || 'success') : variant];
    return(
    <div className={cn("flex items-center font-bold py-1 px-3 rounded-full",className, colors ? colors.bg : "")}>
    <StatusDot 
      colors={colors}
      className="mr-2" 
    />
    {variant=="" ? getDynamicStyles(crowdLevel).statusName : colors?.name || 'Closed'}
  </div>
    )
}