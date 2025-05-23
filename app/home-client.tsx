"use client";

import { useEffect, useState } from "react";
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import NavBar from "@/components/basic/NavBar";

type FloorData = {
  libraryName: string;
  floorID: string;
  updatedBy: string;
  busyScale: number;
  createdAt: string;
};
const ProgressBarItem = ({libraryName, progressVal}:{libraryName:string, progressVal:number}) =>{
  return (
    <div className="mb-2">
                <div className="flex items-center space-x-2">
                  <span className="w-20 text-center font-medium">{libraryName}</span>
                  <div className="flex-1">
                    <Progress
                      value={progressVal}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>
  )
}
export default function HomePageClient() {
  const [data, setData] = useState<FloorData[]>([]);
  const [lastUpdated, setLastUpdated] = useState<string>("");
  const [leastBusyFloors, setLeastBusyFloors] = useState<string[]>([]);
  const [allFloorsAbove79, setAllFloorsAbove79] = useState<boolean>(false);
  const [recentUpdaters, setRecentUpdaters] = useState<string[]>([]);

  // Your existing functions (fetchStatusUpdates, updateLastUpdatedTime, etc.)
  const fetchStatusUpdates = async () => {
    try {
      const response = await fetch('/api/libraryStats/0', { method: 'GET' });
      if (response.ok) {
        const responseData = await response.json();
        console.log('Fetched data:', responseData);
        setData(responseData['message']);
        updateLastUpdatedTime(responseData['message']);
        computeLeastBusyFloors(responseData['message']);
        computeRecentUpdaters(responseData['message']);
      } else {
        console.error('API response not OK:', response.status);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
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

  // ... rest of your existing functions ...
  const getProgressValue = (library: string, floor?: string) => {
    const filteredEntries = data
      .filter(
        (entry) =>
          entry.libraryName === library &&
          (!floor || entry.floorID === floor || entry.floorID === "Overall")
      )
      .sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

    const latestEntry = filteredEntries[0];
    return latestEntry ? Number(latestEntry.busyScale) * 20 : 0;
  };

  const computeLeastBusyFloors = (data: FloorData[]) => {
    const floorIDs = ["Floor 1", "Floor 2", "Floor 3", "Floor 4"];
    let minBusyScale = Infinity;
    let leastBusy: string[] = [];
    let allAbove79 = true;

    floorIDs.forEach((floorID) => {
      const floorEntries = data
        .filter(
          (entry) =>
            entry.libraryName === "Moffitt Library" && entry.floorID === floorID
        )
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

        if (progressValue < minBusyScale && progressValue < 100) {
          minBusyScale = progressValue;
          leastBusy = [floorID];
        } else if (progressValue === minBusyScale) {
          leastBusy.push(floorID);
        }
      }
    });

    setLeastBusyFloors(leastBusy);
    setAllFloorsAbove79(allAbove79);
  };

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
    <div className="container mx-auto px-4 mt-5">
      
      <NavBar LibraryCapacity={true} LibraryHours={true} MLK={true}></NavBar>

      {/* Floor Breakdown */}
      <div className="w-full flex flex-col gap-6">
        <Card className="shadow-md transition-transform duration-300 hover:scale-105 sm:hover:scale-103">
          <CardHeader className="text-left p-4">
            <CardTitle className="text-xl font-semibold">Library Status</CardTitle>
            <CardDescription className="text-gray-500 text-sm">
              {lastUpdated}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-2 mt-2 mb-4">
            {/* Moffitt Library Section */}
            <div className="flex-1">
              <h2 className="text-lg text-center font-semibold mb-3">Moffitt Library is closed till 2026. However, more updates for MoffitStatus are coming!
              </h2>
              {/* {["Floor 1", "Floor 3", "Floor 4", "Floor 5"].map((floor) => (
                <div key={floor} className="flex items-center space-x-2 mb-2">
                  <span className="w-20 text-center font-medium">
                    {floor}
                  </span>
                  <div className="flex-1">
                    <Progress
                      value={getProgressValue("Moffitt Library", floor)}
                      className="w-full"
                    />
                  </div>
                </div>
              ))} */}
            </div>

            {/* Thin Horizontal Divider */}
            <div className="w-full h-px bg-gray-300 my-2"></div>

            {/* Other Libraries Section */}
            <div className="flex-1 space-y-2">
              <h2 className="text-lg text-center font-semibold mb-3">Other Libraries</h2>
              <ProgressBarItem libraryName="Stacks" progressVal={getProgressValue("Main Stacks")}></ProgressBarItem>
              <ProgressBarItem libraryName="Doe" progressVal={getProgressValue("Doe Library")}></ProgressBarItem>
              <ProgressBarItem libraryName="Haas" progressVal={getProgressValue("Haas Library")}></ProgressBarItem>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recommendations */}
      <div className="mt-4">
        <Card className="shadow-md w-full mx-auto transition-transform duration-300 hover:scale-105 sm:hover:scale-103">
          <CardHeader className="text-left p-4">
            <CardTitle className="text-xl font-semibold">Recommendations</CardTitle>
          </CardHeader>
          <CardContent className="">
            <div className="space-y-4">
              {/* Solo Recommendation */}
              <p className="text-left text-lg">
                <strong>For Individuals:</strong>{" "}
                {leastBusyFloors.length > 0 ? (
                  <>
                    Go to <strong>{formatFloors(leastBusyFloors)}</strong> in
                    Moffitt Library
                  </>
                ) : (
                  <>
                    Moffitt is closed. Consider studying at{" "}
                    <strong>
                      {getProgressValue("Doe Library") < 80
                        ? "Doe Library"
                        : getProgressValue("Haas Library") < 80
                        ? "Haas Library"
                        : "Main Stacks"}
                    </strong>
                    .
                  </>
                )}
              </p>
              {/* Group Recommendation */}
              <p className="text-left text-lg">
                <strong>For Groups:</strong>{" "}
                {allFloorsAbove79 || leastBusyFloors.length === 0 ? (
                  <>
                    Moffitt is closed. Go to{" "}
                    <strong>
                      {getProgressValue("Doe Library") < 80
                        ? "Doe Library"
                        : getProgressValue("Haas Library") < 80
                        ? "Haas Library"
                        : "Main Stacks"}
                    </strong>
                    .
                  </>
                ) : (
                  <>
                    Go to <strong>{formatFloors(leastBusyFloors)}</strong> in
                    Moffitt Library
                  </>
                )}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Thank You Section */}
      <div className="mt-4 mb-5">
        <Card className="shadow-md w-full mx-auto transition-transform duration-300 hover:scale-105 sm:hover:scale-103">
          <CardHeader className="text-left p-4">
            <CardTitle className="text-xl font-semibold">Library Contributors</CardTitle>
            <CardDescription className="text-gray-500 text-sm">
              A special thanks to our recent contributors:
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
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
  );
}
