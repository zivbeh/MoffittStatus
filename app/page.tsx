// pages/index.tsx
"use client";
import { useEffect, useState } from 'react';
import { Progress } from "@/components/ui/progress";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import { AcademicCapIcon } from "@heroicons/react/24/outline";

type FloorData = {
  library: string;
  floorID: number | null;
  busyScale: number;
  createdAt: string;
};

export default function HomePage() {
  const [floorData, setFloorData] = useState<FloorData[]>([]);
  const [lastUpdated, setLastUpdated] = useState<string>("");
  const [leastBusyLibraries, setLeastBusyLibraries] = useState<string[]>([]);

  const libraries = ["Moffitt", "Main Stacks", "Doe", "Haas"];
  const floorsPerLibrary: { [key: string]: string[] } = {
    Moffitt: ["1", "3", "4", "5"],
    "Main Stacks": [],
    Doe: [],
    Haas: [],
  };

  const fetchStatusUpdates = async () => {
    try {
      const response = await fetch("/api/libraryStats", { method: "GET" });
      if (response.ok) {
        const data = await response.json();
        setFloorData(data["message"]);
        updateLastUpdatedTime(data["message"]);
        computeLeastBusyLibraries(data["message"]);
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

  const getProgressValue = (library: string, floor?: string) => {
    let entries = floorData.filter((entry) => entry.library === library);

    if (floor) {
      entries = entries.filter((entry) => entry.floorID === Number(floor));
    }

    entries = entries.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    const latestEntry = entries[0];
    return latestEntry ? Number(latestEntry.busyScale) * 20 : 0;
  };

  const computeLeastBusyLibraries = (data: FloorData[]) => {
    let minBusyScale = Infinity;
    let leastBusyLibs: string[] = [];

    libraries.forEach((library) => {
      const entries = data
        .filter((entry) => entry.library === library)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      const latestEntry = entries[0];
      if (latestEntry) {
        const busyScale = Number(latestEntry.busyScale);
        if (busyScale < minBusyScale) {
          minBusyScale = busyScale;
          leastBusyLibs = [library];
        } else if (busyScale === minBusyScale) {
          leastBusyLibs.push(library);
        }
      }
    });

    setLeastBusyLibraries(leastBusyLibs);
  };

  const formatLibraries = (libraries: string[]) => {
    if (libraries.length === 0) {
      return "";
    } else if (libraries.length === 1) {
      return libraries[0];
    } else if (libraries.length === 2) {
      return `${libraries[0]} or ${libraries[1]}`;
    } else {
      const allButLast = libraries.slice(0, -1).join(', ');
      const last = `or ${libraries[libraries.length - 1]}`;
      return `${allButLast}, ${last}`;
    }
  };

  return (
    <div className="container mx-auto px-8 py-10">
      {/* Header with Icon */}
      <div className="flex items-center mb-10">
        <AcademicCapIcon className="h-8 w-8 text-primary-500 mr-4" />
        <h1 className="text-4xl font-bold">LibraryStatus</h1>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-6">
        {/* Progress Bars per Library */}
        {libraries.map((library) => (
          <Card key={library} className="shadow-lg">
            <CardHeader className="p-6">
              <CardTitle className="text-2xl font-semibold">{library} Breakdown</CardTitle>
              <CardDescription className="text-gray-500">{lastUpdated}</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              {floorsPerLibrary[library].length > 0 ? (
                floorsPerLibrary[library].map((floor) => (
                  <div key={floor} className="flex items-center">
                    <span className="w-24 text-right font-medium">{`Floor ${floor}`}</span>
                    <Progress className="flex-1 ml-4" value={getProgressValue(library, floor)} />
                  </div>
                ))
              ) : (
                <div className="flex items-center">
                  <span className="w-24 text-right font-medium">Overall</span>
                  <Progress className="flex-1 ml-4" value={getProgressValue(library)} />
                </div>
              )}
            </CardContent>
          </Card>
        ))}

        {/* Recommendations */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold">Recommendation</CardTitle>
          </CardHeader>
          <CardContent className="text-lg">
            {leastBusyLibraries.length > 0 ? (
              <p>
                We recommend you go to <strong>{formatLibraries(leastBusyLibraries)}</strong> as{' '}
                {leastBusyLibraries.length > 1 ? 'they are' : 'it is'} currently the least busy!
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
