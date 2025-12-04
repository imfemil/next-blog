import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Blog from '@/models/Blog';
import TourGuide from '@/models/TourGuide';
import Comment from '@/models/Comment';
import blogsData from '@/data/blogs.json';
import blogPageData from '@/data/blog-data.json';

export async function GET() {
    try {
        await dbConnect();

        // Clear existing data
        await Blog.deleteMany({});
        await TourGuide.deleteMany({});
        await Comment.deleteMany({});

        // Seed Blogs
        const blogs = blogsData.blogs;
        await Blog.insertMany(blogs);

        // Seed Tour Guides
        const tourGuides = blogPageData.tourGuides;
        await TourGuide.insertMany(tourGuides);

        // Seed Comments
        // Assigning existing comments to the first blog for demo purposes
        const comments = blogPageData.comments.map(c => ({
            ...c,
            blogSlug: 'hidden-gems-bali-indonesia', // Default to the first blog
            avatar: c.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop' // Fallback
        }));
        await Comment.insertMany(comments);

        return NextResponse.json({ message: 'Database seeded successfully' });
    } catch (error) {
        console.error('Seeding error:', error);
        return NextResponse.json({ error: 'Failed to seed database' }, { status: 500 });
    }
}
