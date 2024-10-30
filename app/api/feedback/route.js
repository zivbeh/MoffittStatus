import { NextResponse } from 'next/server';
import db from '../../../lib/db';

export async function POST(req) {
    try {
        const data = await req.json();

        // Insert data into the database
        const query = 'INSERT INTO feedback (accurate, feedback_text, created_at) VALUES (?, ?, ?)';
        await db.execute(query, [
            data.accurate,
            data.feedback_text,
            data.created_at
        ]);

        return NextResponse.json({ message: 'Feedback submitted successfully' });
    } catch (error) {
        console.error('Error saving feedback:', error);
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

export async function GET() {
    try {
        const query = 'SELECT accurate, feedback_text, created_at FROM feedback ORDER BY created_at DESC';
        const [rows] = await db.query(query);

        return NextResponse.json({ message: rows }, {
            headers: {
                'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
                Pragma: 'no-cache',
                Expires: '0',
                'Surrogate-Control': 'no-store',
            }
        });
    } catch (error) {
        console.error('Error fetching feedback data:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}