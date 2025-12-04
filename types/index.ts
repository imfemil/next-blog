export interface IBlog {
    _id: string;
    slug: string;
    title: string;
    excerpt: string;
    content: string[];
    author: {
        name: string;
        avatar: string;
        bio: string;
    };
    date: string;
    readTime: string;
    heroImage: string;
    category: string;
    quote: string;
}

export interface ITourGuide {
    _id: string;
    name: string;
    location: string;
    rating: number;
    reviews: number;
    avatar: string;
    specialty: string;
}

export interface IComment {
    _id: string;
    blogSlug: string;
    author: string;
    rating: number;
    date: string;
    content: string;
    avatar: string;
    email: string;
    createdAt?: string;
    updatedAt?: string;
}
