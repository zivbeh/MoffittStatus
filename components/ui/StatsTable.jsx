// components/StatsTable.js
// import React from 'react';
// import statsDataJson from '../../data/libraryStats.json';
'use client'
import React, { useEffect, useState } from 'react';

const differenceInTimeStr = (savedTime) => {
  //date format
  const savedDate = new Date(savedTime)
  // Get the current time
  const currentDate = new Date()

  // Calculate the difference in milliseconds
  const timeDifferenceMs = currentDate.getTime() - savedDate.getTime();
  // Convert the difference to hours and minutes
  const differenceInHours = Math.floor(timeDifferenceMs / (1000 * 60 * 60)); // Total hours
  const differenceInMinutes = Math.floor((timeDifferenceMs % (1000 * 60 * 60)) / (1000 * 60)); // Remaining minutes
  // Create a string to display the time difference
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

  // If no time difference, set a default message
  if (!timeDifferenceStr) {
    timeDifferenceStr = "just now";
  } else {
    timeDifferenceStr = `last updated ${timeDifferenceStr} ago`;
  }
  return timeDifferenceStr
}

const StatsTable = () => {
  // const statsData = statsDataJson
  const [statsData, setStatsData] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      const response = await fetch('/api/libraryStats');
      const data = await response.json();
      setStatsData(data["message"]);
    };

    fetchStats();
  }, []);

  return (
  <table>
    <thead>
      <tr>
        <th>Floor</th>
        <th>Busy Scale</th>
        <th>Last Updated</th>
      </tr>
    </thead>
    <tbody>
      {statsData.map((stat, index) => (
        <tr key={index}>
          <td>{stat.floorID}</td>
          <td style={{ color: Number(stat.busyScale) < 2 ? '#3eed3e' : Number(stat.busyScale) <= 3 ? '#eded5f' : '#ff2020' }}><b>{Number(stat.busyScale)*20}%</b></td>
          <td>{differenceInTimeStr(stat.createdAt)}</td>
        </tr> 
      ))}
    </tbody>
  </table>
)
};

export default StatsTable;
