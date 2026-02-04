"use client"

import React, { useState, useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Calendar, Clock, TrendingDown } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

// Helper to format 0-23 index to "12 PM"
const formatHour = (hourIndex: number) => {
  if (hourIndex === 0) return '12 AM';
  if (hourIndex === 12) return '12 PM';
  return hourIndex > 12 ? `${hourIndex - 12} PM` : `${hourIndex} AM`;
};

export function BusynessPopup({ schedule, libraryName }: { schedule: any[], libraryName: string }) {
  // Get current day/time for defaults
  const now = new Date();
  const currentHour = now.getHours();
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const todayName = days[now.getDay()];

  const [selectedDay, setSelectedDay] = useState(todayName);

  // Transform raw data [0, 0, 45...] into chart friendly [{ hour: '12 AM', score: 0 }, ...]
  const chartData = useMemo(() => {
    const dayData = schedule?.find(d => d.name === selectedDay);
    if (!dayData || !dayData.data) return [];

    return dayData.data.map((score: number, i: number) => ({
      hourIndex: i,
      hourLabel: formatHour(i),
      score: score,
      isCurrentHour: selectedDay === todayName && i === currentHour
    }));
  }, [schedule, selectedDay, todayName, currentHour]);

  // Calculate simple insights
  const peak = Math.max(...(chartData.map((d: any) => d.score) || [0]));
  const currentScore = chartData.find((d: any) => d.isCurrentHour)?.score || 0;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 text-xs border-dashed">
          <TrendingDown className="h-3 w-3" />
          Forecast
        </Button>
      </PopoverTrigger>
      
      <PopoverContent className="w-[350px] sm:w-[400px] p-4" align="end">
        <div className="space-y-4">
          
          {/* Header */}
          <div className="flex justify-between items-start">
            <div>
              <h4 className="font-semibold text-lg leading-none">{libraryName}</h4>
              <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {selectedDay === todayName ? "Live Forecast" : `${selectedDay} Forecast`}
              </p>
            </div>
            {selectedDay === todayName && (
               <Badge variant={currentScore > 75 ? "destructive" : "secondary"}>
                 Current: {currentScore}%
               </Badge>
            )}
          </div>

          {/* Day Switcher Tabs */}
          <Tabs defaultValue={todayName} onValueChange={setSelectedDay} className="w-full">
            <TabsList className="w-full justify-start h-auto flex-wrap gap-1 bg-transparent p-0">
              {days.map((day) => {
                 // Sort days to start with Today
                 return (
                  <TabsTrigger 
                    key={day} 
                    value={day}
                    className="text-[10px] px-2 h-6 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground border"
                  >
                    {day.slice(0, 3)}
                  </TabsTrigger>
                 )
              })}
            </TabsList>
          </Tabs>

          {/* The Graph */}
          <div className="h-[200px] w-full mt-4">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id={`colorGradient-${libraryName}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  
                  <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                  <XAxis 
                    dataKey="hourLabel" 
                    interval={3} 
                    tick={{ fontSize: 10 }} 
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis 
                    domain={[0, 100]} 
                    tick={{ fontSize: 10 }} 
                    axisLine={false}
                    tickLine={false}
                  />
                  
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', fontSize: '12px' }}
                    labelStyle={{ fontWeight: 'bold', color: '#666' }}
                    formatter={(value: number) => [`${value}% Busy`, 'Crowd Level']}
                  />

                  <Area 
                    type="monotone" 
                    dataKey="score" 
                    stroke="#8884d8" 
                    fillOpacity={0.5} 
                    fill={'#4884d8'} 
                  />

                  {/* Vertical Line for "Right Now" */}
                  {selectedDay === todayName && (
                    <ReferenceLine x={formatHour(currentHour)} stroke="red" strokeDasharray="3 3" label={{ position: 'top', value: 'NOW', fontSize: 10, fill: 'red' }} />
                  )}
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
                No historical data available.
              </div>
            )}
          </div>

          {/* Footer Insights */}
          <div className="text-xs text-muted-foreground bg-muted/50 p-2 rounded-md">
            Typically peaks around <strong>{chartData.reduce((max:any, curr:any) => curr.score > max.score ? curr : max, {score:0})?.hourLabel}</strong> ({peak}% capacity).
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}