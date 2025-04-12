"use client"

import React, { useEffect, useState } from 'react';
import { Progress } from '@/components/ui/progress';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import Map from "@/components/map";
import NavBar from '@/components/basic/NavBar';
import ProgressBarCircle from '@/components/basic/ProgressBarCircle/ProgressBarCircle';

interface Venue {
    name: string;
    busyness: string;
}

const MapDisplay = () => {
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
            <NavBar LibraryCapacity={true} LibraryHours={true} MLK={true}></NavBar>
            <div className='flex flex-col gap-2'>
            <div className="w-full flex flex-col gap-6">
                <Card className="shadow-md transition-transform duration-300 hover:scale-105 sm:hover:scale-103">
                <CardContent className="flex flex-col gap-2 mt-2 mb-4">
                    {/* Moffitt Library Section */}
                    <h2 className="text-lg text-center font-semibold">Summary
                    </h2>

                    {/* Thin Horizontal Divider */}
                    <div className="w-full h-px bg-gray-300 my-2"></div>

                    {/* Other Libraries Section */}
                    <div className="flex-1 flex-wrap flex space-x-10 justify-center">
                        <div>
                            <h2 className="text-lg text-center font-semibold mb-3">Moffit</h2>
                            <ProgressBarCircle circleMax={40} duration={2}></ProgressBarCircle>
                        </div>
                        <div>
                            <h2 className="text-lg text-center font-semibold mb-3">Doe</h2>
                            <ProgressBarCircle circleMax={90} duration={2}></ProgressBarCircle>
                        </div>
                        <div>
                            <h2 className="text-lg text-center font-semibold mb-3">Stacks</h2>
                            <ProgressBarCircle circleMax={30} duration={2}></ProgressBarCircle>
                        </div>
                        <div>
                            <h2 className="text-lg text-center font-semibold mb-3">Haas</h2>
                            <ProgressBarCircle circleMax={25} duration={2}></ProgressBarCircle>
                        </div>
                    </div>
                </CardContent>
                </Card>
            </div>
                <Map/>
                {/* Existing Card Component */}
                <Card className="shadow-md transition-transform duration-300 hover:scale-105 sm:hover:scale-103">
                    <CardHeader className="text-left p-4">
                        <CardTitle className="text-xl font-semibold">Library Info</CardTitle>
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
        </div>
    );
};

export default MapDisplay;
