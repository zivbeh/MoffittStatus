"use client";
import { useEffect, useState } from 'react';
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ResponsiveContainer, LineChart, CartesianGrid, Line, XAxis } from "recharts";
import { AcademicCapIcon } from "@heroicons/react/24/outline";

type FloorData = {
  floorID: number;
  busyScale: number;
  createdAt: string;
};

const chartData = [
  { hour: "9a", capacity: 186 },
  { hour: "12p", capacity: 287 },
  { hour: "3p", capacity: 305 },
  { hour: "6p", capacity: 237 },
  { hour: "9p", capacity: 287 },
  { hour: "12a", capacity: 214 },
];

export default function HomePage() {
  const [floorData, setFloorData] = useState<FloorData[]>([]);
  const [lastUpdated, setLastUpdated] = useState<string>("");

  const fetchStatusUpdates = async () => {
    try {
      const response = await fetch("/api/libraryStats/0", { method: "GET" });
      if (response.ok) {
        const data = await response.json();
        setFloorData(data["message"]);
        updateLastUpdatedTime(data["message"]);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const updateLastUpdatedTime = (data: FloorData[]) => {
    if (data.length === 0) {
      setLastUpdated("No updates yet");
      return;
    }
    const mostRecentUpdate = data
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];
    const updateTime = new Date(mostRecentUpdate.createdAt).getTime();

    const interval = setInterval(() => {
      const now = Date.now();
      const secondsAgo = Math.floor((now - updateTime) / 1000);

      let displayTime;
      if (secondsAgo < 300) {
        displayTime = "updated just now";
      } else if (secondsAgo < 3600) {
        displayTime = `${Math.floor(secondsAgo / 60)} minutes ago`;
      } else if (secondsAgo < 86400) {
        displayTime = `${Math.floor(secondsAgo / 3600)} hours ago`;
      } else {
        displayTime = `${Math.floor(secondsAgo / 86400)} days ago`;
      }

      setLastUpdated(displayTime);
    }, 1000);

    return () => clearInterval(interval);
  };

  useEffect(() => {
    fetchStatusUpdates();
    const interval = setInterval(fetchStatusUpdates, 60000);
    return () => clearInterval(interval);
  }, []);

  const getProgressValue = (floor: string) => {
    const floorEntries = floorData
      .filter((entry) => entry.floorID === Number(floor))
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    const latestEntry = floorEntries[0];
    return latestEntry ? Number(latestEntry.busyScale) * 20 : 0;
  };

  return (
    <div className="container mx-auto px-4 sm:px-8 py-10">
      {/* Header with Icon */}
      <div className="flex items-center mb-10">
        <AcademicCapIcon className="h-8 w-8 text-primary-500 mr-4" />
        <h1 className="text-4xl font-bold">MoffittStatus</h1>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left: Chart */}
        <div className="lg:w-1/3 w-full">
          <Card className="shadow-lg h-full">
            <CardHeader className="p-6">
              <CardTitle className="text-2xl font-semibold">Moffitt Capacity</CardTitle>
              <CardDescription className="text-gray-500">{lastUpdated}</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData} margin={{ top: 0, right: 40, bottom: 5, left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" />
                  <Line type="monotone" dataKey="capacity" stroke="#8884d8" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Right: Progress Bars and Recommendation */}
        <div className="lg:w-2/3 w-full flex flex-col gap-6">
          {/* Progress Bars */}
          <Card className="shadow-lg flex-grow">
            <CardHeader className="p-6">
              <CardTitle className="text-2xl font-semibold">Floor Breakdown</CardTitle>
              <CardDescription className="text-gray-500">{lastUpdated}</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              {["1", "3", "4", "5"].map((floor) => (
                <div key={floor} className="flex items-center">
                  <span className="w-24 text-right font-medium">{`Floor ${floor}`}</span>
                  <Progress className="flex-1 ml-4" value={getProgressValue(floor)} />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Recommendations */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold">Recommendation</CardTitle>
            </CardHeader>
            <CardContent className="text-lg">
              <p>If you are solo, Floor 1 should be a good choice!</p>
              <p>Need a quieter space? Try the upper floors.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
