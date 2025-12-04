import { Skeleton } from "@/components/ui/Skeleton";

export const BlogDetailSkeleton = () => {
    return (
        <div className="bg-white min-h-screen animate-pulse">
            {/* Breadcrumb & Title */}
            <div className="container mx-auto px-4 py-8 md:py-12 md:px-6 text-center max-w-4xl">
                <div className="flex justify-center mb-4">
                    <Skeleton className="h-6 w-48 rounded-full" />
                </div>
                <div className="flex flex-col items-center gap-2 mb-4">
                    <Skeleton className="h-10 w-3/4 md:w-full" />
                    <Skeleton className="h-10 w-2/3 md:w-5/6" />
                </div>
                <div className="flex items-center justify-center gap-4">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-24" />
                </div>
            </div>

            {/* Hero Image */}
            <div className="w-full h-[300px] md:h-[500px] lg:h-[600px] relative mb-12 md:mb-20">
                <Skeleton className="w-full h-full" />
            </div>

            <div className="container mx-auto px-4 md:px-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
                    {/* Main Content Column */}
                    <div className="lg:col-span-8">
                        {/* Article Header Meta */}
                        <div className="flex items-center justify-between py-6 border-b border-gray-100 mb-8">
                            <div className="flex items-center gap-3">
                                <Skeleton className="w-8 h-8 rounded-full" />
                                <Skeleton className="h-4 w-32" />
                            </div>
                            <Skeleton className="h-4 w-24" />
                        </div>

                        {/* Article Body */}
                        <div className="space-y-6 mb-12">
                            <Skeleton className="h-6 w-full" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-5/6" />

                            <div className="py-8 my-10 border-y border-gray-100">
                                <Skeleton className="h-8 w-3/4 mx-auto" />
                            </div>

                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-4/5" />
                        </div>

                        {/* Author Bio Slider Placeholder */}
                        <div className="border-t border-gray-100 pt-12 mt-12 mb-12 flex flex-col items-center">
                            <Skeleton className="h-6 w-40 mb-2" />
                            <Skeleton className="h-4 w-24 mb-6" />
                            <Skeleton className="w-24 h-24 rounded-full mb-6" />
                            <Skeleton className="h-4 w-full max-w-xl" />
                            <Skeleton className="h-4 w-2/3 max-w-xl mt-2" />
                        </div>
                    </div>

                    {/* Sidebar Column */}
                    <div className="lg:col-span-4 space-y-16">
                        {/* Explore More */}
                        <div>
                            <Skeleton className="h-8 w-40 mb-8" />
                            <div className="space-y-10">
                                {[1, 2, 3].map((i) => (
                                    <div key={i}>
                                        <Skeleton className="w-full h-48 rounded-sm mb-4" />
                                        <div className="flex gap-3 mb-2">
                                            <Skeleton className="h-3 w-16" />
                                            <Skeleton className="h-3 w-16" />
                                        </div>
                                        <Skeleton className="h-5 w-full" />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Tour Guides */}
                        <div>
                            <Skeleton className="h-8 w-40 mb-8" />
                            <div className="space-y-6">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="flex gap-4 items-start pb-6 border-b border-gray-100 last:border-0">
                                        <Skeleton className="w-14 h-14 rounded-full flex-shrink-0" />
                                        <div className="flex-1 pt-1 space-y-2">
                                            <Skeleton className="h-4 w-32" />
                                            <Skeleton className="h-3 w-24" />
                                            <Skeleton className="h-3 w-16" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
