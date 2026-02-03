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
import { X, VolumeX, Users, Send } from 'lucide-react'; 
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
          <div className="pl-5 md:pl-15 grid items-center justify-center md:gap-4 grid-cols-2">
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
              {/* Map over the array for the selected library */}
              {LIBRARY_FLOORS[selectedLibrary].map((floorName) => (
                <SelectItem key={floorName} value={floorName}>
                  {floorName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
            </div>
          </div>


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

           <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 mt-6">
            <div className="flex items-center justify-between rounded-lg border px-4 shadow-sm bg-gray-50">
              <div className="flex items-center gap-2">
                <VolumeX className="h-5 w-5 text-gray-400" />
                <Label htmlFor="loud-mode" className="text-base font-medium text-gray-800">
                  Loud?
                </Label>
              </div>
              <div className='flex flex-col gap-y-2 justify-center items-center'>
              <Label htmlFor="loud-mode" className="text-base text-gray-500 ml-2">
                {isLoud ? 'Loud' : 'Quiet'}
              </Label>
              <Switch
                id="loud-mode"
                checked={isLoud}
                onCheckedChange={setIsLoud}
                aria-label="Toggle loud mode"
                className='ml-2'
              />
              

              </div>
            </div>
            <div className="flex items-center justify-between rounded-lg border p-4 shadow-sm bg-gray-50">
              <div className="flex items-center gap-3">
                <Users className="h-6 w-6 text-gray-400" />
                <Label htmlFor="groups-mode" className="text-base font-medium text-gray-800">
                  Good for Groups?
                </Label>
              </div>
             <div className='flex flex-col items-center gap-y-2'>
             <Label htmlFor="groups-mode" className="text-base text-gray-500 ml-2">
                 {goodForGroups ? 'Yes' : 'No'}
              </Label>
             <Switch
                id="groups-mode"
                checked={goodForGroups}
                onCheckedChange={setGoodForGroups}
                aria-label="Toggle good for groups"
                className='ml-2'
              />
              

             </div>
            </div>
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