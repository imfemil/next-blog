import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import TourGuide from '@/models/TourGuide';

export async function GET() {
    try {
        await dbConnect();
        const guides = await TourGuide.find({});
        return NextResponse.json(guides);
    } catch (error) {
        console.error('Database Error:', error);
        return NextResponse.json({ error: 'Failed to fetch tour guides' }, { status: 500 });
    }
}
