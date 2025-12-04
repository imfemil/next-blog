'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Star, Frown, Meh, Smile, SmilePlus, Laugh } from 'lucide-react';
import { useGetCommentsQuery, useAddCommentMutation } from '@/lib/features/api/apiSlice';
import { Skeleton } from '@/components/ui/Skeleton';
import toast from 'react-hot-toast';
import styles from '@/app/blog/[slug]/blog.module.css';

// Enhanced Rating Selector matching the design
const RatingSelector = ({ value, onChange }: { value: string; onChange: (val: string) => void }) => {
    const ratings = [
        { label: 'Bad', color: 'bg-red-500', iconColor: 'text-red-500', icon: Frown, value: 'bad' },
        { label: 'Average', color: 'bg-orange-500', iconColor: 'text-orange-500', icon: Meh, value: 'average' },
        { label: 'Normal', color: 'bg-yellow-400', iconColor: 'text-yellow-400', icon: Smile, value: 'normal' },
        { label: 'Nice', color: 'bg-blue-500', iconColor: 'text-blue-500', icon: SmilePlus, value: 'nice' },
        { label: 'Good', color: 'bg-emerald-500', iconColor: 'text-emerald-500', icon: Laugh, value: 'good' },
    ];

    return (
        <div className="flex items-center gap-4" role="group" aria-label="Rating options">
            {ratings.map((rating) => {
                const Icon = rating.icon;
                const isSelected = value === rating.value;
                return (
                    <button
                        key={rating.value}
                        type="button"
                        onClick={() => onChange(rating.value)}
                        aria-label={`Rate as ${rating.label}`}
                        aria-pressed={isSelected}
                        className={`flex items-center gap-2 transition-all duration-300 ${isSelected
                            ? `${rating.color} text-white px-4 py-3 rounded-xl shadow-sm`
                            : `bg-transparent p-2 hover:bg-gray-100 rounded-full`
                            }`}
                    >
                        <Icon className={`w-5 h-5 ${isSelected ? 'text-white' : rating.iconColor}`} aria-hidden="true" />
                        {isSelected && <span className="text-sm font-bold">{rating.label}</span>}
                    </button>
                );
            })}
        </div>
    );
};

export const CommentSkeleton = () => (
    <div className="space-y-8">
        {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-6 animate-pulse">
                <Skeleton className="w-12 h-12 rounded-full flex-shrink-0" />
                <div className="flex-1 space-y-3">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <Skeleton className="h-5 w-32" />
                            <Skeleton className="h-4 w-20" />
                        </div>
                        <Skeleton className="h-3 w-24" />
                    </div>
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                </div>
            </div>
        ))}
    </div>
);

interface CommentsSectionProps {
    slug: string;
}

export function CommentsSection({ slug }: CommentsSectionProps) {
    const { data: comments = [], isLoading: isCommentsLoading } = useGetCommentsQuery(slug);
    const [addComment, { isLoading: isSubmitting }] = useAddCommentMutation();
    const [rating, setRating] = useState('good');

    const formik = useFormik({
        initialValues: {
            name: '',
            email: '',
            content: '',
        },
        validationSchema: Yup.object({
            name: Yup.string().required('Name is required'),
            email: Yup.string().email('Invalid email address').required('Email is required'),
            content: Yup.string().min(10, 'Content must be at least 10 characters').required('Content is required'),
        }),
        onSubmit: async (values) => {
            try {
                // Map rating string to number
                const ratingMap: Record<string, number> = {
                    'bad': 1,
                    'average': 2,
                    'normal': 3,
                    'nice': 4,
                    'good': 5
                };

                await toast.promise(
                    addComment({
                        ...values,
                        rating: ratingMap[rating] || 5,
                        blogSlug: slug,
                        author: values.name
                    }).unwrap(),
                    {
                        loading: 'Posting your thought...',
                        success: 'Content added successfully! 🎉',
                        error: 'Could not add content. Please try again. 😢',
                    }
                );

                formik.resetForm();
                setRating('good');
            } catch (err) {
                console.error('Failed to submit content:', err);
            }
        },
    });

    return (
        <>
            {/* Comments Section */}
            <div className="mt-20 mb-16 animate-slide-up delay-300">
                <h2 className="text-xl font-bold mb-8 flex items-center gap-3">
                    <span className="w-1 h-5 bg-black rounded-full"></span>
                    Comments ({isCommentsLoading ? '...' : comments.length})
                </h2>

                {isCommentsLoading ? (
                    <CommentSkeleton />
                ) : (
                    <div className="space-y-8">
                        {comments.length === 0 ? (
                            <p className="text-gray-500 italic">No comments yet. Be the first to share your thoughts!</p>
                        ) : (
                            comments.map((comment: any, index: number) => (
                                <div key={comment._id || comment.id} className={`flex gap-6 ${index !== comments.length - 1 ? 'border-b border-gray-100 pb-8' : ''}`}>
                                    <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                                        <Image src={comment.avatar} alt={comment.author} fill className="object-cover" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex flex-wrap items-center justify-between mb-2">
                                            <div className="flex items-center gap-3">
                                                <span className="font-bold text-base text-gray-900">{comment.author}</span>
                                                <div className="flex items-center gap-2">
                                                    <div className="flex text-yellow-400 gap-0.5">
                                                        {[...Array(5)].map((_, i) => (
                                                            <Star key={i} className={`w-3.5 h-3.5 ${i < comment.rating ? 'fill-current' : 'text-gray-200 fill-gray-200'}`} />
                                                        ))}
                                                    </div>
                                                    <span className="text-xs text-gray-500 font-medium">({comment.rating}.0)</span>
                                                </div>
                                            </div>
                                            <span className="text-xs text-gray-500 font-medium">{comment.date}</span>
                                        </div>
                                        <p className="text-sm text-gray-600 leading-relaxed font-medium">
                                            {comment.content}
                                        </p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>

            {/* Add Comment Form */}
            <div className="mb-20 animate-slide-up delay-500">
                <h2 className="text-xl font-bold mb-8 text-gray-900 flex items-center gap-3">
                    <span className="w-1 h-5 bg-black rounded-full"></span>
                    Add Content
                </h2>
                <form onSubmit={formik.handleSubmit} className="space-y-6">
                    <div className="flex flex-col md:flex-row gap-8">
                        {/* Left Column: Name & Email */}
                        <div className="flex-1 space-y-6">
                            <div>
                                <label htmlFor="name-input" className="block text-sm font-bold text-gray-600 mb-3">Name</label>
                                <input
                                    id="name-input"
                                    name="name"
                                    type="text"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.name}
                                    className="w-full bg-[#F5F5F5] border-none rounded-xl px-6 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-gray-200 transition-all placeholder:text-gray-400"
                                    placeholder=""
                                />
                                {formik.touched.name && formik.errors.name && (
                                    <p className="text-red-500 text-xs mt-1 pl-2">{formik.errors.name}</p>
                                )}
                            </div>
                            <div>
                                <label htmlFor="email-input" className="block text-sm font-bold text-gray-600 mb-3">Email</label>
                                <input
                                    id="email-input"
                                    name="email"
                                    type="email"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.email}
                                    className="w-full bg-[#F5F5F5] border-none rounded-xl px-6 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-gray-200 transition-all placeholder:text-gray-400"
                                    placeholder=""
                                />
                                {formik.touched.email && formik.errors.email && (
                                    <p className="text-red-500 text-xs mt-1 pl-2">{formik.errors.email}</p>
                                )}
                            </div>
                        </div>

                        {/* Right Column: Comment */}
                        <div className="flex-1 flex flex-col">
                            <label htmlFor="content-input" className="block text-sm font-bold text-gray-600 mb-3">Content</label>
                            <textarea
                                id="content-input"
                                name="content"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.content}
                                className="w-full flex-1 bg-[#F5F5F5] border-none rounded-xl px-6 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-gray-200 transition-all resize-none placeholder:text-gray-400 min-h-[180px]"
                                placeholder="Search Anything..."
                            />
                            {formik.touched.content && formik.errors.content && (
                                <p className="text-red-500 text-xs mt-1 pl-2">{formik.errors.content}</p>
                            )}
                        </div>
                    </div>

                    {/* Bottom Bar: Rating & Send Button */}
                    <div className="flex flex-col md:flex-row items-center gap-4 pt-2">
                        {/* Rating Bar */}
                        <div className="flex-1 w-full bg-[#F5F5F5] rounded-xl px-6 py-3 flex flex-col sm:flex-row items-center justify-between gap-4">
                            <span id="rating-label" className="text-sm font-bold text-gray-700">Rate The Usefulness Of The Article</span>
                            <RatingSelector value={rating} onChange={setRating} />
                        </div>

                        {/* Send Button */}
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="cursor-pointer bg-black hover:bg-gray-800 text-white px-10 py-4 rounded-xl text-sm font-bold transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 min-w-[140px] w-full md:w-auto"
                        >
                            {isSubmitting ? (
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                <>
                                    <span role="img" aria-label="comment icon" className="text-[18px]">💬</span>
                                    <span>Send</span>
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}
