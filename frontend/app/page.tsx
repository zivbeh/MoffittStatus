'use client'; // If this is a client component

import { useState } from 'react';

import * as React from "react";
import Image from "next/image";
import { format } from "date-fns";
import {
  Calendar as CalendarIcon,
  Search,
  Filter,
  Clock,
  MapPin,
  Building,
  Moon,
  Coffee,
  Mic,
  HelpCircle,
  Laptop,
  Volume2,
  BookOpenCheck, 
  Armchair,
  Pin, 
} from "lucide-react";
import {SubmitReport} from './components/submitRating'
import { cn, getDynamicStyles } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import { getAllLibraryRatings } from '@/lib/firebaseMethods';
import { getAllLibraryHours, getAvailableRooms } from '@/lib/libCal';
import Details from '@/app/components/libraryDetails';
import { LibrariesLoading } from './components/librariesLoading';
import { StatusDot } from './components/statusDot';
import { StatusBadge } from './components/statusBadge';

type Library = {
  id: number;
  name: string;
  hours: string;
  isOpen: boolean;
  rooms: Array<unknown>;
  roomsOpen: number;
  roomsTotal: number;
  crowdLevel: number; // 0 to 100
  features?: {
    late?: boolean;
    snacks?: boolean;
    equipment?: boolean;
    research?: boolean;
    study?: boolean;
  };
  nameID:string;
  calID:string;
  url?:string;
  image?:string;
  studyLink?:string;
};

// Configuration for your features
const featureConfig = [
  { 
    key: "late", 
    label: "Late Hours", 
    icon: Moon, 
    activeColor: "text-indigo-500 bg-indigo-50 border-indigo-200 hover:bg-indigo-100",
    iconColor: "fill-indigo-500" // Optional: fills the icon 
  },
  { 
    key: "snacks", 
    label: "Snacks Allowed", 
    icon: Coffee, 
    activeColor: "text-amber-600 bg-amber-50 border-amber-200 hover:bg-amber-100",
    iconColor: "" 
  },
  { 
    key: "equipment", 
    label: "Tech Lending", 
    icon: Laptop, 
    activeColor: "text-blue-500 bg-blue-50 border-blue-200 hover:bg-blue-100",
    iconColor: "" 
  },
  { 
    key: "research", 
    label: "Research Help", 
    icon: BookOpenCheck, 
    activeColor: "text-emerald-600 bg-emerald-50 border-emerald-200 hover:bg-emerald-100",
    iconColor: "" 
  },
  { 
    key: "study", 
    label: "Study Spaces", 
    icon: Armchair, 
    activeColor: "text-rose-500 bg-rose-50 border-rose-200 hover:bg-rose-100",
    iconColor: "" 
  },
];
function hoursFix (input:string) { 
  // if(input.includes('24')){
  //   const temp = input.split('\n')
  //   return [temp.slice(0,8), temp.slice(8)]
  // }
  if (input.includes('Starts')){
    const parts = input.split('Starts')
    return [parts[0].trim(), 'Starts ' + parts[1].trim()]
  }
  if (input.includes('Cal ID')){
    const parts = input.split('Cal ID')
    return [parts[0].trim(), 'Cal ID ' + parts[1].trim()]
  }
  const parts = input.split('.');

  const firstPart = parts.slice(0, 4).join('.') + '.';

  const secondPart = parts.slice(4).join('.').trim();
return [firstPart.trim(), secondPart]
}
function fixData (text:string){
  if(!text)
    return {}
  text = text.toLowerCase()
  return {
    // "Equipment lending" -> equipment
    equipment: text.includes("equipment"),

    // "Evening hours" -> late (As requested)
    late: text.includes("evening") || text.includes("late"),

    // "Research assistance" -> research
    research: text.includes("research"),

    // "Study spaces" -> study
    study: text.includes("study"),
    
    // "Snacks allowed" -> snacks
    snacks: text.includes("snack")
  }
}

export default function LibraryStatusPage() {
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const [libraryData, setLibraryData] = useState<Library[]>()
  const [selectedFilters, setSelectedFilters] = React.useState<string[]>([]);
  const [searchQuery, setSearchQuery] = React.useState("");
  const filteredLibraries = libraryData?.filter((lib) => {
    // 1. Check Tags (Existing logic)
    const matchesTags = selectedFilters.length === 0 || 
      selectedFilters.every((key) => lib.features[key]);
    // 2. Check Search Text (New logic)
    const query = searchQuery.toLowerCase();
    const matchesSearch = 
      lib.name.toLowerCase().includes(query) || (lib.name.replace(/\s*\(.*?\)\s*/g, ' ').trim()).toLowerCase().includes(query) ||
      (lib.address && lib.address.toLowerCase().includes(query)); // Optional: search address too
  
    // Return true only if BOTH match
    return matchesTags && matchesSearch;
  });
  const toggleFilter = (key: string) => {
    setSelectedFilters(prev => 
      prev.includes(key) 
        ? prev.filter(f => f !== key) // Remove if exists
        : [...prev, key]              // Add if not
    );
  };
  // React.useEffect(()=>{
  //   const  loadLibraries= async () => {
  //   const tempRoomData = [[],await getAvailableRooms("6 pm","kresge"),await getAvailableRooms("6 pm","main_stacks")]
    
  //   const tempTimeData = await getAllLibraryHours() || []
  //   console.log(tempTimeData)
  //   setLibraryData([
  //     {
  //       id: 0,
  //       name: "Doe Library",
  //       hours: hoursFix(tempTimeData[7].hours)[0]||"",
  //       calID: hoursFix(tempTimeData[7].hours)[1]||"",
  //       isOpen: (tempTimeData[7].status||'').toLowerCase().includes('open'),
  //       rooms: tempRoomData[0]||[],
  //       roomsOpen: -1, 
  //       roomsTotal: 1,
  //       crowdLevel: (await getLibraryRating("doe")).data.average||60,
  //       features: tempTimeData[7] && tempTimeData[7].services ? fixData(tempTimeData[7].services) : {},
  //       nameID:'doe',
  //       url: tempTimeData[7].googleMapsLink
  //     },
  //     {
  //       id: 1,
  //       name: "Kresge Library",
  //       hours: hoursFix(tempTimeData[10].hours)[0]||"",
  //       calID: hoursFix(tempTimeData[10].hours)[1]||"",
  //       isOpen: (tempTimeData[10].status||'').toLowerCase().includes('open'),
  //       rooms: tempRoomData[1]||[],
  //       roomsOpen: (tempRoomData[1]).length || -1,
  //       roomsTotal: 5,
  //       crowdLevel: (await getLibraryRating("kresge")).data.average||60,
  //       features: tempTimeData[10] && tempTimeData[10].services ? fixData(tempTimeData[10].services) : {},
  //       nameID:"kresge"
  //     },
  //     {
  //       id: 2,
  //       name: "Main Stacks",
  //       hours: hoursFix(tempTimeData[20].hours)[0]||"",
  //       calID: hoursFix(tempTimeData[20].hours)[1]||"",
  //       isOpen: (tempTimeData[20].status||'').toLowerCase().includes('open'),
  //       rooms:tempRoomData[2]||[],
  //       roomsOpen: (tempRoomData[2]).length || -1,
  //       roomsTotal: 17,
  //       crowdLevel: (await getLibraryRating("main_stacks")).data.average||60,
  //       features: tempTimeData[20] && tempTimeData[20].services ? fixData(tempTimeData[20].services) : {},
  //       nameID:'main_stacks'
  //     },
  //   ]);}
  //   loadLibraries();
  // },[])
  function CrowdLevelText(lib) {
    if (lib.crowdLevel <= 25) {
 return     <span className="text-green-600">Not Crowded</span>
} else if (lib.crowdLevel <= 50) {
  return <span className="text-yellow-600">Not too Crowded</span>
} else if (lib.crowdLevel <= 75) {
  return <span className="text-orange-600">Crowded</span>
} else {
  return <span className="text-red-600">At Capacity</span>
}
  }
  function getSlugFromName(name: string): string {
    // Add specific overrides here if your API IDs don't match the names perfectly
    const overrides: Record<string, string> = {
      "Main (Gardner) Stacks": "main_stacks",
      "Moffitt Library": "moffitt",
      "Doe Library": "doe",
      "Kresge Engineering Library": "kresge"
    };
  
    if (overrides[name]) return overrides[name];
  
    return name
      .toLowerCase()
      .replace(/\s+/g, '_') // Replace spaces with underscores
      .replace(/[^\w_]/g, ''); // Remove special chars
  }
  React.useEffect(() => {
    let isMounted = true;
    const loadLibraries = async () => {
      try {
        // 1. Get the base data for all libraries
        // const allLibraries = (await getAllLibraryHours()) || [];
        const [allLibraries, allRatingsRes] = await Promise.all([
          getAllLibraryHours(),
          getAllLibraryRatings()
        ]); 
        console.log("Finished")
        if (!isMounted) return;
        // 2. Map over every library to create a list of Promises
        // This allows us to fetch rooms and ratings for ALL libraries in parallel

          // Generate a "slug" for your API calls (e.g. "Doe Library" -> "doe")
          // You might need to adjust this helper if your APIs need very specific IDs
          // const slug = getSlugFromName(lib.name);
  
          const ratingsRaw = allRatingsRes?.data?.data || []; // Adjust based on your axios response structure
          const ratingsMap: Record<string, number> = {};
          ratingsRaw.forEach((r: any) => {
            const key = getSlugFromName(r.library); 
            ratingsMap[key] = parseFloat(r.average);
          });
    
          console.log("Ratings Map Created:", ratingsMap);

          const initialData = (allLibraries || []).map((lib, index) => {
            const slug = getSlugFromName(lib.name);
            const [displayHours, calID] = hoursFix(lib.hours) || ["", ""];
    
            return {
              id: index,
              name: lib.name,
              hours: displayHours,
              calID: calID,
              isOpen: (lib.status || '').toLowerCase().includes('open'),
              crowdLevel: ratingsMap[slug] || 60,
              features: lib.services ? fixData(lib.services) : {},
              nameID: slug,
              url: lib.googleMapsLink,
              image: lib.imageSrc,
              studyLink: lib.studySpaceLink,
              hasStudySpace: lib.hasStudySpace,
              
              rooms: [], 
              roomsOpen: -1,
              roomsTotal: 0
            };
          });
    
          console.log("Pass 1: Basic info loaded");
          setLibraryData(initialData);
        const libraryPromises = allLibraries!.map(async (lib, index) => {
          // Only fetch rooms if the scraper found a study space link
          // const roomsPromise = lib.hasStudySpace 
          //   ? getAvailableRooms("6 pm", slug).catch(() => []) 
          //   : Promise.resolve([]);
          const slug = getSlugFromName(lib.name);

          const crowdLevel = ratingsMap[slug] || 60;
          
          // Only fetch rooms if needed (We still fetch rooms individually for now)
          const roomData = lib.hasStudySpace 
          ? await getAvailableRooms("6 pm", slug).catch(() => []) 
          : [];
          // Helper to safely parse hours
          const [displayHours, calID] = hoursFix(lib.hours) || ["", ""];
  
          return {
            id: index,
            name: lib.name,
            hours: displayHours,
            calID: calID,
            isOpen: (lib.status || '').toLowerCase().includes('open') || (lib.status || '').toLowerCase().includes('closing soon'),
            
            // Room Logic
            rooms: roomData,
            roomsOpen: roomData.length > 0 ? roomData.length : -1,
            roomsTotal: roomData.length || 0, // Dynamic total based on available data
            
            crowdLevel: crowdLevel,
            
            features: lib.services ? fixData(lib.services) : {},
            nameID: slug,
            url: lib.googleMapsLink,
            image: lib.imageSrc, // Added this from our previous step
            studyLink: lib.studySpaceLink // Added this from our previous step
          };
        });
  
        // 3. Wait for all libraries to finish processing
        const processedData = await Promise.all(libraryPromises);
        
        console.log("Processed Library Data:", processedData);
        setLibraryData(processedData);
  
      } catch (error) {
        console.error("Failed to load library data", error);
      }
    };
  
    loadLibraries();
  }, []);
  const [pinnedIds, setPinnedIds] = useState([])
  const togglePin = (id) => {
    setPinnedIds((prev) => {
      const newPins = prev.includes(id) 
        ? prev.filter((p) => p !== id) // Unpin
        : [...prev, id];               // Pin
      
      // Save to local storage
      localStorage.setItem('pinnedLibs', JSON.stringify(newPins));
      return newPins;
    });
  };
  const sortedLibraries = [...(filteredLibraries || [])].sort((a, b) => {
    const isAPinned = pinnedIds.includes(a.id);
    const isBPinned = pinnedIds.includes(b.id);
    
    if (isAPinned && !isBPinned) return -1; // a comes first
    if (!isAPinned && isBPinned) return 1;  // b comes first
    return 0; // maintain original order
  });
  return (
    <main className="container mx-auto p-4 md:p-8">
      {/* 1. Recommendations Section */}
      {/* <section className="mb-8">
        <h2 className="text-2xl font-semibold tracking-tight mb-4">
          Recommendations
        </h2>

<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-muted/30">
            <CardHeader>
              <CardTitle className="text-lg">Individuals</CardTitle>
              <p className="text-muted-foreground">
                Go to Floor 1 in Moffitt Library
              </p>
            </CardHeader>
          </Card>
          <Card className="bg-muted/30">
            <CardHeader>
              <CardTitle className="text-lg">Groups</CardTitle>
              <p className="text-muted-foreground">Go to Floor D in Main Stacks</p>
            </CardHeader>
          </Card>
        </div>
      </section>

      <hr className="my-8" /> */}

      <section>        
        <div className="space-y-6">
          <div>
            <div className="flex flex-col gap-4 mb-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search libraries..."
                className="pl-10 w-[256px] border-2 border-gray-400"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <SubmitReport></SubmitReport>


              {/* <DatePicker date={date} setDate={setDate} /> */}

              
            </div>

            <div className="flex flex-wrap gap-2">
            <div className="flex flex-wrap gap-2 mb-6">
            {featureConfig.map((feature) => {
              const Icon = feature.icon;
              const isSelected = selectedFilters.includes(feature.key);

              return (
                <Badge
                  key={feature.key}
                  onClick={() => toggleFilter(feature.key)}
                  variant={isSelected ? "default" : "outline"} // Solid if selected, outline if not
                  className={`
                    cursor-pointer select-none transition-all duration-200 gap-1 pr-3
                    ${isSelected 
                      ? `${feature.activeColor} border-transparent font-medium shadow-sm` // Active Style
                      : "text-muted-foreground hover:bg-gray-200/50 border-dashed"           // Inactive Style
                    }
                  `}
                >
                  <Icon className={`h-3 w-3 ${isSelected ? "text-current" : "text-muted-foreground"}`} />
                  {feature.label}
                  {isSelected && <span className="ml-1 text-[10px] opacity-60">✕</span>}
                </Badge>
              );
            })}
            
            {/* Optional: Clear all button */}
            {selectedFilters.length > 0 && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setSelectedFilters([])}
                className="h-6 text-xs text-muted-foreground"
              >
                Clear filters
              </Button>
            )}
          </div>
          </div>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8 sm:gap-8 md:gap-8 lg:gap-24 xl:gap-16">
            {libraryData && libraryData.length >=29 && sortedLibraries && sortedLibraries.map((lib) => {
              const roomPercent = (lib.roomsOpen / lib.roomsTotal) * 100;
              const isPinned = pinnedIds.includes(lib.id)
              return (
                <Card key={lib.id} className="overflow-hidden rounded-[2rem] border-none bg-white shadow-[0_20px_40px_rgb(224,231,255,0.8)]">
                  <CardHeader className="p-0">
                  <div className="relative h-48 w-full overflow-hidden rounded-[1.5rem] shadow-sm">
      <img
        src={lib.image}
        alt={`${lib.name} exterior`}
        className="h-full w-full object-cover"
      />
      {/* <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none"></div> */}
      <Button
            size="icon"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation(); // Prevent card click
              togglePin(lib.id);
            }}
            className={`
              absolute top-3 right-3 z-20 h-8 w-8 rounded-full 
              transition-all duration-300 backdrop-blur-md shadow-sm
              ${isPinned 
                ? "bg-blue-500 text-white hover:bg-blue-600" 
                : "bg-white/70 text-slate-500 hover:bg-white hover:text-blue-500"
              }
            `}
          >
            <Pin className={`h-4 w-4 transition-transform ${isPinned ? "fill-current" : "rotate-45"}`} />
          </Button>
    </div>
                    <div className="p-4 space-y-2">
                      <div className="flex justify-between items-start">
                      <CardTitle className="text-2xl font-bold text-indigo-950 tracking-tight leading-tight" style={{ whiteSpace: 'pre-wrap' }}>
          {lib.name}
        </CardTitle>                        
        <Button
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            window.open(lib.url, '_blank');
          }}
          className="h-9 pl-3 pr-4 bg-blue-50 text-blue-600 border-2 border-blue-100 rounded-full shadow-sm transition-all duration-300 ease-spring hover:scale-105 active:scale-95 hover:bg-blue-100 hover:border-blue-200 hover:shadow-md group"
        >
          {/* Icon wiggles on hover */}
          <MapPin className="mr-1.5 h-4 w-4 fill-current opacity-80 transition-transform group-hover:rotate-12" />
          <span className="text-xs font-bold">Map</span>
        </Button>
                      </div>
                      <div className="flex flex-wrap gap-y-2 justify-between items-center text-sm bg-transparent  rounded-2xl">
                      {lib.isOpen ? (
                        <StatusBadge crowdLevel={lib.crowdLevel} variant=""></StatusBadge>
                      ) : (
                        <div className="flex items-center font-bold py-1 rounded-full">
                          <StatusBadge 
                            variant="closed" 
                            className="" 
                            crowdLevel={0}
                          />
                        </div>
                      )}
                        {(lib.hours && lib.hours.length > 3 && (!lib.hours.includes('Closed') && lib.hours.length > 0)) && 
                          <div className="flex items-center text-slate-600 font-medium bg-white py-1 px-3 rounded-full shadow-sm border border-slate-100">
                            <Clock className="mr-1.5 h-4 w-4 text-blue-400" />
                            <span style={{ whiteSpace: 'pre-wrap' }}>{lib.hours}</span>
                          </div>
                        }
                      </div>
                      { lib.calID && 
                      <span className='flex items-right justify-end text-slate-400 font-medium mr-4' style={{ whiteSpace: 'pre-wrap' }}>{lib.calID}</span>
                      }
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="flex flex-wrap gap-2 items-center">
                      {featureConfig.map((feature) => {
                        // Check if the feature is true in your data object
                        const isActive = lib.features[feature.key];
                        const IconComponent = feature.icon;
                        return (
                          <div key={feature.key}>
                          <Tooltip>
                            <TooltipTrigger>
                          <div
                            title={isActive ? feature.label : `No ${feature.label}`} // Native tooltip
                            className={`
                              relative flex items-center justify-center w-9 h-9 rounded-full border transition-all duration-200 ease-in-out
                              ${isActive 
                                ? `${feature.activeColor} shadow-sm scale-100 opacity-100` 
                                : "bg-transparent border-transparent text-gray-800/20 scale-90 grayscale"
                              }
                            `}
                          >
                            
                            <IconComponent 
                              className={`h-4 w-4 ${isActive && feature.key === 'late' ? "fill-current" : ""}`} 
                            />
                          </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{isActive ? feature.label : `No ${feature.label}`}</p>
                          </TooltipContent>
                        </Tooltip>
                        </div>
                        );
                      })}
                    </div>
                  </CardContent>
                  
                  <CardFooter>
                    {(lib.rooms.length>0||(lib.name=='Engineering & Mathematical Sciences Library')) && 
                  <Popover modal={true}>
                    <PopoverTrigger asChild>
                      <Button className="w-full text-sm md:text-md lg:w-24 lg:flex lg:flex-col lg:items-center bg-blue-400 hover:bg-blue-500 text-white font-bold">View Details</Button>
                    </PopoverTrigger>
                    <PopoverContent className="sm:w-[60vh] lg:w-[100vh] xl:w-[125vh] max-w-4xl bg-white ">
                      <Details currentLibrary={lib.nameID} floors={lib.rooms} key={lib.nameID} libraryName={lib.name}></Details>
                    </PopoverContent>
                  </Popover>
                  }
                  </CardFooter>
                </Card>
              );
            })}
          </div>
          {!libraryData && <LibrariesLoading></LibrariesLoading>}
        </div>
      </section>
    </main>
  );
}

function DatePicker({
  date,
  setDate,
}: {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full md:w-[280px] justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "MM/dd/yyyy") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
