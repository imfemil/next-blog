import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { IBlog, IComment, ITourGuide } from '@/types';

export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
    tagTypes: ['Blog', 'Comment', 'TourGuide'],
    endpoints: (builder) => ({
        getBlogs: builder.query<IBlog[], void>({
            query: () => '/blogs',
            providesTags: ['Blog'],
        }),
        getBlogBySlug: builder.query<IBlog, string>({
            query: (slug) => `/blogs/${slug}`,
            providesTags: (result, error, slug) => [{ type: 'Blog', id: slug }],
        }),
        getTourGuides: builder.query<ITourGuide[], void>({
            query: () => '/tour-guides',
            providesTags: ['TourGuide'],
        }),
        getComments: builder.query<IComment[], string>({
            query: (blogSlug) => `/comments?blogSlug=${blogSlug}`,
            providesTags: (result, error, blogSlug) => [{ type: 'Comment', id: blogSlug }],
        }),
        addComment: builder.mutation<IComment, Partial<IComment>>({
            query: (comment) => ({
                url: '/comments',
                method: 'POST',
                body: comment,
            }),
            invalidatesTags: (result, error, { blogSlug }) => [{ type: 'Comment', id: blogSlug! }],
        }),
        updateBlog: builder.mutation<IBlog, Partial<IBlog> & { slug: string }>({
            query: ({ slug, ...patch }) => ({
                url: `/blogs/${slug}`,
                method: 'PUT',
                body: patch,
            }),
            invalidatesTags: (result, error, { slug }) => [
                { type: 'Blog', id: slug },
                'Blog'
            ],
        }),
    }),
});

export const {
    useGetBlogsQuery,
    useGetBlogBySlugQuery,
    useGetTourGuidesQuery,
    useGetCommentsQuery,
    useAddCommentMutation,
    useUpdateBlogMutation,
} = apiSlice;
