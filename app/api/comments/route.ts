import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Comment from '@/models/Comment';

export async function GET(request: Request) {
    try {
        await dbConnect();
        const { searchParams } = new URL(request.url);
        const blogSlug = searchParams.get('blogSlug');

        if (!blogSlug) {
            return NextResponse.json({ error: 'Blog slug is required' }, { status: 400 });
        }

        const comments = await Comment.find({ blogSlug }).sort({ createdAt: -1 });
        return NextResponse.json(comments);
    } catch (error) {
        console.error('Error fetching comments:', error);
        return NextResponse.json({ error: 'Failed to fetch comments' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        await dbConnect();
        const body = await request.json();

        const { blogSlug, author, content, rating, email } = body;

        // Robust Validation
        if (!blogSlug || typeof blogSlug !== 'string') {
            return NextResponse.json({ error: 'Invalid or missing blogSlug' }, { status: 400 });
        }
        if (!author || typeof author !== 'string' || author.trim().length < 2) {
            return NextResponse.json({ error: 'Author name is required and must be at least 2 characters' }, { status: 400 });
        }
        if (!content || typeof content !== 'string' || content.trim().length < 3) {
            return NextResponse.json({ error: 'Content is required and must be at least 3 characters' }, { status: 400 });
        }

        // Sanitize Rating
        let safeRating = 5;
        if (typeof rating === 'number' && rating >= 1 && rating <= 5) {
            safeRating = rating;
        }

        const newComment = await Comment.create({
            blogSlug,
            author: author.trim(),
            email: email?.trim(),
            content: content.trim(),
            rating: safeRating,
            date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(author)}&background=random&color=fff&size=128`
        });

        return NextResponse.json(newComment, { status: 201 });
    } catch (error) {
        console.error('Error creating comment:', error);
        return NextResponse.json({ error: 'Failed to create comment' }, { status: 500 });
    }
}
