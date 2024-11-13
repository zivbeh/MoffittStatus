"use client";

import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type Library = {
  name: string;
  hours: {
    [day: string]: string; // e.g., "Mon": "8:00 AM - 10:00 PM"
  };
  status?: "Open" | "Closed";
};

export function LibraryHours() {
  const [libraries, setLibraries] = useState<Library[]>([
    {
      name: "Moffitt Library",
      hours: {
        Mon: "24 hours",
        Tue: "24 hours",
        Wed: "24 hours",
        Thu: "24 hours",
        Fri: "24 hours",
        Sat: "24 hours",
        Sun: "24 hours",
      },
    },
    {
      name: "Doe Library",
      hours: {
        Mon: "8:00 AM - 9:00 PM",
        Tue: "8:00 AM - 9:00 PM",
        Wed: "8:00 AM - 9:00 PM",
        Thu: "8:00 AM - 9:00 PM",
        Fri: "8:00 AM - 9:00 PM",
        Sat: "Closed",
        Sun: "1:00 PM - 9:00 PM",
      },
    },
    {
      name: "Main Stacks",
      hours: {
        Mon: "9:00 AM - 2:00 AM",
        Tue: "9:00 AM - 2:00 AM",
        Wed: "9:00 AM - 2:00 AM",
        Thu: "9:00 AM - 2:00 AM",
        Fri: "9:00 AM - 10:00 PM",
        Sat: "9:00 AM - 10:00 PM",
        Sun: "1:00 PM - 2:00 AM",
      },
    },
    {
      name: "Haas Library",
      hours: {
        Mon: "7:00 AM - 10:00 PM",
        Tue: "7:00 AM - 10:00 PM",
        Wed: "7:00 AM - 10:00 PM",
        Thu: "7:00 AM - 10:00 PM",
        Fri: "7:00 AM - 10:00 PM",
        Sat: "7:00 AM - 8:00 PM",
        Sun: "7:00 AM - 10:00 PM",
      },
    },
  ]);

  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    updateLibraryStatus(); // Update status immediately on mount
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      updateLibraryStatus();
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  const updateLibraryStatus = () => {
    setLibraries((prevLibraries) =>
      prevLibraries.map((library) => {
        const now = new Date();
        const dayOfWeek = now.toLocaleString("en-US", { weekday: "short" }); // e.g., "Mon"

        const todayHours = library.hours[dayOfWeek];

        if (!todayHours || todayHours === "Closed") {
          return { ...library, status: "Closed" };
        }

        if (todayHours === "24 hours") {
          return { ...library, status: "Open" };
        }

        const [openTimeStr, closeTimeStr] = todayHours.split(" - ");

        const parseTime = (timeStr: string) => {
          const [time, modifier] = timeStr.split(" ");
          const [hours, minutes] = time.split(":").map(Number);

          let finalHours = hours;
          if (modifier === "PM" && hours !== 12) {
            finalHours += 12;
          } else if (modifier === "AM" && hours === 12) {
            finalHours = 0;
          }

          const date = new Date();
          date.setHours(finalHours, minutes, 0, 0);
          return date;
        };

        const openTime = parseTime(openTimeStr);
        const closeTime = parseTime(closeTimeStr);

        // Adjust for overnight hours
        if (closeTime <= openTime) {
          closeTime.setDate(closeTime.getDate() + 1);
        }

        const isOpen = now >= openTime && now < closeTime;
        return { ...library, status: isOpen ? "Open" : "Closed" };
      })
    );
  };

  const dayOfWeek = currentTime.toLocaleString("en-US", { weekday: "short" });

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">UC Berkeley Library Hours</CardTitle>
        <CardDescription>
          Current operating hours for major campus libraries
          <br />
          Last updated: {currentTime.toLocaleTimeString()}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Library Name</TableHead>
              <TableHead>Today&apos;s Hours</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {libraries.map((library) => (
              <TableRow key={library.name}>
                <TableCell className="font-medium">{library.name}</TableCell>
                <TableCell>{library.hours[dayOfWeek] || "Closed"}</TableCell>
                <TableCell>
                  <Badge variant={library.status === "Open" ? "default" : "secondary"}>
                    {library.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
