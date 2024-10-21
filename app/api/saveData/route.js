// pages/api/saveData.ts
// import type { NextApiRequest, NextApiResponse } from 'next'
// import fs from 'fs';
// import path from 'path';
import db from '../../../lib/db';

// Handle POST request
import { NextResponse } from 'next/server';
export async function POST(req) {

    // const dataDirectory = path.join(process.cwd(), 'data');
    // const filePath = path.join(dataDirectory, 'libraryStats.json');
    try {
        const data = await req.json();

        // // Ensure the data directory exists
        // if (!fs.existsSync(dataDirectory)) {
        //     fs.mkdirSync(dataDirectory);
        // }

        // // Read current data (if the file exists)
        // let fileData = [];
        // if (fs.existsSync(filePath)) {
        //     const fileContent = fs.readFileSync(filePath, 'utf8');
        //     fileData = JSON.parse(fileContent || '[]');
        // }

        // // Append new data
        // fileData.push(data);

        // // Write updated data back to the file
        // fs.writeFileSync(filePath, JSON.stringify(fileData, null, 2), 'utf8');

        const connection = await db.getConnection();

        // Insert data into the database
        const query = 'INSERT INTO libStats (floorID, busyScale, createdAt) VALUES (?, ?, ?)';
        await connection.execute(query, [data.floor, data.busyScale, new Date()]);

        // Optionally, you can fetch all data to respond with updated stats
        const [rows] = await connection.query('SELECT * FROM libStats');

        // Release the connection back to the pool
        connection.release();

        // Respond with a success message
        return NextResponse.json({ message: rows });
    } catch (error) {
        // console.error('Error saving data:', error);
        // const [rows] = await connection.query('SELECT * FROM libraryStats');
        return NextResponse.json({ message: error }, { status: 500 });
    }
}