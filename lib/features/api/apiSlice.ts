import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
    tagTypes: ['Blog', 'Comment', 'TourGuide'],
    endpoints: (builder) => ({
        getBlogs: builder.query({
            query: () => '/blogs',
            providesTags: ['Blog'],
        }),
        getBlogBySlug: builder.query({
            query: (slug) => `/blogs/${slug}`,
            providesTags: (result, error, slug) => [{ type: 'Blog', id: slug }],
        }),
        getTourGuides: builder.query({
            query: () => '/tour-guides',
            providesTags: ['TourGuide'],
        }),
        getComments: builder.query({
            query: (blogSlug) => `/comments?blogSlug=${blogSlug}`,
            providesTags: (result, error, blogSlug) => [{ type: 'Comment', id: blogSlug }],
        }),
        addComment: builder.mutation({
            query: (comment) => ({
                url: '/comments',
                method: 'POST',
                body: comment,
            }),
            invalidatesTags: (result, error, { blogSlug }) => [{ type: 'Comment', id: blogSlug }],
        }),
    }),
});

export const {
    useGetBlogsQuery,
    useGetBlogBySlugQuery,
    useGetTourGuidesQuery,
    useGetCommentsQuery,
    useAddCommentMutation,
} = apiSlice;
