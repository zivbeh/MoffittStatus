// pages/index.js
import React from 'react';
import './styles.css'
import StatsTable from '../../components/ui/StatsTable'; // Adjust path based on your folder structure

export default function Home() {
  return (
    <div>
      <h1>Library Seat Availability</h1>
      <StatsTable />
    </div>
  );
}
