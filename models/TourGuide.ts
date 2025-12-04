import mongoose from 'mongoose';

const TourGuideSchema = new mongoose.Schema({
    name: { type: String, required: true },
    location: { type: String },
    rating: { type: Number },
    reviews: { type: Number },
    avatar: { type: String },
    specialty: { type: String },
}, { timestamps: true });

export default mongoose.models.TourGuide || mongoose.model('TourGuide', TourGuideSchema);
