// pages/api/saveData.ts
// import type { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs';
import path from 'path';
// import db from '../../../models';
// const db = require('../../../models');
// const libStats = db.LibraryStat
// console.log(libStats)

// Handle POST request
import { NextResponse } from 'next/server';
export async function POST(req) {

    const dataDirectory = path.join(process.cwd(), 'data');
    const filePath = path.join(dataDirectory, 'libraryStats.json');
    console.log("----------------------------------------------------")
    console.log("----------------------------------------------------")
    console.log("----------------------------------------------------")
    console.log("----------------------------------------------------")
    console.log("----------------------------------------------------")
    console.log("----------------------------------------------------")
    console.log("----------------------------------------------------")
    console.log("----------------------------------------------------")
    console.log("----------------------------------------------------")


    try {
        const data = await req.json();

        // Ensure the data directory exists
        if (!fs.existsSync(dataDirectory)) {
            fs.mkdirSync(dataDirectory);
        }

        // Read current data (if the file exists)
        let fileData = [];
        if (fs.existsSync(filePath)) {
            const fileContent = fs.readFileSync(filePath, 'utf8');
            fileData = JSON.parse(fileContent || '[]');
        }

        // Append new data
        fileData.push(data);

        // Write updated data back to the file
        fs.writeFileSync(filePath, JSON.stringify(fileData, null, 2), 'utf8');

        // const newLibraryStat = await libStats.create({
        //     floorID: data.name, // Adjust based on your incoming data structure
        //     busyScale: data.statValue, // Adjust based on your incoming data structure
        //     createdAt: new Date(), // Use current date for timestamp or adjust based on incoming data
        // });

        // Respond with a success message
        return NextResponse.json({ message: fileData });
    } catch (error) {
        console.error('Error saving data:', error);
        return NextResponse.json({ message: 'Error saving data.' }, { status: 500 });
    }
}