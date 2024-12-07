"use client"

import React, { useEffect, useState } from 'react';
import { Progress } from '@/components/ui/progress';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { AcademicCapIcon } from "@heroicons/react/24/outline";
import { AiOutlineInstagram } from "react-icons/ai";
import Link from "next/link";
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";

interface Venue {
    name: string;
    busyness: string;
}

const OccupancyDisplay = () => {
    const [venues, setVenues] = useState<Venue[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchOccupancyData = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/mlk');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            console.log('Scraped data:', data);
            const filteredData = data.filter((venue: Venue) => 
                !venue.name.toLowerCase().includes('basement') && 
                !venue.name.toLowerCase().includes('floor 5') &&
                !venue.name.toLowerCase().includes('patio')
            );
            setVenues(filteredData);
        } catch (error) {
            console.error('Error fetching data:', error);
            setVenues([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchOccupancyData();
        const interval = setInterval(fetchOccupancyData, 60000);
        return () => clearInterval(interval);
    }, []);

    const getBusynessPercentage = (busyness: string | undefined): number => {
        if (!busyness) {
            console.log('Busyness value is undefined or null');
            return 0;
        }

        console.log('Processing busyness value:', busyness);

        const match = busyness.match(/(\d+)/);
        if (match) {
            return parseInt(match[1]);
        }
        
        const busynessMap: { [key: string]: number } = {
            'not busy': 20,
            'slightly busy': 40,
            'busy': 60,
            'very busy': 80,
            'extremely busy': 100
        };

        const normalizedBusyness = busyness.toLowerCase().trim();
        return busynessMap[normalizedBusyness] || 0;
    };

    return (
        <div className="container mx-auto px-4 mt-5">
            {/* Header Section */}
            <div className="flex items-center justify-between mb-5">
                <div className="flex items-center">
                    <AcademicCapIcon className="h-10 w-10 mr-4 transition-transform duration-300 hover:scale-110 bg-gradient-to-r from-black to-white bg-clip-text" />
                    <h1 className="text-3xl font-bold transition-transform duration-300 hover:scale-105 sm:hover:scale-103">
                        MoffittStatus
                    </h1>
                </div>
                <div>
                    <NavigationMenu>
                        <NavigationMenuList>
                            <NavigationMenuItem>
                                <Link href="/" legacyBehavior passHref>
                                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>Library Capacity</NavigationMenuLink>
                                </Link>
                            </NavigationMenuItem>
                            <NavigationMenuItem>
                                <Link href="/info" legacyBehavior passHref>
                                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>Library Hours</NavigationMenuLink>
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

            {/* Existing Card Component */}
            <Card className="shadow-md transition-transform duration-300 hover:scale-105 sm:hover:scale-103">
                <CardHeader className="text-left p-4">
                    <CardTitle className="text-xl font-semibold">MLK Library Status - Coming Soon...</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-2 mt-2 mb-4">
                    {isLoading ? (
                        <div className="flex justify-center items-center py-8">
                            <span className="text-gray-600 text-lg">Loading data...</span>
                        </div>
                    ) : (
                        venues.map((venue, index) => (
                            <div key={index} className="flex items-center space-x-2 mb-2">
                                <span className="w-20 text-center font-medium">
                                    {venue.name}
                                </span>
                                <div className="flex-1">
                                    <Progress 
                                        value={getBusynessPercentage(venue.busyness)} 
                                        className="w-full" 
                                    />
                                </div>
                                <span className="w-16 text-right text-sm">
                                    {getBusynessPercentage(venue.busyness)}%
                                </span>
                            </div>
                        ))
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default OccupancyDisplay;
