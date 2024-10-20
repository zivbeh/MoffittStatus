// pages/api/saveData.ts
// import type { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs';
import path from 'path';

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//     console.log("-------------------------------------------")
//     console.log(req.body)
//     if (req.method === 'POST') {
//         const dataDirectory = path.join(process.cwd(), 'data');
//         const filePath = path.join(dataDirectory, 'libraryStats.json');

//         try {
//             // Ensure data directory exists
//             if (!fs.existsSync(dataDirectory)) {
//                 fs.mkdirSync(dataDirectory);
//             }

//             // Read current data (if file exists)
//             let fileData = [];
//             if (fs.existsSync(filePath)) {
//                 const fileContent = fs.readFileSync(filePath, 'utf8');
//                 fileData = JSON.parse(fileContent || '[]');
//             }

//             // Append new data
//             const newData = req.body;
//             fileData.push(newData);

//             // Write updated data back to file
//             fs.writeFileSync(filePath, JSON.stringify(fileData, null, 2), 'utf8');

//             res.status(200).json({ message: 'Data saved successfully!' });
//         } catch (error) {
//             console.error('Error saving data:', error);
//             res.status(500).json({ message: 'Error saving data.' });
//         }
//     } else {
//         res.status(405).json({ message: 'Method not allowed.' });
//     }
// }



// Handle POST request

import { NextResponse } from 'next/server';
export async function POST(req: Request) {

  const dataDirectory = path.join(process.cwd(), 'data');
  const filePath = path.join(dataDirectory, 'libraryStats.json');

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

    // Respond with a success message
    return NextResponse.json({ message: 'Data saved successfully!' });
  } catch (error) {
    console.error('Error saving data:', error);
    return NextResponse.json({ message: 'Error saving data.' }, { status: 500 });
  }
}