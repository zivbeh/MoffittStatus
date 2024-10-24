// app/api/libraryStats/[id]/route.js

import { NextResponse } from 'next/server';
import db from '../../../../lib/db'; // Ensure this path is correct

/**
 * GET Handler
 * 
 * - If `id` is '0', fetch all library stats.
 * - Otherwise, fetch stats for the specified `libraryName`.
 */
export async function GET(req, { params }) {
  const { id } = params;

  try {
    let query;
    let values = [];

    if (id === '0') {
      // If 'id' is '0', fetch all data
      query = 'SELECT libraryName, floorID, updatedBy, busyScale, createdAt FROM libStats';
    } else {
      // Use 'id' to filter data by libraryName
      query = 'SELECT libraryName, floorID, updatedBy, busyScale, createdAt FROM libStats WHERE libraryName = ?';
      values = [id];
    }

    // Execute the query
    const [rows] = await db.query(query, values);

    // Return the fetched data as JSON
    return NextResponse.json(
      { message: rows },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          Pragma: 'no-cache',
          Expires: '0',
          'Surrogate-Control': 'no-store',
        }
      }
    );
  } catch (error) {
    console.error('Error fetching data:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
