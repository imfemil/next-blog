import mongoose from 'mongoose';

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

export default mongoose.models.Blog || mongoose.model('Blog', BlogSchema);
