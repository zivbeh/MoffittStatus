// pages/api/saveData.ts
// import type { NextApiRequest, NextApiResponse } from 'next'
// import fs from 'fs';
// import path from 'path';
import db from '../../../lib/db';
// Handle POST request
import { NextResponse } from 'next/server';

// import cron from 'node-cron';
// import fetch from 'node-fetch';

// cron.schedule('1 * * * *', async() => {
//     try {
//         data = {
//             libraryName: "Haas Library",
//             floor: null,
//             updatedBy: "Anonymous",
//             busyScale: 2,
//             createdAt: new Date()
//         }
//         const response = await fetch('https://moffittstatus.live/api/saveData', {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({ data }) // Send data in the expected format
//         });

//         if (response.ok) {
//             console.log('Data sent successfully at 2:00 am:', data);
//         } else {
//             console.error('Failed to send data:', response.statusText);
//         }
//     } catch (error) {
//         console.error('Error sending POST request:', error);
//     }
// });



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

        // const connection = await db.getConnection();

        // Insert data into the database
        const query = 'INSERT INTO libStats (libraryName, floorID, updatedBy, busyScale, createdAt) VALUES (?, ?, ?, ?, ?)';
        await db.execute(query, [data.libraryName, data.floor, data.updatedBy, data.busyScale, data.createdAt]);

        // Optionally, you can fetch all data to respond with updated stats
        // await db.query('SELECT * FROM libStats');

        // Release the connection back to the pool
        // connection.release();

        // Respond with a success message
        return NextResponse.json({ message: data.updatedBy });
    } catch (error) {
        // console.error('Error saving data:', error);
        // const [rows] = await connection.query('SELECT * FROM libraryStats');
        return NextResponse.json({ message: error }, { status: 500 });
    }
}