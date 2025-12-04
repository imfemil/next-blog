'use client';

import { useState } from 'react';
import { X, Save } from 'lucide-react';

interface BlogEditorProps {
    blog: any;
    onClose: () => void;
    onSave: (updatedBlog: any) => void;
    isSaving?: boolean;
}

export default function BlogEditor({ blog, onClose, onSave, isSaving = false }: BlogEditorProps) {
    const [title, setTitle] = useState(blog.title);
    // Handle content whether it's an array (from our seed data) or string
    const initialContent = Array.isArray(blog.content) ? blog.content.join('\n\n') : blog.content;
    const [content, setContent] = useState(initialContent);

    const handleSave = () => {
        // Split by double newline to maintain paragraph structure if the original was an array
        const contentArray = content.split(/\n\s*\n/);
        onSave({ ...blog, title, content: contentArray });
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in"
            role="dialog"
            aria-modal="true"
            aria-labelledby="editor-title"
        >
            <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col animate-scale-in">
                {/* Header */}
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white z-10">
                    <div>
                        <h2 id="editor-title" className="text-2xl font-bold text-gray-900">Edit Story</h2>
                        <p className="text-sm text-gray-500">Make changes to your blog post</p>
                    </div>
                    <button
                        onClick={onClose}
                        disabled={isSaving}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500 hover:text-gray-900 disabled:opacity-50"
                        aria-label="Close editor"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Scrollable Content */}
                <div className="p-6 space-y-6 overflow-y-auto flex-1 bg-gray-50/50">
                    <div className="space-y-2">
                        <label htmlFor="blog-title" className="block text-sm font-bold text-gray-700">Title</label>
                        <input
                            id="blog-title"
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            disabled={isSaving}
                            className="w-full px-5 py-4 rounded-xl border border-gray-200 bg-white focus:border-black focus:ring-1 focus:ring-black outline-none transition-all font-bold text-xl shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
                            placeholder="Enter story title..."
                        />
                    </div>

                    <div className="space-y-2 flex-1 flex flex-col h-full">
                        <div className="flex justify-between items-center">
                            <label htmlFor="blog-content" className="block text-sm font-bold text-gray-700">Content (Markdown)</label>
                            <span className="text-xs font-medium text-gray-400 bg-gray-100 px-2 py-1 rounded">Markdown Supported</span>
                        </div>
                        <textarea
                            id="blog-content"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            disabled={isSaving}
                            className="w-full min-h-[400px] px-5 py-4 rounded-xl border border-gray-200 bg-white focus:border-black focus:ring-1 focus:ring-black outline-none transition-all font-mono text-sm leading-relaxed resize-y shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
                            placeholder="Write your story here..."
                        />
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-100 flex justify-end gap-3 bg-white">
                    <button
                        onClick={onClose}
                        disabled={isSaving}
                        className="px-6 py-3 rounded-xl font-bold text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="px-8 py-3 rounded-xl font-bold text-white bg-black hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isSaving ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save className="w-4 h-4" />
                                Save Changes
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
