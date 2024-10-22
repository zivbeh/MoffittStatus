"use client";

import { AiOutlineInstagram } from 'react-icons/ai';
import { useEffect, useState } from 'react';
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AcademicCapIcon } from "@heroicons/react/24/outline";

type FloorData = {
  floorID: number;
  busyScale: number;
  createdAt: string;
};

export default function HomePage() {
  const [floorData, setFloorData] = useState<FloorData[]>([]);
  const [lastUpdated, setLastUpdated] = useState<string>("");
  const [leastBusyFloors, setLeastBusyFloors] = useState<string[]>([]);

  const fetchStatusUpdates = async () => {
    try {
      const response = await fetch("/api/libraryStats/0", { method: "GET" });
      if (response.ok) {
        const data = await response.json();
        setFloorData(data["message"]);
        updateLastUpdatedTime(data["message"]);
        computeLeastBusyFloors(data["message"]);
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

  const computeLeastBusyFloors = (data: FloorData[]) => {
    const floorIDs = ["1", "3", "4", "5"];
    let minBusyScale = Infinity;
    let leastBusy: string[] = [];

    floorIDs.forEach((floorID) => {
      const floorEntries = data
        .filter((entry) => entry.floorID === Number(floorID))
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      const latestEntry = floorEntries[0];
      if (latestEntry) {
        const busyScale = Number(latestEntry.busyScale);
        if (busyScale < minBusyScale) {
          minBusyScale = busyScale;
          leastBusy = [floorID];
        } else if (busyScale === minBusyScale) {
          leastBusy.push(floorID);
        }
      }
    });

    setLeastBusyFloors(leastBusy);
  };

  const formatFloors = (floors: string[]) => {
    if (floors.length === 0) {
      return "";
    } else if (floors.length === 1) {
      return `Floor ${floors[0]}`;
    } else if (floors.length === 2) {
      return `Floor ${floors[0]} or Floor ${floors[1]}`;
    } else {
      const allButLast = floors.slice(0, -1).map(floor => `Floor ${floor}`).join(', ');
      const last = `or Floor ${floors[floors.length - 1]}`;
      return `${allButLast}, ${last}`;
    }
  };

  return (
    <div className="container mx-auto px-8 py-10">
      {/* Header with Icon and Instagram Link */}
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center">
          <AcademicCapIcon className="h-8 w-8 text-primary-500 mr-4" />
          <h1 className="text-4xl font-bold">MoffittStatus</h1>
        </div>

        <a
          href="https://www.instagram.com/moffittstatus"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '2rem',
            color: '#833AB4',
            transition: 'color 0.3s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#C13584')}
          onMouseLeave={(e) => (e.currentTarget.style.color = '#833AB4')}
        >
          <AiOutlineInstagram />
        </a>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-6">
        {/* Progress Bars */}
        <Card className="shadow-lg">
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
            {leastBusyFloors.length > 0 ? (
              <p>
                We recommend you go to <strong>{formatFloors(leastBusyFloors)}</strong> as{' '}
                {leastBusyFloors.length > 1 ? 'they are' : 'it is'} currently the least busy!
              </p>
            ) : (
              <p>No data available to make a recommendation.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
