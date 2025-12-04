'use client';

import { useState, useRef, useEffect, use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Star, MapPin, ChevronLeft, ArrowRight, Frown, Meh, Smile, SmilePlus, Laugh, Clock, User, ChevronRight, Loader2 } from 'lucide-react';
import { notFound } from 'next/navigation';
import { useGetBlogBySlugQuery, useGetBlogsQuery, useGetTourGuidesQuery, useGetCommentsQuery, useAddCommentMutation } from '@/lib/features/api/apiSlice';
import { Skeleton } from '@/components/ui/Skeleton';
import toast from 'react-hot-toast';
import { BlogDetailSkeleton } from '@/components/BlogDetailSkeleton';

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
        <div className="flex items-center gap-4">
            {ratings.map((rating) => {
                const Icon = rating.icon;
                const isSelected = value === rating.value;
                return (
                    <button
                        key={rating.value}
                        type="button"
                        onClick={() => onChange(rating.value)}
                        className={`flex items-center gap-2 transition-all duration-300 ${isSelected
                            ? `${rating.color} text-white px-4 py-3 rounded-xl shadow-sm`
                            : `bg-transparent p-2 hover:bg-gray-100 rounded-full`
                            }`}
                    >
                        <Icon className={`w-5 h-5 ${isSelected ? 'text-white' : rating.iconColor}`} />
                        {isSelected && <span className="text-sm font-bold">{rating.label}</span>}
                    </button>
                );
            })}
        </div>
    );
};

const AuthorSlider = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const authors = [
        {
            name: "Alex Carter",
            role: "Fitness Expert",
            avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
            bio: "With over a decade of experience in the fitness industry, Alex specializes in strength training and functional fitness. Certified by NASM and known for his motivational style, Alex designs workout programs that are both challenging and achievable."
        },
        {
            name: "Sarah Jenkins",
            role: "Travel Writer",
            avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
            bio: "Sarah has visited over 50 countries, documenting her journey through vibrant photography and immersive storytelling. She believes in sustainable travel and finding the hidden gems that aren't in the guidebooks."
        },
        {
            name: "Marcus Chen",
            role: "Culinary Guide",
            avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
            bio: "A chef turned food critic, Marcus explores the world one bite at a time. From street food stalls in Bangkok to Michelin-starred restaurants in Paris, he brings the flavors of the world to your screen."
        },
        {
            name: "Elena Rodriguez",
            role: "Wellness Coach",
            avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop",
            bio: "Elena combines modern psychology with ancient mindfulness practices. Her workshops and articles help people find balance in a chaotic world, focusing on mental clarity and emotional resilience."
        },
        {
            name: "David Smith",
            role: "Adventure Photographer",
            avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop",
            bio: "David's passion is capturing the raw beauty of nature. Whether he's scaling a mountain or diving into the deep blue, his lens reveals the breathtaking landscapes that remind us of the planet's wonder."
        }
    ];

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % authors.length);
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev - 1 + authors.length) % authors.length);
    };

    useEffect(() => {
        if (!isPaused) {
            timeoutRef.current = setInterval(nextSlide, 5000);
        }
        return () => {
            if (timeoutRef.current) clearInterval(timeoutRef.current);
        };
    }, [isPaused]);

    const currentAuthor = authors[currentIndex];

    return (
        <div
            className="border-t border-gray-200 pt-12 mt-12 mb-12 flex flex-col items-center text-center relative group"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            <h3 className="text-xl font-medium text-gray-900 mb-2">About {currentAuthor.name}</h3>
            <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-6">{currentAuthor.role}</p>

            <div className="relative w-full max-w-2xl mx-auto flex items-center justify-center">
                {/* Previous Button */}
                <button
                    onClick={prevSlide}
                    className="absolute left-0 md:-left-12 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white border border-gray-200 text-gray-400 hover:text-gray-900 hover:border-gray-900 transition-all opacity-0 group-hover:opacity-100 z-10"
                    aria-label="Previous Author"
                >
                    <ChevronLeft className="w-5 h-5" />
                </button>

                {/* Content */}
                <div className="flex flex-col items-center animate-slide-in-right key={currentIndex}">
                    <div className="relative w-24 h-24 rounded-full overflow-hidden mb-6 ring-4 ring-gray-50 shadow-sm">
                        <Image src={currentAuthor.avatar} alt={currentAuthor.name} fill className="object-cover" />
                    </div>
                    <p className="text-gray-600 italic leading-relaxed max-w-xl px-4">
                        {currentAuthor.bio}
                    </p>
                </div>

                {/* Next Button */}
                <button
                    onClick={nextSlide}
                    className="absolute right-0 md:-right-12 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white border border-gray-200 text-gray-400 hover:text-gray-900 hover:border-gray-900 transition-all opacity-0 group-hover:opacity-100 z-10"
                    aria-label="Next Author"
                >
                    <ChevronRight className="w-5 h-5" />
                </button>
            </div>

            {/* Dots Indicator */}
            <div className="flex items-center gap-2 mt-8">
                {authors.map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => setCurrentIndex(idx)}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${idx === currentIndex ? 'bg-gray-900 w-4' : 'bg-gray-300 hover:bg-gray-400'
                            }`}
                        aria-label={`Go to slide ${idx + 1}`}
                    />
                ))}
            </div>
        </div>
    );
};

const CommentSkeleton = () => (
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

interface PageProps {
    params: Promise<{ slug: string }>;
}

export default function BlogPost({ params }: PageProps) {
    const resolvedParams = use(params);
    const { slug } = resolvedParams;

    const { data: blog, isLoading: isBlogLoading } = useGetBlogBySlugQuery(slug);
    const { data: allBlogs = [] } = useGetBlogsQuery(undefined);
    const { data: tourGuides = [] } = useGetTourGuidesQuery(undefined);
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

    if (isBlogLoading) {
        return <BlogDetailSkeleton />;
    }

    if (!blog) {
        notFound();
    }

    // Derived data
    const currentIndex = allBlogs.findIndex((b: any) => b.slug === slug);
    const prevBlog = allBlogs.length > 0 ? allBlogs[(currentIndex - 1 + allBlogs.length) % allBlogs.length] : null;
    const nextBlog = allBlogs.length > 0 ? allBlogs[(currentIndex + 1) % allBlogs.length] : null;

    const relatedBlogs = allBlogs.filter((b: any) => b.slug !== slug).slice(0, 4);
    const exploreMore = allBlogs.filter((b: any) => b.slug !== slug).slice(0, 3);

    return (
        <div className="bg-white text-gray-900 font-sans min-h-screen animate-fade-in">
            {/* Breadcrumb & Title */}
            <div className="container mx-auto px-4 py-8 md:py-12 md:px-6 text-center max-w-4xl animate-slide-up">
                <div className="inline-flex items-center gap-2 text-xs text-gray-400 uppercase tracking-widest mb-4 font-medium bg-gray-50 px-4 py-2 rounded-full">
                    <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
                    <span>/</span>
                    <span>Blog</span>
                    <span>/</span>
                    <span className="text-blue-600">{blog.category}</span>
                </div>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-gray-900 leading-tight">
                    {blog.title}
                </h1>
                <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1.5">
                        <User className="w-4 h-4" />
                        <span>{blog.author.name}</span>
                    </div>
                    <span>•</span>
                    <span>{blog.date}</span>
                    <span>•</span>
                    <div className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4" />
                        <span>{blog.readTime}</span>
                    </div>
                </div>
            </div>

            {/* Hero Image */}
            <div className="w-full h-[300px] md:h-[500px] lg:h-[600px] relative mb-12 md:mb-20 animate-scale-in delay-100">
                <Image
                    src={blog.heroImage}
                    alt={blog.title}
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>

            <div className="container mx-auto px-4 md:px-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
                    {/* Main Content Column */}
                    <div className="lg:col-span-8 animate-slide-up delay-200">
                        {/* Article Header Meta */}
                        <div className="flex items-center justify-between py-6 border-b border-gray-200 mb-8">
                            <div className="flex items-center gap-3">
                                <div className="relative w-8 h-8 rounded-full overflow-hidden">
                                    <Image src={blog.author.avatar} alt={blog.author.name} fill className="object-cover" />
                                </div>
                                <span className="text-sm font-bold text-gray-600 uppercase tracking-wider">{blog.author.name}</span>
                            </div>
                            <span className="text-sm font-bold text-gray-400 uppercase tracking-wider">{blog.date}</span>
                        </div>

                        {/* Article Body */}
                        <div className="prose prose-lg max-w-none text-gray-800 mb-12">
                            <p className="font-medium text-lg mb-8 leading-relaxed">
                                {blog.excerpt}
                            </p>

                            {blog.content.slice(0, 2).map((paragraph: string, index: number) => (
                                <p key={index} className="mb-6 text-base leading-relaxed">
                                    {paragraph}
                                </p>
                            ))}

                            {/* Styled Quote Section */}
                            <div className="py-8 my-10 border-y border-gray-200">
                                <p className="italic text-gray-900 font-semibold text-lg leading-relaxed text-center px-8">
                                    "{blog.quote}"
                                </p>
                            </div>

                            {blog.content.slice(2).map((paragraph: string, index: number) => (
                                <p key={index} className="mb-6 text-base leading-relaxed">
                                    {paragraph}
                                </p>
                            ))}
                        </div>

                        {/* Author Bio Slider Section */}
                        <AuthorSlider />

                        {/* Navigation Buttons */}
                        {prevBlog && nextBlog && (
                            <div className="border-t border-gray-200 pt-8 mb-12 flex flex-col sm:flex-row justify-between items-start gap-6">
                                <Link href={`/blog/${prevBlog.slug}`} className="w-full sm:w-[45%] group cursor-pointer">
                                    <div className="flex flex-col items-start gap-3">
                                        <button className="flex items-center gap-2 px-6 py-2 border border-gray-900 rounded-sm hover:bg-gray-900 hover:text-white transition-all duration-300">
                                            <ChevronLeft className="w-4 h-4" />
                                            <span className="font-medium">Previous</span>
                                        </button>
                                        <span className="text-sm text-gray-500 line-clamp-1 group-hover:text-blue-600 transition-colors">{prevBlog.title}</span>
                                    </div>
                                </Link>

                                <Link href={`/blog/${nextBlog.slug}`} className="w-full sm:w-[45%] group cursor-pointer">
                                    <div className="flex flex-col items-end gap-3">
                                        <button className="flex items-center gap-2 px-6 py-2 border border-gray-900 rounded-sm hover:bg-gray-900 hover:text-white transition-all duration-300">
                                            <span className="font-medium">Next</span>
                                            <ArrowRight className="w-4 h-4" />
                                        </button>
                                        <span className="text-sm text-gray-500 line-clamp-1 text-right group-hover:text-blue-600 transition-colors">{nextBlog.title}</span>
                                    </div>
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Sidebar Column */}
                    <div className="lg:col-span-4 space-y-16 animate-slide-up delay-300">
                        {/* Explore More */}
                        <div>
                            <h3 className="text-xl font-bold mb-8 text-gray-900">Explore more</h3>
                            <div className="space-y-10">
                                {exploreMore.map((item: any) => (
                                    <Link key={item._id || item.id} href={`/blog/${item.slug}`}>
                                        <div className="group cursor-pointer mb-6">
                                            <div className="relative w-full h-48 rounded-sm overflow-hidden mb-4">
                                                <Image src={item.heroImage} alt={item.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700" />
                                            </div>
                                            <div className="flex items-center gap-3 text-xs text-gray-500 mb-2">
                                                <span className="font-bold text-gray-900">{item.category}</span>
                                                <span className="w-px h-3 bg-gray-300"></span>
                                                <span>{item.date}</span>
                                            </div>
                                            <h4 className="text-base font-medium leading-snug text-gray-900 group-hover:text-blue-600 transition-colors">
                                                {item.title}
                                            </h4>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Tour Guides */}
                        <div>
                            <h3 className="text-xl font-bold mb-8 text-gray-900">Tour Guides</h3>
                            <div className="space-y-6">
                                {tourGuides.map((guide: any, index: number) => (
                                    <div key={guide._id || guide.id} className={`group cursor-pointer ${index !== tourGuides.length - 1 ? 'border-b border-gray-100 pb-6' : ''}`}>
                                        <div className="flex gap-4 items-start mb-3">
                                            <div className="relative w-14 h-14 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-transparent group-hover:ring-blue-100 transition-all">
                                                <Image src={guide.avatar} alt={guide.name} fill className="object-cover" />
                                            </div>
                                            <div className="flex-1 min-w-0 pt-1">
                                                <h4 className="text-sm font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">{guide.name}</h4>
                                                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                                                    <MapPin className="w-3 h-3 flex-shrink-0" />
                                                    <span className="truncate">{guide.location}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Rating Section */}
                                        <div className="flex items-center gap-2 pl-[72px]">
                                            <div className="flex text-yellow-400 gap-0.5">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star key={i} className={`w-3 h-3 ${i < Math.floor(guide.rating) ? 'fill-current' : 'text-gray-200 fill-gray-200'}`} />
                                                ))}
                                            </div>
                                            <span className="text-xs text-gray-500">({guide.rating})</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Comments Section */}
                <div className="mt-20 mb-16 animate-slide-up delay-300">
                    <h3 className="text-xl font-bold mb-8 flex items-center gap-3">
                        <span className="w-1 h-5 bg-black rounded-full"></span>
                        Comments ({isCommentsLoading ? '...' : comments.length})
                    </h3>

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
                                                <span className="text-xs text-gray-400 font-medium">{comment.date}</span>
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
                    <h3 className="text-xl font-bold mb-8 text-gray-900 flex items-center gap-3">
                        <span className="w-1 h-5 bg-black rounded-full"></span>
                        Add Content
                    </h3>
                    <form onSubmit={formik.handleSubmit} className="space-y-6">
                        <div className="flex flex-col md:flex-row gap-8">
                            {/* Left Column: Name & Email */}
                            <div className="flex-1 space-y-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-600 mb-3">Name</label>
                                    <input
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
                                    <label className="block text-sm font-bold text-gray-600 mb-3">Email</label>
                                    <input
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
                                <label className="block text-sm font-bold text-gray-600 mb-3">Content</label>
                                <textarea
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
                                <span className="text-sm font-bold text-gray-700">Rate The Usefulness Of The Article</span>
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
                                        <div className="w-4 h-4 flex items-center justify-center text-[18px]">💬</div>
                                        <span>Send</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>

            </div>

            {/* Related Articles */}
            {relatedBlogs.length > 0 && (
                <div className="bg-[#F5F5F6] py-16 md:py-20 animate-slide-up delay-500 w-full">
                    <div className="container mx-auto px-4 md:px-6">
                        <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-12 text-center" style={{ fontFamily: 'Lato, sans-serif', letterSpacing: '1px' }}>
                            Related articles
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
                            {relatedBlogs.map((article: any) => (
                                <Link key={article._id || article.id} href={`/blog/${article.slug}`}>
                                    <div className="overflow-hidden group cursor-pointer h-full flex flex-col hover:-translate-y-1 transition-transform duration-300">
                                        {/* Image */}
                                        <div className="relative h-48 w-full overflow-hidden bg-gray-200">
                                            <Image
                                                src={article.heroImage}
                                                alt={article.title}
                                                fill
                                                className="object-cover"
                                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                                            />
                                        </div>

                                        {/* Content */}
                                        <div className="p-4 flex-1 flex flex-col">
                                            {/* Title */}
                                            <h3 className="font-semibold text-base mb-3 leading-snug text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors" style={{ fontFamily: 'Lato, sans-serif', letterSpacing: '1px' }}>
                                                {article.title}
                                            </h3>

                                            {/* Excerpt */}
                                            <p className="text-sm text-gray-600 mb-4 line-clamp-3 leading-relaxed flex-1" style={{ fontFamily: 'Lato, sans-serif', letterSpacing: '1px' }}>
                                                {article.excerpt}
                                            </p>

                                            {/* Author */}
                                            <div className="flex items-center gap-1 text-sm text-gray-900" style={{ fontFamily: 'Lato, sans-serif', letterSpacing: '1px' }}>
                                                <span className="font-medium">By</span>
                                                <span className="font-medium">{article.author.name}</span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
