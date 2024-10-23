"use client";

import { AiOutlineInstagram } from "react-icons/ai";
import { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

import { AcademicCapIcon } from "@heroicons/react/24/outline";

type FloorData = {
  floorID: string;
  updatedBy: string;
  busyScale: number;
  createdAt: string;
};

export default function HomePage() {
  const [floorData, setFloorData] = useState<FloorData[]>([]);
  const [lastUpdated, setLastUpdated] = useState<string>("");
  const [leastBusyFloors, setLeastBusyFloors] = useState<string[]>([]);
  const [allFloorsAbove79, setAllFloorsAbove79] = useState<boolean>(false);
  const [recentUpdaters, setRecentUpdaters] = useState<string[]>([]); // New state variable

  const fetchStatusUpdates = async () => {
    try {
      const response = await fetch("/api/libraryStats/0", { method: "GET" });
      if (response.ok) {
        const data = await response.json();
        setFloorData(data["message"]);
        updateLastUpdatedTime(data["message"]);
        computeLeastBusyFloors(data["message"]);
        computeRecentUpdaters(data["message"]); // Call the new function
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
      .sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )[0];
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
      .filter((entry) => entry.floorID === floor)
      .sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

    const latestEntry = floorEntries[0];
    return latestEntry ? Number(latestEntry.busyScale) * 20 : 0;
  };

  const computeLeastBusyFloors = (data: FloorData[]) => {
    const floorIDs = ["Floor 1", "Floor 3", "Floor 4", "Floor 5"];
    let minBusyScale = Infinity;
    let leastBusy: string[] = [];
    let allAbove79 = true;

    floorIDs.forEach((floorID) => {
      const floorEntries = data
        .filter((entry) => entry.floorID === floorID)
        .sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

      const latestEntry = floorEntries[0];
      if (latestEntry) {
        const busyScale = Number(latestEntry.busyScale);
        const progressValue = busyScale * 20;

        if (progressValue <= 79) {
          allAbove79 = false;
        }

        if (progressValue < 100) {
          // Exclude floors at 100% capacity
          if (busyScale < minBusyScale) {
            minBusyScale = busyScale;
            leastBusy = [floorID];
          } else if (busyScale === minBusyScale) {
            leastBusy.push(floorID);
          }
        }
      }
    });

    setLeastBusyFloors(leastBusy);
    setAllFloorsAbove79(allAbove79);
  };

  // New function to compute recent updaters
  const computeRecentUpdaters = (data: FloorData[]) => {
    const sortedData = data.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    const updaters = sortedData
      .map((entry) => entry.updatedBy)
      .filter((name, index, self) => name && self.indexOf(name) === index)
      .slice(0, 4);
    setRecentUpdaters(updaters);
  };

  const formatFloors = (floors: string[]) => {
    if (floors.length === 0) {
      return "";
    } else if (floors.length === 1) {
      return `${floors[0]}`;
    } else if (floors.length === 2) {
      return `${floors[0]} or ${floors[1]}`;
    } else {
      const allButLast = floors.slice(0, -1).join(", ");
      const last = `or ${floors[floors.length - 1]}`;
      return `${allButLast}, ${last}`;
    }
  };

  return (
    <div className="container mx-auto px-4 py-10">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <AcademicCapIcon
            className="h-10 w-10 mr-4 transition-transform duration-300 hover:scale-110 bg-gradient-to-r from-black to-white bg-clip-text"
          />
          <h1 className="text-3xl font-bold transition-transform duration-300 hover:scale-105">
            MoffittStatus
          </h1>
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
      <div className="w-full h-[1px] bg-gray-300 mb-8"></div>

      {/* Floor Breakdown */}
      <div className="flex flex-col gap-6">
        <Card className="shadow-md transition-transform duration-300 hover:scale-105">
          <CardHeader className="text-left p-6">
            <CardTitle className="text-xl font-semibold">Floor Breakdown</CardTitle>
            <CardDescription className="text-gray-500">{lastUpdated}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 mt-2 mb-4">
            {["Floor 1", "Floor 3", "Floor 4", "Floor 5"].map((floor) => (
              <div key={floor} className="flex items-center space-x-4">
                <span className="w-20 text-center font-medium">{floor}</span>
                <div className="flex-1">
                  <Progress value={getProgressValue(floor)} className="w-full" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recommendations */}
        <Card className="shadow-md w-full mx-auto transition-transform duration-300 hover:scale-105">
          <CardHeader className="text-left">
            <CardTitle className="text-xl font-semibold">Recommendation</CardTitle>
          </CardHeader>
          <CardContent className="">
            <div className="space-y-4">
              {/* Solo Recommendation */}
              <p className="text-left text-lg">
                <strong>For Solo People:</strong>{" "}
                {leastBusyFloors.length > 0 ? (
                  <>
                    We recommend <strong>{formatFloors(leastBusyFloors)}</strong>{" "}
                    as it’s currently the least busy!
                  </>
                ) : (
                  <>
                    All floors are at full capacity. We recommend studying at{" "}
                    <strong>Haas Library</strong> or <strong>Doe Library</strong>.
                  </>
                )}
              </p>
              {/* Group Recommendation */}
              <p className="text-left text-lg">
                <strong>For Groups:</strong>{" "}
                {allFloorsAbove79 || leastBusyFloors.length === 0 ? (
                  <>
                    All floors are quite busy. We recommend going to{" "}
                    <strong>Haas Library</strong> or <strong>Doe Library</strong>.
                  </>
                ) : (
                  <>
                    We recommend <strong>{formatFloors(leastBusyFloors)}</strong>{" "}
                    as it’s currently the least busy!
                  </>
                )}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Thank You Section */}
        <div className="mt-8">
          <Card className="shadow-md transition-transform duration-300 hover:scale-105">
            <CardHeader className="text-left p-6">
              <CardTitle className="text-xl font-semibold">Moffitt Demons!</CardTitle>
              <CardDescription className="text-gray-500">
                A special thanks to our recent contributors:
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 p-6">
              {recentUpdaters.length > 0 ? (
                <ul className="list-disc list-inside">
                  {recentUpdaters.map((name, index) => (
                    <li key={index} className="text-lg">
                      {name}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No recent updates yet.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}