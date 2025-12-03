'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Clock, ArrowRight, MapPin } from 'lucide-react';
import blogsData from '@/data/blogs.json';

export default function Home() {
  const { blogs } = blogsData;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white overflow-hidden">
      {/* Hero Section */}
      <section className="relative bg-black text-white py-32 md:py-40 overflow-hidden animate-fade-in">
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight animate-slide-up tracking-tight">
              Explore the World.
              <span className="block text-gray-500 mt-2">One Story at a Time.</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-400 mb-10 leading-relaxed max-w-2xl mx-auto animate-slide-up delay-100 font-light">
              Discover inspiring travel stories, expert guides, and hidden gems from around the globe.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500 animate-slide-up delay-200">
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
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">Latest Adventures</h2>
            <p className="text-gray-600">Fresh stories from travelers around the world</p>
          </div>
          <div className="self-start md:self-auto flex items-center gap-2 text-sm font-medium text-gray-500 bg-gray-100 px-4 py-2 rounded-full">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            {blogs.length} Articles
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 lg:gap-12">
          {blogs.map((blog, index) => (
            <Link
              key={blog.id}
              href={`/blog/${blog.slug}`}
              className="group block h-full animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <article className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 h-full flex flex-col border border-gray-100">
                {/* Blog Image */}
                <div className="relative h-72 md:h-80 w-full overflow-hidden bg-gray-200">
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
                    <span className="inline-flex items-center gap-1.5 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full text-xs font-bold text-indigo-600 uppercase tracking-wide shadow-lg group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
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
                  <div className="flex items-center gap-4 mb-4 text-xs text-gray-500">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{blog.readTime}</span>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 leading-tight group-hover:text-indigo-600 transition-colors line-clamp-2">
                    {blog.title}
                  </h3>

                  {/* Excerpt */}
                  <p className="text-gray-600 text-base leading-relaxed mb-6 line-clamp-3 flex-1">
                    {blog.excerpt}
                  </p>

                  {/* CTA */}
                  <div className="pt-4 mt-auto">
                    <div className="w-full bg-black hover:bg-gray-800 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 group-hover:-translate-y-0.5">
                      <span>Read Story</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
