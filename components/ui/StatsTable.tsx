// components/ui/StatsTable.tsx
'use client';

import React, { useEffect, useState } from 'react';

type FloorData = {
  libraryName: string;
  floorID: string;
  updatedBy: string;
  busyScale: number;
  createdAt: string;
};

const differenceInTimeStr = (savedTime: string): string => {
  const savedDate = new Date(savedTime);
  const currentDate = new Date();

  const timeDifferenceMs = currentDate.getTime() - savedDate.getTime();
  const differenceInHours = Math.floor(timeDifferenceMs / (1000 * 60 * 60));
  const differenceInMinutes = Math.floor((timeDifferenceMs % (1000 * 60 * 60)) / (1000 * 60));

  let timeDifferenceStr = "";
  if (differenceInHours > 0) {
    timeDifferenceStr += `${differenceInHours} hour${differenceInHours > 1 ? "s" : ""}`;
  }
  if (differenceInMinutes > 0) {
    if (differenceInHours > 0) {
      timeDifferenceStr += " and ";
    }
    timeDifferenceStr += `${differenceInMinutes} minute${differenceInMinutes > 1 ? "s" : ""}`;
  }

  if (!timeDifferenceStr) {
    timeDifferenceStr = "just now";
  } else {
    timeDifferenceStr = `${timeDifferenceStr} ago`;
  }
  return timeDifferenceStr;
};

const StatsTable: React.FC = () => {
  const [statsData, setStatsData] = useState<FloorData[]>([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/libraryStats/0', {
          method: 'GET',
          headers: {
            'Cache-Control': 'no-cache',
          },
        });
    
        if (!response.ok) {
          console.error('Failed to fetch data:', response.status, response.statusText);
          return;
        }
    
        const data = await response.json();
        console.log('Fetched data:', data);
        setStatsData(data['message']);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchStats();
  }, []);

  return (
    <table>
      <thead>
        <tr>
          <th>Library</th>
          <th>Floor</th>
          <th>Busy Scale</th>
          <th>Last Updated</th>
        </tr>
      </thead>
      <tbody>
        {statsData.length > 0 ? (
          statsData.map((stat, index) => (
            <tr key={index}>
              <td>{stat.libraryName || 'Unknown Library'}</td>
              <td>{stat.floorID}</td>
              <td
                style={{
                  color:
                    Number(stat.busyScale) < 2
                      ? '#3eed3e'
                      : Number(stat.busyScale) <= 3
                      ? '#eded5f'
                      : '#ff2020',
                }}
              >
                <b>{Number(stat.busyScale) * 20}%</b>
              </td>
              <td>{differenceInTimeStr(stat.createdAt)}</td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={4}>No data available.</td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default StatsTable;
