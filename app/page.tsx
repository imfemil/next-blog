'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { Clock, ArrowRight, MapPin, Edit2, Loader2 } from 'lucide-react';
import { useGetBlogsQuery, useUpdateBlogMutation } from '@/lib/features/api/apiSlice';
import toast from 'react-hot-toast';

import { IBlog } from '@/types';

// Dynamically load the BlogEditor component
const BlogEditor = dynamic(() => import('@/components/BlogEditor'), {
  loading: () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white p-8 rounded-2xl shadow-xl flex flex-col items-center gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-black" />
        <p className="font-bold text-foreground">Loading Editor...</p>
      </div>
    </div>
  ),
  ssr: false // Editor is client-side only
});

export default function Home() {
  const { data: blogs = [], isLoading, error } = useGetBlogsQuery(undefined);
  const [updateBlog, { isLoading: isUpdating }] = useUpdateBlogMutation();
  const [editingBlog, setEditingBlog] = useState<IBlog | null>(null);

  const handleEditClick = (e: React.MouseEvent, blog: IBlog) => {
    e.preventDefault(); // Prevent navigation
    e.stopPropagation(); // Stop event bubbling
    setEditingBlog(blog);
  };

  const handleSaveBlog = async (updatedBlog: Partial<IBlog>) => {
    if (!updatedBlog.slug) return;

    try {
      await updateBlog({
        slug: updatedBlog.slug,
        title: updatedBlog.title,
        content: updatedBlog.content
      }).unwrap();

      toast.success('Story updated successfully! 🚀');
      setEditingBlog(null);
    } catch (err) {
      console.error('Failed to update blog:', err);
      toast.error('Failed to update story. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="w-10 h-10 animate-spin text-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white text-red-500">
        Failed to load blogs. Please try again later.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Hero Section */}
      <section className="relative bg-foreground text-background py-32 md:py-40 overflow-hidden animate-fade-in">
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight animate-slide-up tracking-tight">
              Explore the World.
              <span className="block text-muted-foreground mt-2">One Story at a Time.</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-10 leading-relaxed max-w-2xl mx-auto animate-slide-up delay-100 font-light">
              Discover inspiring travel stories, expert guides, and hidden gems from around the globe.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground animate-slide-up delay-200">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>50+ Destinations</span>
              </div>
              <span className="hidden sm:inline opacity-30">•</span>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>Updated Weekly</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Grid Section */}
      <section className="container mx-auto px-4 md:px-6 py-16 md:py-24">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6 animate-slide-up delay-300">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-2">Latest Adventures</h2>
            <p className="text-muted-foreground">Fresh stories from travelers around the world</p>
          </div>
          <div className="self-start md:self-auto flex items-center gap-2 text-sm font-medium text-muted-foreground bg-muted px-4 py-2 rounded-full">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            {blogs.length} Articles
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 lg:gap-12">
          {blogs.map((blog: IBlog, index: number) => (
            <div
              key={blog._id}
              className="group block h-full animate-slide-up relative"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <Link
                href={`/blog/${blog.slug}`}
                className="block h-full"
                aria-label={`Read full story: ${blog.title}`}
              >
                <article className="bg-card rounded-2xl overflow-hidden shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 h-full flex flex-col border border-border">
                  {/* Blog Image */}
                  <div className="relative h-72 md:h-80 w-full overflow-hidden bg-muted">
                    <Image
                      src={blog.heroImage}
                      alt={blog.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      priority={index < 2}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500"></div>

                    {/* Category Badge */}
                    <div className="absolute top-4 left-4">
                      <span className="inline-flex items-center gap-1.5 bg-background/95 backdrop-blur-sm px-4 py-2 rounded-full text-xs font-bold text-primary uppercase tracking-wide shadow-lg group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                        <MapPin className="w-3.5 h-3.5" />
                        {blog.category}
                      </span>
                    </div>

                    {/* Author Badge */}
                    <div className="absolute bottom-4 left-4 flex items-center gap-3">
                      <div className="relative w-10 h-10 rounded-full overflow-hidden ring-2 ring-white shadow-lg">
                        <Image
                          src={blog.author.avatar}
                          alt={blog.author.name}
                          fill
                          className="object-cover"
                          sizes="40px"
                        />
                      </div>
                      <div className="text-white">
                        <p className="text-sm font-bold drop-shadow-lg">{blog.author.name}</p>
                        <p className="text-xs text-white/90">{blog.date}</p>
                      </div>
                    </div>
                  </div>

                  {/* Blog Content */}
                  <div className="p-6 md:p-8 flex-1 flex flex-col">
                    {/* Meta Info */}
                    <div className="flex items-center gap-4 mb-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{blog.readTime}</span>
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-2xl font-bold text-foreground mb-4 leading-tight group-hover:text-primary transition-colors line-clamp-2">
                      {blog.title}
                    </h3>

                    {/* Excerpt */}
                    <p className="text-muted-foreground text-base leading-relaxed mb-6 line-clamp-3 flex-1">
                      {blog.excerpt}
                    </p>

                    {/* CTA */}
                    <div className="pt-4 mt-auto">
                      <div className="w-full bg-foreground hover:bg-foreground/90 text-background px-6 py-3 rounded-xl font-bold transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 group-hover:-translate-y-0.5">
                        <span aria-hidden="true">Read Story</span>
                        <ArrowRight className="w-4 h-4" aria-hidden="true" />
                      </div>
                    </div>
                  </div>
                </article>
              </Link>

              {/* Edit Button - Positioned absolutely on top of the card */}
              <button
                onClick={(e) => handleEditClick(e, blog)}
                className="absolute top-4 right-4 z-20 bg-white/90 backdrop-blur-md p-2.5 rounded-full shadow-lg hover:bg-black hover:text-white transition-all duration-300 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0"
                title="Edit Story"
                aria-label={`Edit story: ${blog.title}`}
              >
                <Edit2 className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Dynamic Editor Modal */}
      {editingBlog && (
        <BlogEditor
          blog={editingBlog}
          onClose={() => setEditingBlog(null)}
          onSave={handleSaveBlog}
          isSaving={isUpdating}
        />
      )}
    </div>
  );
}
