// app/api/libraryStats/route.js
import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

export async function GET() {
    const filePath = path.join(process.cwd(), 'data', 'libraryStats.json');
    const fileContents = fs.readFileSync(filePath, 'utf8');
    return NextResponse.json(JSON.parse(fileContents));
}