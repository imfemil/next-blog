import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { Star, MapPin, ChevronLeft, ArrowRight, User, Clock } from 'lucide-react';
import { CommentSkeleton } from '@/components/CommentsSection';

const AuthorSlider = dynamic(() => import('@/components/AuthorSlider/AuthorSlider').then(mod => mod.AuthorSlider), {
    loading: () => <div className="w-full h-80 bg-gray-100 animate-pulse rounded-xl my-12" />
});

const CommentsSection = dynamic(() => import('@/components/CommentsSection').then(mod => mod.CommentsSection), {
    loading: () => <div className="mt-20"><CommentSkeleton /></div>
});
import styles from './blog.module.css';
import dbConnect from '@/lib/mongodb';
import Blog from '@/models/Blog';
import TourGuide from '@/models/TourGuide';

import { IBlog, ITourGuide } from '@/types';

export async function generateStaticParams() {
    await dbConnect();
    const blogs = await Blog.find({}, { slug: 1 }).lean();

    return blogs.map((blog: any) => ({
        slug: blog.slug,
    }));
}

interface PageProps {
    params: Promise<{ slug: string }>;
}

async function getBlogData(slug: string): Promise<IBlog | null> {
    await dbConnect();
    const blog = await Blog.findOne({ slug }).lean();
    return blog as unknown as IBlog | null;
}

async function getAllBlogs(): Promise<IBlog[]> {
    await dbConnect();
    const blogs = await Blog.find({}).sort({ createdAt: -1 }).lean();
    return blogs as unknown as IBlog[];
}

async function getTourGuides(): Promise<ITourGuide[]> {
    await dbConnect();
    const guides = await TourGuide.find({}).lean();
    return guides as unknown as ITourGuide[];
}

export default async function BlogPost({ params }: PageProps) {
    const { slug } = await params;

    // Parallel data fetching
    const [blog, allBlogs, tourGuides] = await Promise.all([
        getBlogData(slug),
        getAllBlogs(),
        getTourGuides()
    ]);

    if (!blog) {
        notFound();
    }

    // Derived data
    const currentIndex = allBlogs.findIndex((b) => b.slug === slug);
    const prevBlog = allBlogs.length > 0 ? allBlogs[(currentIndex - 1 + allBlogs.length) % allBlogs.length] : null;
    const nextBlog = allBlogs.length > 0 ? allBlogs[(currentIndex + 1) % allBlogs.length] : null;

    const relatedBlogs = allBlogs.filter((b) => b.slug !== slug).slice(0, 4);
    const exploreMore = allBlogs.filter((b) => b.slug !== slug).slice(0, 3);

    return (
        <div className="bg-background text-foreground font-sans min-h-screen animate-fade-in">
            {/* Breadcrumb & Title */}
            <div className={styles.header}>
                <div className={styles.breadcrumb}>
                    <Link href="/" className={styles.breadcrumb__link}>Home</Link>
                    <span>/</span>
                    <span>Blog</span>
                    <span>/</span>
                    <span className={styles.breadcrumb__active}>{blog.category}</span>
                </div>
                <h1 className={styles.title}>
                    {blog.title}
                </h1>
                <div className={styles.meta}>
                    <div className={styles.meta__item}>
                        <User className="w-4 h-4" />
                        <span>{blog.author.name}</span>
                    </div>
                    <span>•</span>
                    <span>{blog.date}</span>
                    <span>•</span>
                    <div className={styles.meta__item}>
                        <Clock className="w-4 h-4" />
                        <span>{blog.readTime}</span>
                    </div>
                </div>
            </div>

            {/* Hero Image */}
            <div className={styles.hero}>
                <Image
                    src={blog.heroImage}
                    alt={blog.title}
                    fill
                    className="object-cover"
                    priority
                />
                <div className={styles.hero__overlay}></div>
            </div>

            <div className={styles.container}>
                <div className={styles.grid}>
                    {/* Main Content Column */}
                    <article className={styles['main-content']}>
                        {/* Article Header Meta */}
                        <div className={styles['article-header']}>
                            <div className={styles['author-profile']}>
                                <div className={styles['author-avatar']}>
                                    <Image src={blog.author.avatar} alt={blog.author.name} fill className="object-cover" />
                                </div>
                                <span className={styles['author-name']}>{blog.author.name}</span>
                            </div>
                            <span className={styles['article-date']}>{blog.date}</span>
                        </div>

                        {/* Article Body */}
                        <div className={styles.prose}>
                            <p className={styles.prose__lead}>
                                {blog.excerpt}
                            </p>

                            {blog.content.slice(0, 2).map((paragraph: string, index: number) => (
                                <p key={index}>
                                    {paragraph}
                                </p>
                            ))}

                            {/* Styled Quote Section */}
                            <div className={styles['quote-box']}>
                                <p className={styles.quote}>
                                    &quot;{blog.quote}&quot;
                                </p>
                            </div>

                            {blog.content.slice(2).map((paragraph: string, index: number) => (
                                <p key={index}>
                                    {paragraph}
                                </p>
                            ))}
                        </div>

                        {/* Author Bio Slider Section */}
                        <AuthorSlider />

                        {/* Navigation Buttons */}
                        {prevBlog && nextBlog && (
                            <nav className={styles['nav-buttons']} aria-label="Blog navigation">
                                <Link
                                    href={`/blog/${prevBlog.slug}`}
                                    className={styles['nav-item']}
                                    aria-label={`Previous article: ${prevBlog.title}`}
                                >
                                    <div className="flex flex-col items-start gap-3">
                                        <button className={styles['nav-btn']} tabIndex={-1}>
                                            <ChevronLeft className="w-4 h-4" />
                                            <span className="font-medium">Previous</span>
                                        </button>
                                        <span className="text-sm text-gray-500 line-clamp-1 hover:text-blue-600 transition-colors">{prevBlog.title}</span>
                                    </div>
                                </Link>

                                <Link
                                    href={`/blog/${nextBlog.slug}`}
                                    className={styles['nav-item']}
                                    aria-label={`Next article: ${nextBlog.title}`}
                                >
                                    <div className="flex flex-col items-end gap-3">
                                        <button className={styles['nav-btn']} tabIndex={-1}>
                                            <span className="font-medium">Next</span>
                                            <ArrowRight className="w-4 h-4" />
                                        </button>
                                        <span className="text-sm text-gray-500 line-clamp-1 text-right hover:text-blue-600 transition-colors">{nextBlog.title}</span>
                                    </div>
                                </Link>
                            </nav>
                        )}
                    </article>

                    {/* Sidebar Column */}
                    <div className={styles.sidebar}>
                        {/* Explore More */}
                        <div>
                            <h2 className={styles['widget-title']}>Explore more</h2>
                            <div className={styles['explore-list']}>
                                {exploreMore.map((item) => (
                                    <Link
                                        key={item._id}
                                        href={`/blog/${item.slug}`}
                                        aria-label={`Read article: ${item.title}`}
                                    >
                                        <div className={styles['explore-item']}>
                                            <div className={styles['explore-image']}>
                                                <Image src={item.heroImage} alt={item.title} fill className="object-cover hover:scale-105 transition-transform duration-700" />
                                            </div>
                                            <div className={styles['explore-meta']}>
                                                <span className="font-bold text-foreground">{item.category}</span>
                                                <span className="w-px h-3 bg-border"></span>
                                                <span>{item.date}</span>
                                            </div>
                                            <h4 className={styles['explore-title']}>
                                                {item.title}
                                            </h4>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Tour Guides */}
                        <div>
                            <h2 className={styles['widget-title']}>Tour Guides</h2>
                            <div className="space-y-6">
                                {tourGuides.map((guide, index) => (
                                    <div key={guide._id} className={`${index !== tourGuides.length - 1 ? 'border-b border-border pb-6' : ''}`}>
                                        <div className="flex gap-4 items-start mb-3">
                                            <div className="relative w-14 h-14 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-transparent transition-all">
                                                <Image src={guide.avatar} alt={guide.name} fill className="object-cover" />
                                            </div>
                                            <div className="flex-1 min-w-0 pt-1">
                                                <h4 className="font-medium text-foreground mb-1 transition-colors">{guide.name}</h4>
                                                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                                    <MapPin className="w-3 h-3 flex-shrink-0" aria-hidden="true" />
                                                    <span className="truncate">{guide.location}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Rating Section */}
                                        <div className="flex items-center gap-2">
                                            <div className="flex text-yellow-400 gap-0.5" aria-label={`Rating: ${guide.rating} out of 5 stars`}>
                                                {[...Array(5)].map((_, i) => (
                                                    <Star key={i} className={`w-5 h-5 ${i < Math.floor(guide.rating) ? 'fill-current' : 'text-muted fill-muted'}`} aria-hidden="true" />
                                                ))}
                                            </div>
                                            <span className="text-xs text-muted-foreground">({guide.rating})</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Comments Section - Client Component */}
                <CommentsSection slug={slug} />

            </div>

            {/* Related Articles */}
            {relatedBlogs.length > 0 && (
                <div className="bg-secondary py-16 md:py-20 animate-slide-up delay-500 w-full">
                    <div className="container mx-auto px-4 md:px-6">
                        <h2 className="text-3xl md:text-4xl font-semibold text-foreground mb-12 text-center" style={{ fontFamily: 'Lato, sans-serif', letterSpacing: '1px' }}>
                            Related articles
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
                            {relatedBlogs.map((article) => (
                                <Link key={article._id} href={`/blog/${article.slug}`}>
                                    <div className="overflow-hidden group cursor-pointer h-full flex flex-col hover:-translate-y-1 transition-transform duration-300">
                                        {/* Image */}
                                        <div className="relative h-48 w-full overflow-hidden bg-muted">
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
                                            <h3 className="font-semibold text-base mb-3 leading-snug text-foreground line-clamp-2 group-hover:text-blue-600 transition-colors" style={{ fontFamily: 'Lato, sans-serif', letterSpacing: '1px' }}>
                                                {article.title}
                                            </h3>

                                            {/* Excerpt */}
                                            <p className="text-sm text-muted-foreground mb-4 line-clamp-3 leading-relaxed flex-1" style={{ fontFamily: 'Lato, sans-serif', letterSpacing: '1px' }}>
                                                {article.excerpt}
                                            </p>

                                            {/* Author */}
                                            <div className="flex items-center gap-1 text-sm text-foreground" style={{ fontFamily: 'Lato, sans-serif', letterSpacing: '1px' }}>
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
