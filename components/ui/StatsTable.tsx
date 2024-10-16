// components/StatsTable.js
import React from 'react';

const statsData = [
  { floor: '1st Floor', openSeats: 10, totalSeats: 50, busyPercentage: '80%' },
  { floor: '2nd Floor', openSeats: 5, totalSeats: 60, busyPercentage: '91%' },
  { floor: '3rd Floor', openSeats: 15, totalSeats: 40, busyPercentage: '62%' },
  { floor: '4th Floor', openSeats: 20, totalSeats: 55, busyPercentage: '64%' },
];

const StatsTable = () => (
  <table>
    <thead>
      <tr>
        <th>Floor</th>
        <th>Open Seats</th>
        <th>Total Seats</th>
        <th>Busy Percentage</th>
      </tr>
    </thead>
    <tbody>
      {statsData.map((stat, index) => (
        <tr key={index}>
          <td>{stat.floor}</td>
          <td>{stat.openSeats}</td>
          <td>{stat.totalSeats}</td>
          <td>{stat.busyPercentage}</td>
        </tr>
      ))}
    </tbody>
  </table>
);

export default StatsTable;
