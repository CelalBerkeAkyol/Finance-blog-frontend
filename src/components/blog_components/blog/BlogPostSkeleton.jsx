import React from "react";
import { Skeleton } from "@nextui-org/react";

const BlogPostSkeleton = () => {
  return (
    <div className="prose p-2 sm:p-3 md:p-4 text-start w-full max-w-full md:max-w-3xl mx-auto">
      {/* Başlık Skeleton */}
      <Skeleton className="h-12 w-full mb-3 rounded-lg" />
      <Skeleton className="h-12 w-3/4 mb-8 rounded-lg" />

      {/* Yazar ve meta bilgileri skeleton */}
      <div id="blog-meta" className="pb-4 border-b border-gray-100">
        {/* Yazar bilgisi - Avatar içeren kart görünümü */}
        <div className="flex items-center mb-3 sm:mb-4">
          <Skeleton className="h-16 w-16 rounded-full mr-3" />
          <div>
            <div className="flex flex-col">
              <Skeleton className="h-5 w-32 mb-1 rounded-md" />
              <Skeleton className="h-4 w-24 rounded-md" />
            </div>
          </div>
        </div>

        {/* Meta bilgileri */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <Skeleton className="h-4 w-28 rounded-md" />
          <Skeleton className="h-4 w-36 rounded-md" />
          <Skeleton className="h-4 w-32 rounded-md" />
        </div>
      </div>

      {/* İçerik Skeleton */}
      <div className="pt-8 space-y-8">
        {/* Alt başlık 1 */}
        <Skeleton className="h-8 w-1/2 rounded-lg mb-2" />

        {/* Paragraf 1 */}
        <div className="space-y-3">
          <Skeleton className="h-5 w-full rounded-md" />
          <Skeleton className="h-5 w-full rounded-md" />
          <Skeleton className="h-5 w-5/6 rounded-md" />
          <Skeleton className="h-5 w-full rounded-md" />
          <Skeleton className="h-5 w-4/6 rounded-md" />
        </div>

        {/* Paragraf 2 */}
        <div className="space-y-3">
          <Skeleton className="h-5 w-full rounded-md" />
          <Skeleton className="h-5 w-full rounded-md" />
          <Skeleton className="h-5 w-5/6 rounded-md" />
          <Skeleton className="h-5 w-4/6 rounded-md" />
        </div>

        {/* Alt başlık 2 */}
        <Skeleton className="h-8 w-2/5 rounded-lg mb-2" />

        {/* Paragraf 3 */}
        <div className="space-y-3">
          <Skeleton className="h-5 w-full rounded-md" />
          <Skeleton className="h-5 w-full rounded-md" />
          <Skeleton className="h-5 w-3/4 rounded-md" />
          <Skeleton className="h-5 w-full rounded-md" />
          <Skeleton className="h-5 w-4/6 rounded-md" />
        </div>

        {/* Alt başlık 3 */}
        <Skeleton className="h-8 w-1/3 rounded-lg mb-2" />

        {/* Paragraf 4 */}
        <div className="space-y-3">
          <Skeleton className="h-5 w-full rounded-md" />
          <Skeleton className="h-5 w-full rounded-md" />
          <Skeleton className="h-5 w-5/6 rounded-md" />
        </div>
      </div>

      {/* Beğeni butonları */}
      <div className="flex justify-between items-center w-full mt-8 pt-4 border-t-1">
        <div className="flex gap-3">
          <Skeleton className="h-10 w-20 rounded-full" />
          <Skeleton className="h-10 w-20 rounded-full" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-9 w-9 rounded-full" />
          <Skeleton className="h-9 w-9 rounded-full" />
          <Skeleton className="h-9 w-9 rounded-full" />
        </div>
      </div>
    </div>
  );
};

export default BlogPostSkeleton;
