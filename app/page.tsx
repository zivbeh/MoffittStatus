"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartConfig, ChartContainer } from "@/components/ui/chart";
import { Progress } from "@/components/ui/progress";
import { TrendingUp } from "lucide-react";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";
import { AcademicCapIcon } from '@heroicons/react/24/outline';

const chartData = [
  { month: "12p", desktop: 186 },
  { month: "3p", desktop: 305 },
  { month: "6p", desktop: 237 },
  { month: "9p", desktop: 73 },
  { month: "12a", desktop: 214 },
];

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export default function Home() {
  return (
    <div>
      {/* Title and Cap Icon */}
      <div className="flex items-center ml-5 mt-5">
        <AcademicCapIcon className="h-6 w-6 text-primary-500 mr-2" />
        <h1 className="font-bold text-2xl">MoffittStatus</h1>
      </div>

      {/* Main Content Layout */}
      <div className="flex flex-col md:flex-row w-full h-full">

        {/* Left 1/3: Chart */}
        <div className="w-full md:w-1/3 p-2">  {/* Reduced padding here */}
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Moffitt Capacity</CardTitle>
              <CardDescription>12pm - 12am</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig}>
                <LineChart
                  accessibilityLayer
                  data={chartData}
                  margin={{ left: 12, right: 12 }}
                >
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={(value) => value.slice(0, 3)}
                  />
                  <Line
                    dataKey="desktop"
                    type="natural"
                    stroke="var(--color-desktop)"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 text-sm">
              <div className="flex gap-2 font-medium leading-none">
                Trending up by 5.2% this week <TrendingUp className="h-4 w-4" />
              </div>
              <div className="leading-none text-muted-foreground">
                Showing capacity level for the last 12 hours
              </div>
            </CardFooter>
          </Card>
        </div>

        {/* Middle 1/3: Floor Breakdown and Recommendations */}
        <div className="w-full md:w-2/3 p-2 flex flex-col">  {/* Reduced padding here */}
          {/* Progress Bars */}
          <Card className="mb-6">
            <CardTitle className="ml-5 mt-5 mb-2">Floor Breakdown</CardTitle>
            <CardDescription className="ml-5 mb-3">Last updated 10 mins ago</CardDescription>
            <CardContent>
              <div className="flex items-center w-full mb-3">
                <span className="mr-4 w-16 text-right"> Floor 1</span>
                <Progress className="w-full" value={10} />
              </div>
              <div className="flex items-center w-full mb-3">
                <span className="mr-4 w-16 text-right">Floor 3</span>
                <Progress className="w-full" value={57} />
              </div>
              <div className="flex items-center w-full mb-3">
                <span className="mr-4 w-16 text-right">Floor 4</span>
                <Progress className="w-full" value={98} />
              </div>
              <div className="flex items-center w-full mb-3">
                <span className="mr-4 w-16 text-right">Floor 5</span>
                <Progress className="w-full" value={83} />
              </div>
            </CardContent>
          </Card>

          {/* Recommendations */}
          <Card>
            <CardTitle className="mt-5 ml-6 mr-5">Recommendation</CardTitle>
            <CardDescription className="font-bold ml-6 mt-2">Haas or Doe</CardDescription>
            <CardContent>
              <CardDescription className="mt-2">If you are solo, then Floor 1 should be good.</CardDescription>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Bottom-Centered Text */}
      <div className="mt-8 flex justify-center">
        <p className="text-center text-sm">
          follow us on{" "}
          <a
            href="https://www.instagram.com/moffittstatus"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >
            instagram
          </a>{" "}
        </p>
      </div>
    </div>
  );
}
