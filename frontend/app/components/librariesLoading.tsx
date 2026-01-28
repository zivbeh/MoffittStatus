import { BookOpen, Search } from "lucide-react";

export function LibrariesLoading() {
  // Create an array of 6 items to fake a full list
  const skeletons = Array.from({ length: 6 });

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      
      <div className="flex flex-col items-center justify-center space-y-4 py-8 text-center">
        <div className="relative">
          <div className="h-16 w-16 bg-blue-100 text-blue-500 rounded-full flex items-center justify-center animate-bounce shadow-sm border-4 border-white">
            <BookOpen className="h-8 w-8" />
          </div>
          <div className="absolute -top-2 -right-2 h-8 w-8 bg-indigo-100 text-indigo-500 rounded-full flex items-center justify-center animate-bounce delay-75 shadow-sm border-2 border-white">
            <Search className="h-4 w-4" />
          </div>
        </div>
        
        <div className="space-y-1">
          <h3 className="text-xl font-bold text-indigo-950">
            Getting Available Seats...
          </h3>
          <p className="text-sm font-medium text-slate-400">
            Waking up the librarians!
          </p>
        </div>
      </div>

      {/* 2. The Card Skeletons */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {skeletons.map((_, i) => (
          <div 
            key={i} 
            className="rounded-[2rem] border-2 border-indigo-50/50 bg-white p-0 overflow-hidden shadow-sm"
          >
            {/* Image Placeholder */}
            <div className="h-48 w-full bg-slate-100 animate-pulse relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
            </div>

            <div className="p-5 space-y-4">
              {/* Title & Button Placeholder */}
              <div className="flex justify-between items-start">
                <div className="h-8 w-2/3 bg-indigo-50 rounded-xl animate-pulse" />
                <div className="h-8 w-8 bg-indigo-50 rounded-full animate-pulse" />
              </div>

              {/* Status Pills Placeholder */}
              <div className="flex gap-2">
                <div className="h-6 w-20 bg-emerald-50 rounded-full animate-pulse" />
                <div className="h-6 w-24 bg-slate-50 rounded-full animate-pulse" />
              </div>

              {/* Room Stats Placeholder */}
              <div className="h-12 w-full bg-indigo-50/50 rounded-2xl animate-pulse" />
              
              {/* Icons Row Placeholder */}
              <div className="flex gap-2 pt-2">
                 {[1,2,3,4].map(j => (
                   <div key={j} className="h-8 w-8 rounded-full bg-slate-50 animate-pulse" />
                 ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}