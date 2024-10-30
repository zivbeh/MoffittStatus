"use client";

import { useState, useEffect } from "react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu"
import { navigationMenuTriggerStyle } from "@/components/ui/navigation-menu"
import { AiOutlineInstagram } from "react-icons/ai";
import { AcademicCapIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function FoodLine() {
  const [gbcProgress, setGbcProgress] = useState(100);
  const [mlkProgress, setMlkProgress] = useState(100);

  useEffect(() => {
    // Function to calculate current progress based on minutes elapsed
    const calculateProgress = () => {
      const now = new Date();
      const currentMinutes = now.getMinutes();
      
      let currentProgress;
      if (currentMinutes <= 10) {
        // First 10 minutes: 100 to 80 (2% per minute)
        currentProgress = 100 - (currentMinutes * 2);
      } else if (currentMinutes <= 20) {
        // Next 10 minutes: 80 to 50 (3% per minute)
        currentProgress = 80 - ((currentMinutes - 10) * 3);
      } else if (currentMinutes <= 30) {
        // Next 10 minutes: 50 to 25 (2.5% per minute)
        currentProgress = 50 - ((currentMinutes - 20) * 2.5);
      } else {
        // After 30 minutes: minimum of 5
        currentProgress = 5;
      }
      
      setGbcProgress(Math.max(5, currentProgress));
      setMlkProgress(Math.max(5, currentProgress));
    };

    // Calculate initial progress immediately when component mounts
    calculateProgress();

    // Set up interval to update every minute
    const updateInterval = setInterval(calculateProgress, 60000);

    // Calculate time until next hour for reset
    const now = new Date();
    const minutesUntilNextHour = 60 - now.getMinutes();
    const secondsUntilNextHour = (minutesUntilNextHour * 60) - now.getSeconds();

    // Set up reset for next hour
    const resetTimeout = setTimeout(() => {
      setGbcProgress(100);
      setMlkProgress(100);
      // Set up recurring hourly reset
      const hourlyReset = setInterval(() => {
        setGbcProgress(100);
        setMlkProgress(100);
      }, 3600000); // Every hour
      return () => clearInterval(hourlyReset);
    }, secondsUntilNextHour * 1000);

    return () => {
      clearInterval(updateInterval);
      clearTimeout(resetTimeout);
    };
  }, []);

  return (
    <div className="container mx-auto px-4 mt-5">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <Link href="/"className="flex items-center">
          <AcademicCapIcon className="h-10 w-10 mr-4 transition-transform duration-300 hover:scale-110 bg-gradient-to-r from-black to-white bg-clip-text" />
          <h1 className="text-3xl font-bold transition-transform duration-300 hover:scale-105 sm:hover:scale-103">
            MoffittStatus
          </h1>
          </Link>
        </div>
        <div>
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <Link href="/" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>Library Status</NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList> 
          </NavigationMenu>
        </div>
        <a
          href="https://www.instagram.com/moffittstatus"
          target="_blank"
          rel="noopener noreferrer"
          className="text-4xl text-purple-500 hover:text-pink-500 hover:scale-110 transition-transform duration-300 transition-colors"
        >
          <AiOutlineInstagram />
        </a>
      </div>

      {/* Thin Divider */}
      <div className="w-full h-[1px] bg-gray-300 mb-5"></div>

      {/* Existing Food Line Content */}
      <div className="w-full flex flex-col gap-6">
        <Card className="shadow-md transition-transform duration-300 hover:scale-105 sm:hover:scale-103">
          <CardHeader className="text-left p-4">
            <CardTitle className="text-xl font-semibold">Food Line Status</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2 mt-2 mb-4">
            {/* GBC Section */}
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <span className="w-20 text-center font-medium">GBC</span>
                <div className="flex-1">
                  <Progress value={gbcProgress} className="w-full" />
                </div>
                <span className="w-16 text-right font-medium">{gbcProgress}%</span>
              </div>
            </div>

            {/* Thin Horizontal Divider */}
            <div className="w-full h-px bg-gray-300 my-2"></div>

            {/* MLK Section */}
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <span className="w-20 text-center font-medium">MLK</span>
                <div className="flex-1">
                  <Progress value={mlkProgress} className="w-full" />
                </div>
                <span className="w-16 text-right font-medium">{mlkProgress}%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
