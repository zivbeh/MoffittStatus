// pages/api/libraryStats.js
import fs from 'fs';
import path from 'path';

export async function GET(req, res) {
    const filePath = path.join(process.cwd(), 'data', 'libraryStats.json');
    const fileContents = fs.readFileSync(filePath, 'utf8');
    res.status(200).json(JSON.parse(fileContents));
}