// pages/api/saveData.ts
// import type { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs';
import path from 'path';
// import { Floor } from '../../../models';
import mysql from 'mysql2/promise'


import { NextResponse } from 'next/server';
export async function POST(req, res) {

    const dataDirectory = path.join(process.cwd(), 'data');
    const filePath = path.join(dataDirectory, 'libraryStats.json');

    const dbconnection = await mysql.createConnection({
        user: "moffittstatus:us-west2:moffittstatus",
        password: "1234567",
        database: "moffittstatus",
        host: "34.94.105.169",
    })


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

        // const newFloor = await Floor.create({
        //   floorNumber: data["floor"],    // Assuming 'floor' is mapped to 'floorNumber'
        //   percentCapacity: data["busyScale"]  // Assuming 'busyScale' represents the 'percentCapacity'
        // });

        const query = "select floorNumber, bustScale, createdAt from Floor"
        const values = []
        const [results] = await dbconnection.execute(query, values);
        dbconnection.end()
            // res.status(200).json({ results: results })
            // Respond with a success message
        return NextResponse.json({ message: results });
    } catch (error) {
        console.error('Error saving data:', error);
        return NextResponse.json({ message: 'Error saving data.' }, { status: 500 });
    }
}