// app/api/libraryStats/route.js
// import fs from 'fs';
// import path from 'path';
import { NextResponse } from 'next/server';
import db from '../../../lib/db';


export async function GET() {
    // const filePath = path.join(process.cwd(), 'data', 'libraryStats.json');
    // const fileContents = fs.readFileSync(filePath, 'utf8');

    const connection = await db.getConnection();
    const [rows] = await connection.query('SELECT * FROM libStats');
    connection.release();

    return NextResponse.json({ message: rows });
}