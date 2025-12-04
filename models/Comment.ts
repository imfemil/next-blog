import mongoose from 'mongoose';

const CommentSchema = new mongoose.Schema({
    blogSlug: { type: String, required: true, index: true },
    author: { type: String, required: true },
    rating: { type: Number, default: 5 },
    date: { type: String }, // Storing as string to match current format "14 Mar 2024"
    content: { type: String, required: true },
    avatar: { type: String },
    email: { type: String },
}, { timestamps: true });

export default mongoose.models.Comment || mongoose.model('Comment', CommentSchema);
