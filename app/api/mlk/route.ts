import { NextResponse } from 'next/server';
import scrapeOccupancy from '@/app/mlk/scraper';

export async function GET() {
    try {
        const data = await scrapeOccupancy();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Scraping error:', error);
        return NextResponse.json({ error: 'Failed to scrape data' }, { status: 500 });
    }
}
