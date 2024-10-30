"use client";

import { useState, useEffect } from "react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
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
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast"


export default function FoodLine() {
  const { toast } = useToast();
  const [gbcProgress, setGbcProgress] = useState(100);
  const [mlkProgress, setMlkProgress] = useState(100);
  const [isGbcOpen, setIsGbcOpen] = useState(false);
  const [isMlkOpen, setIsMlkOpen] = useState(false);
  const [feedbackText, setFeedbackText] = useState("");
  const [hasFeedback, setHasFeedback] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState<boolean | null>(null);

  const checkIfGbcOpen = () => {
    const now = new Date();
    const day = now.getDay();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const currentTime = hours + minutes/60;

    return day >= 1 && day <= 5 && currentTime >= 7.5 && currentTime < 19;
  };

  const checkIfMlkOpen = () => {
    const now = new Date();
    const day = now.getDay();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const currentTime = hours + minutes/60;

    return day >= 1 && day <= 5 && currentTime >= 11 && currentTime < 18;
  };

  const progressToWaitTime = (progress: number): number => {
    if (progress >= 100) return 15;
    if (progress >= 80) return Math.round(10 + ((progress - 80) * 0.25)); // 80-100: 10-15 mins
    if (progress >= 60) return Math.round(5 + ((progress - 60) * 0.25));  // 60-80: 5-10 mins
    if (progress >= 40) return Math.round(3 + ((progress - 40) * 0.1));   // 40-60: 3-5 mins
    if (progress >= 20) return Math.round((progress - 20) * 0.15);        // 20-40: 0-3 mins
    return 0;
  };

  const getMorningScale = (): number => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const currentTime = hours + minutes/60;

    // Before 7am or after 10am
    if (currentTime < 7 || currentTime >= 10) {
      return 1; // Full scale
    }
    
    // Between 7am and 10am
    // Start at 0.5 (50%) at 7am, reach 1.0 (100%) at 10am
    const progress = (currentTime - 7) / 3; // 3 hours between 7 and 10
    return 0.5 + (progress * 0.5); // Scale from 0.5 to 1.0
  };

  useEffect(() => {
    const calculateProgress = () => {
      const now = new Date();
      const currentMinutes = now.getMinutes();
      
      // Update open/closed status
      setIsGbcOpen(checkIfGbcOpen());
      setIsMlkOpen(checkIfMlkOpen());
      
      let currentProgress;
      if (currentMinutes === 0) {
        currentProgress = 50;
      } else if (currentMinutes <= 10) {
        currentProgress = 50 + (currentMinutes * 5);
      } else if (currentMinutes <= 13) {
        currentProgress = 100 - ((currentMinutes - 10) * (10/3));
      } else if (currentMinutes <= 17) {
        currentProgress = 90 - ((currentMinutes - 13) * 10);
      } else if (currentMinutes <= 22) {
        currentProgress = 50 - ((currentMinutes - 17) * 6);
      } else if (currentMinutes <= 40) {
        currentProgress = 20;
      } else if (currentMinutes <= 50) {
        currentProgress = 20 + ((currentMinutes - 40) * 3);
      } else {
        currentProgress = 50;
      }
      
      // Scale GBC progress before 10am
      if (checkIfGbcOpen()) {
        const scale = getMorningScale();
        setGbcProgress(Math.round(currentProgress * scale));
      }
      
      // MLK progress remains unchanged
      if (checkIfMlkOpen()) {
        setMlkProgress(Math.round(currentProgress));
      }
    };

    // Calculate initial progress
    calculateProgress();

    // Set up interval to update every minute
    const updateInterval = setInterval(calculateProgress, 60000);

    // Calculate time until next hour for reset
    const now = new Date();
    const minutesUntilNextHour = 60 - now.getMinutes();
    const secondsUntilNextHour = (minutesUntilNextHour * 60) - now.getSeconds();

    // Set up reset for next hour
    const resetTimeout = setTimeout(() => {
      if (checkIfGbcOpen()) setGbcProgress(100);
      if (checkIfMlkOpen()) setMlkProgress(100);
      
      // Set up recurring hourly reset
      const hourlyReset = setInterval(() => {
        if (checkIfGbcOpen()) setGbcProgress(100);
        if (checkIfMlkOpen()) setMlkProgress(100);
      }, 3600000);
      
      return () => clearInterval(hourlyReset);
    }, secondsUntilNextHour * 1000);

    return () => {
      clearInterval(updateInterval);
      clearTimeout(resetTimeout);
    };
  }, []);

  const handleFeedbackSelection = (isAccurate: boolean) => {
    setSelectedFeedback(isAccurate);
  };

  const handleSubmit = async () => {
    if (selectedFeedback === null) return;
    await handleFeedback(selectedFeedback);
  };

  const handleFeedback = async (isAccurate: boolean) => {
    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          accurate: isAccurate,
          feedback_text: feedbackText,
          created_at: new Date().toISOString()
        })
      });

      if (response.ok) {
        setHasFeedback(true);
        setFeedbackText("");
        toast({
          title: "Thank you!",
          description: "Your feedback helps us improve our wait time estimates.",
        });
      }
    } catch (error) {
      console.error('Feedback submission error:', error);
      toast({
        title: "Error",
        description: "Failed to submit feedback. Please try again.",
        variant: "destructive",
      });
    }
  };

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

      {/* Food Line Content */}
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
                {isGbcOpen ? (
                  <>
                    <div className="flex-1">
                      <Progress value={gbcProgress} className="w-full" />
                    </div>
                    <span className="w-32 text-right font-medium">
                      est. {progressToWaitTime(gbcProgress)} min wait
                    </span>
                  </>
                ) : (
                  <div className="flex-1 text-gray-500 text-sm">
                    Golden Bear Cafe is currently closed.
                    <br />
                    Hours: Monday-Friday 7:30 AM - 7:00 PM
                    <br />
                    Closed Weekends
                  </div>
                )}
              </div>
            </div>

            {/* Thin Horizontal Divider */}
            <div className="w-full h-px bg-gray-300 my-2"></div>

            {/* MLK Section */}
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <span className="w-20 text-center font-medium">MLK</span>
                {isMlkOpen ? (
                  <>
                    <div className="flex-1">
                      <Progress value={mlkProgress} className="w-full" />
                    </div>
                    <span className="w-32 text-right font-medium">
                      est. {progressToWaitTime(mlkProgress)} min wait
                    </span>
                  </>
                ) : (
                  <div className="flex-1 text-gray-500 text-sm">
                    MLK Cafe is currently closed.
                    <br />
                    Hours: Monday-Friday 11:00 AM - 6:00 PM
                    <br />
                    Closed Weekends
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Feedback Card */}
      <Card className="shadow-md mt-4">
        {!hasFeedback ? (
          <>
            <CardHeader>
              <CardTitle>Was this wait time accurate?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                <div className="flex gap-4 justify-center">
                  <Button 
                    variant={selectedFeedback === true ? "default" : "outline"}
                    onClick={() => handleFeedbackSelection(true)}
                  >
                    Yes
                  </Button>
                  <Button 
                    variant={selectedFeedback === false ? "default" : "outline"}
                    onClick={() => handleFeedbackSelection(false)}
                  >
                    No
                  </Button>
                </div>
                
                <div className="space-y-2">
                  <Textarea
                    placeholder="Additional feedback (optional)"
                    value={feedbackText}
                    onChange={(e) => setFeedbackText(e.target.value)}
                    className="min-h-[100px]"
                  />
                </div>

                <Button 
                  className="w-full"
                  disabled={selectedFeedback === null}
                  onClick={handleSubmit}
                >
                  Submit Feedback
                </Button>
              </div>
            </CardContent>
          </>
        ) : (
          <CardContent className="text-center py-6">
            <h3 className="text-lg font-semibold mb-2">Thank you for your feedback!</h3>
            <p className="text-muted-foreground">Your response helps us improve our wait time estimates.</p>
          </CardContent>
        )}
      </Card>
    </div>
  );
}
