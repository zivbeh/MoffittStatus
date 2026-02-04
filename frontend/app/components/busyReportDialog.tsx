'use client';

import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label'; 
import { X, VolumeX, Users, Send, Volume2 } from 'lucide-react'; 
import { cn, GeoLocation, getCurrentLocation, getDynamicStyles } from '@/lib/utils'; 
import { PersonDetector } from './personDetector';
import { updateLibraryRating } from '@/lib/firebaseMethods';
import { BACKEND_URL } from '@/lib/apiEndPoints';
import { toast } from "sonner"

const LIBRARY_FLOORS = {
  main_stacks: ["Floor A", "Floor B", "Floor C", "Floor D"],
  doe: ["Floor 1","Floor 2","Floor 3","Floor 4"],
  kresge: ["Upper Floor", "Lower Floor"],
};

// This is the component for the entire popup dialog
export default function BusyReportDialog({ open, setOpen, onOpenChange }: { open: boolean; setOpen; onOpenChange: (open: boolean) => void }) {
  const [busyPercentage, setBusyPercentage] = useState<number[]>([0]); // Slider value
  const [isLoud, setIsLoud] = useState(false); // Switch value for Loud
  const [goodForGroups, setGoodForGroups] = useState(false); // Switch value for Groups
  const [selectedLibrary, setSelectedLibrary] = useState("main_stacks");
  const floorRef = useRef("floorA");
  const handleLibraryChange = (newLibrary:string) => {
    setSelectedLibrary(newLibrary);
    
    // IMPORTANT: Auto-select the first floor of the new library
    // Otherwise, your ref might still hold "Floor D" when you switch to a library that only has 2 floors.
    const firstFloorOfNewLib = LIBRARY_FLOORS[newLibrary][0];
    floorRef.current = firstFloorOfNewLib;
  };
  

  // Get the current styles based on the slider state
  const { textClass, sliderClass, colorClass, nameClass } = getDynamicStyles(busyPercentage[0]);

  const handleSubmit = async () => {
    setOpen(false)
    // console.log("Trying to send")
    let coords:GeoLocation = {lat:-1,lng:-1};
    try {
    // console.log("Getting coords")
      coords = await getCurrentLocation();
    // console.log("Got coords")
    } catch (error) {
      console.warn("Location fetch failed:", error);
    }
    const payload = {
      rating: busyPercentage[0],
      isLoud: isLoud,
      goodForGroups: goodForGroups,
      floor: floorRef.current,
      library:selectedLibrary,
      latitude: coords ? coords.lat : -1,
      longitude: coords ? coords.lng : -1,
    }
    console.log('Submission Data:', payload);
    
    const response = await axios.post(BACKEND_URL+'/api/library/update', payload);
    console.log("Update payload: " + response.data)
    // toast.success("Rating submitted")
    onOpenChange(false);
    setBusyPercentage([0]);
    return true
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md md:max-w-lg p-6 rounded-lg shadow-xl bg-white">
        <DialogHeader className="relative pb-4 border-transparent">
          <DialogTitle className="text-2xl font-bold text-blue-400">
            How busy is it?
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-600">
            Help keep library data up-to-date. 
            Your contribution makes a difference!
          </DialogDescription>
        </DialogHeader>
        {/* <PersonDetector setPercent={setBusyPercentage}></PersonDetector> */}
        {/* <span className='flex justify-center font-bold text-4xl text-blue-400'>OR</span> */}
        <div className="grid gap-0 py-0">
          {/* <div className="pl-5 md:pl-15 grid items-center justify-center md:gap-4 grid-cols-2">
            <div>
              <Label htmlFor="library" className="block text-sm font-bold text-gray-700 mb-2">
                Library
              </Label>
              <Select defaultValue="main_stacks" onValueChange={handleLibraryChange}>
                <SelectTrigger id="library">
                  <SelectValue placeholder="Choose a library" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="main_stacks">Main Stacks</SelectItem>
                  <SelectItem value="doe">Doe Library</SelectItem>
                  <SelectItem value="kresge">Kresge Library</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="floor" className="block text-sm font-bold text-gray-700 mb-2">
                Floor
              </Label>
              <Select 
            key={selectedLibrary} 
            defaultValue={LIBRARY_FLOORS[selectedLibrary][0]}
            onValueChange={(val) => floorRef.current = val}
          >
            <SelectTrigger>
              <SelectValue placeholder="Choose floor" />
            </SelectTrigger>
            <SelectContent>
              {LIBRARY_FLOORS[selectedLibrary].map((floorName) => (
                <SelectItem key={floorName} value={floorName}>
                  {floorName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
            </div>
          </div> */}


          <div className="mt-4 text-center">
            <p className={cn("text-4xl font-bold mb-4", textClass)}>
              {busyPercentage[0]}%
            </p>
            
            <Slider
              defaultValue={busyPercentage}
              max={100}
              step={5}
              onValueChange={setBusyPercentage}
              // cn() merges default class with dynamic class
              className="my-2" 
              rangeClassName={sliderClass} 
            />
            
            <div className="mt-4 flex justify-between text-xs font-medium">
              <span className="text-green-600">Not Crowded</span>
              <span className="text-yellow-600">Not too Crowded</span>
              <span className="text-orange-600">Crowded</span>
              <span className="text-red-600">At Capacity</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 mt-6">
  {/* Loud Toggle */}
  <button
    onClick={() => setIsLoud(!isLoud)}
    className={`
      flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-200
      ${isLoud 
        ? "bg-black text-white border-black shadow-md" 
        : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"}
    `}
  >
    <Volume2 className="h-4 w-4" />
    <span className="text-sm font-medium">{isLoud ? "Loud Environment" : "Quiet Environment"}</span>
  </button>

  {/* Groups Toggle */}
  <button
    onClick={() => setGoodForGroups(!goodForGroups)}
    className={`
      flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-200
      ${goodForGroups 
        ? "bg-blue-600 text-white border-blue-600 shadow-md" 
        : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"}
    `}
  >
    <Users className="h-4 w-4" />
    <span className="text-sm font-medium">Good for Groups</span>
  </button>
</div>
        </div>

        <div className="flex justify-end pt-4 border-t border-gray-200">
          <Button
            className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-md"
            onClick={() => {
              console.log("Sending info")
              toast.promise(
                handleSubmit(), // <--- Pass the executing promise directly
                {
                  loading: "Sending submission...",
                  success: (data) => `Rating sent successfully!`,
                  error: "Failed to submit rating",
                }
              );
            }}
          >
            Submit <Send className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}