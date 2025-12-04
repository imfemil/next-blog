import mongoose from 'mongoose';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

// Load env vars
dotenv.config({ path: '.env.local' });

// If dotenv is not installed, we might need a fallback or just rely on the user having it.
// But since I'm running via npx, I can try to use the default URI if env is missing.
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/next-blog';

// Models (Inline definition to avoid import issues if paths are tricky, 
// but let's try importing first. If that fails, I'll inline them.)
// Actually, importing from @/models might fail if tsconfig paths aren't picked up.
// To be safe and robust, I will define the schemas inline in this script or use relative paths.
// Relative paths are safer: '../models/Blog'

// Wait, I can't easily import the models if they use 'mongoose' singleton which might differ?
// No, it should be fine.

// Let's try to use the existing files with relative paths.
// But wait, the models use `export default mongoose.models.Blog || ...`
// This relies on the mongoose instance.

// Let's just redefine the schemas here to be 100% sure it works as a standalone script
// without worrying about Next.js specific module resolution or singleton issues.

const connectDB = async () => {
    if (mongoose.connection.readyState >= 1) return;
    await mongoose.connect(MONGODB_URI);
    console.log('MongoDB Connected');
};

const BlogSchema = new mongoose.Schema({
    slug: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    excerpt: { type: String },
    content: { type: [String], required: true },
    author: {
        name: { type: String },
        avatar: { type: String },
        bio: { type: String },
    },
    date: { type: String },
    readTime: { type: String },
    heroImage: { type: String },
    category: { type: String },
    quote: { type: String },
}, { timestamps: true });

const TourGuideSchema = new mongoose.Schema({
    name: { type: String, required: true },
    location: { type: String },
    rating: { type: Number },
    reviews: { type: Number },
    avatar: { type: String },
    specialty: { type: String },
}, { timestamps: true });

const CommentSchema = new mongoose.Schema({
    blogSlug: { type: String, required: true, index: true },
    author: { type: String, required: true },
    rating: { type: Number, default: 5 },
    date: { type: String },
    content: { type: String, required: true },
    avatar: { type: String },
    email: { type: String },
}, { timestamps: true });

const Blog = mongoose.models.Blog || mongoose.model('Blog', BlogSchema);
const TourGuide = mongoose.models.TourGuide || mongoose.model('TourGuide', TourGuideSchema);
const Comment = mongoose.models.Comment || mongoose.model('Comment', CommentSchema);

// Read JSON data
const blogsDataPath = path.join(process.cwd(), 'data', 'blogs.json');
const blogPageDataPath = path.join(process.cwd(), 'data', 'blog-data.json');

const blogsData = JSON.parse(fs.readFileSync(blogsDataPath, 'utf-8'));
const blogPageData = JSON.parse(fs.readFileSync(blogPageDataPath, 'utf-8'));

const seed = async () => {
    try {
        await connectDB();

        console.log('Clearing existing data...');
        await Blog.deleteMany({});
        await TourGuide.deleteMany({});
        await Comment.deleteMany({});

        console.log('Seeding Blogs...');
        await Blog.insertMany(blogsData.blogs);

        console.log('Seeding Tour Guides...');
        await TourGuide.insertMany(blogPageData.tourGuides);

        console.log('Seeding Comments...');
        const comments = blogPageData.comments.map((c: any) => ({
            ...c,
            blogSlug: 'hidden-gems-bali-indonesia',
            avatar: c.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop'
        }));
        await Comment.insertMany(comments);

        console.log('Database seeded successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seed();
