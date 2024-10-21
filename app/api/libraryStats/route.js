// app/api/libraryStats/route.js
// import fs from 'fs';
// import path from 'path';
import { NextResponse } from 'next/server';
import db from '../../../lib/db';


export async function GET() {
    try {
        const connection = await db.getConnection();
        const [rows] = await connection.query('SELECT * FROM libStats');
        connection.release();

        console.log('Data from DB:', rows); // Add this line for debugging

        return NextResponse.json({ message: rows }, {
            headers: {
                'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0'
            }
        });
    } catch (error) {
        console.error('Database query error:', error); // Log any errors
        return NextResponse.json({ error: error });
    }
}