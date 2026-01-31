'use client'
import { JSX, useEffect, useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import dynamic from "next/dynamic";

const Experience = dynamic(
  () => import("../components/Experience").then((mod) => mod.Experience),
    { ssr: false }
    );
    import { ChevronRight, Clock, DoorOpen, Users } from 'lucide-react'
import React from 'react'
import { handleQuickBook } from '@/lib/libCal'
// 1. Add this helper function outside or above your main function
function formatToAmPm(rangeStr: string) {
  // 1. Split the range string into two parts
  // Input: "2025-12-01 21:00:00 - 2025-12-01 22:00:00"
  const [startStr, endStr] = rangeStr.split(' - ');

  // 2. Helper to format a single date string
  const formatSingle = (dateStr: string) => {
    if (!dateStr) return ""; // Safety check
    
    // Fix Safari/Node date parsing issue
    const date = new Date(dateStr.replace(" ", "T")); 
    
    let hours = date.getHours();
    const ampm = hours >= 12 ? 'pm' : 'am';
    
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    
    return `${hours}${ampm}`;
  };

  // 3. Combine them back
  return `${formatSingle(startStr)}-${formatSingle(endStr)}`;
}
  interface Floor {
    id: string | number;
    name: string;
    time: string;
  }
  
  // Define the props interface
  interface DetailsProps {
    currentLibrary: string;
    floors: Floor[]; // Replaces Array<any> with a specific type
    libraryName: string;
  }
export default function Details({ currentLibrary, floors, libraryName }: DetailsProps): JSX.Element {
    let currentAsset = ""
    let assetList = []
    let count = 0
    const sortedFloors = React.useMemo(() => {
      if (!floors) return [];
      
      return [...floors].sort((a, b) => {
        // 1. Primary Sort: Time (Earliest first)
        // We use 'numeric: true' so that "2 PM" doesn't sort strangely vs "10 PM"
        const timeCompare = a.time.localeCompare(b.time, undefined, { numeric: true });
        
        // If times are different, return that result
        if (timeCompare !== 0) return timeCompare;
    
        // 2. Secondary Sort: Room Name (e.g., "Room 304" before "Room 305")
        return a.name.localeCompare(b.name, undefined, { numeric: true });
      });
    }, [floors]);
    switch(currentLibrary){
        case 'main_stacks':
            break
        case 'kresge':
            // break;
            currentAsset = 'kresge_top'
            assetList = ['kresge_top','kresge_bottom']
            if(floors && floors.length > 0)
                count = 2
            else
                count = 1
            break
        default:
          currentAsset = 'kresge_top'
          assetList = ['kresge_top','kresge_bottom']
          if(floors && floors.length > 0)
              count = 2
          else
              count = 1
        }
    return(
    <>
    <Card className="w-full max-w-4xl">
        <CardHeader>
          <CardTitle>{libraryName}</CardTitle>
          {/* <CardDescription>Select an asset in the library, then inspect it in the viewer.</CardDescription> */}
        </CardHeader>
        
        <CardContent>
          <Tabs defaultValue="library" className="w-full max-w-4xl">
            <TabsList className={`grid w-full max-w-4xl grid-cols-${count} mb-8`}>
             {(floors && floors.length > 0) && <TabsTrigger value="library">Available Rooms</TabsTrigger>}
              {currentAsset && <TabsTrigger value="viewer">3D Viewer</TabsTrigger> }
            </TabsList>
            {floors && 
            <>
            {/* TAB 1: THE LIST */}
            <TabsContent value="library" className="space-y-4 ">
  
  {/* 1. The Container with relative positioning for the fade effect */}
  <div className="relative rounded-[2rem] border-2 border-slate-100 bg-slate-50/50 p-2 bg-transparent">
    
    {/* 2. The Scrollable Area */}
    {/* max-h-[60vh] limits height to 60% of screen. adjust as needed */}
    <div className="
      max-h-[30vh] overflow-y-auto 
      p-2 pr-4
      
      /* Custom Scrollbar Styling (Tailwind arbitrary values) */
      [&::-webkit-scrollbar]:w-2
      [&::-webkit-scrollbar-track]:bg-transparent
      [&::-webkit-scrollbar-thumb]:bg-indigo-100
      [&::-webkit-scrollbar-thumb]:rounded-full
      [&::-webkit-scrollbar-thumb]:border-2
      [&::-webkit-scrollbar-thumb]:border-white
      hover:[&::-webkit-scrollbar-thumb]:bg-indigo-200
    ">
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-1">
    {floors && sortedFloors.map((item) => (
      <Button
        key={item.id + "+" + item.time}
        variant="ghost" // Reset standard button styles
        onClick={async () => {
          if(item.time){
            console.log(item)
            const url = await handleQuickBook(item,new Date())
            if(url)
              window.location.href = url;
          }

        }}
        className="
          group relative h-auto w-full max-w-4xl p-0 
          flex flex-col items-stretch
          bg-white hover:bg-indigo-50/30
          border-2 border-slate-100 hover:border-indigo-200
          rounded-2xl
          shadow-sm hover:shadow-[0_8px_20px_rgb(224,231,255,0.6)]
          transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]
          hover:-translate-y-1
        "
      >
        {/* TOP SECTION: Room Name & Icon */}
        <div className="flex items-center gap-3 p-4 pb-3">
          <div className="
            flex md:h-10 md:w-10 shrink-0 items-center justify-center rounded-xl 
            bg-blue-50 text-blue-500 border border-blue-100
            transition-transform duration-300 ease-spring 
            group-hover:scale-110 group-hover:-rotate-6
          ">
            <DoorOpen className="sm:h-1 sm:w-1 md:h-5 md:w-5" />
          </div>

          <div className="flex flex-col items-start text-wrap">
            <span className="font-bold text-slate-700 truncate w-full  max-w-4xl text-left group-hover:text-indigo-950 transition-colors">
              {item.name.replace(/\s*\(.*?\)\s*/g, '').trim()}
            </span>
          </div>
          
        </div>
        {item.name.match(/\((.*?)\)/) && item.name.match(/\((.*?)\)/)[1] && (
          <div className="flex items-center gap-1.5 pl-4 md:pl-6 h-1 w-1 md:h-2 md:w-2">
            <Users className="h-1 w-1 md:h-2 md:w-2 text-slate-400 items-center justify-center group-hover:text-indigo-400 transition-colors" />
            <span className="text-xs pl-2 md:pl-0 font-semibold text-slate-500 group-hover:text-indigo-500 transition-colors">
              {item.name.match(/\((.*?)\)/)[1].replace('Capacity','')}
            </span>
          </div>
        )}

        <div className="w-full  max-w-4xl border-t-2 border-dashed border-slate-100 group-hover:border-indigo-200/50" />


        <div className="flex items-center justify-between p-3 px-4 bg-slate-50/50 group-hover:bg-indigo-50/30 rounded-b-2xl transition-colors">
          
          {item.time && (
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 group-hover:text-indigo-600 transition-colors">
              <Clock className="h-3.5 w-3.5 text-slate-400 group-hover:text-indigo-400" />
              {formatToAmPm(item.time)}
            </div>
          )}

          {/* "Book" Action Text */}
          <div className="flex items-center text-xs font-bold text-slate-300 group-hover:text-indigo-500 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0 opacity-0 group-hover:opacity-100">
            Book
            <ChevronRight className="ml-1 h-3 w-3" />
          </div>
        </div>
      </Button>
    ))}
  </div>
  {/* <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-20 rounded-b-[2rem] bg-gradient-to-t from-white via-white/80 to-transparent" /> */}
  </div></div>
</TabsContent>
            </>
            }

            {/* TAB 2: THE POPUP TRIGGER */}
            {currentAsset && <>
            <TabsContent value="viewer" className="flex flex-col items-center py-10">
            <div className="h-[600px] w-full max-w-4xl bg-slate-50 border rounded-md overflow-hidden relative">
              <Experience asset={currentAsset} />
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {assetList.map((item) => (
                  <Button
                    key={item}
                    variant={currentAsset === item ? "default" : "outline"}
                    className="h-32 flex flex-col items-center justify-center border-2"
                    onClick={() => setCurrentAsset(item)}
                  >
                    {item}
                  </Button>
                ))}
              </div>
              </div>
            </TabsContent>
            </>
            }
          </Tabs>
        </CardContent>
      </Card>
    </>
    )
}
