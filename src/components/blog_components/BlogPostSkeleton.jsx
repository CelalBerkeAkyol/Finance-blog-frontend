import React from "react";
import { Skeleton } from "@nextui-org/react";

const BlogPostSkeleton = () => {
  return (
    <div className="flex items-center w-full justify-center py-12 bg-gray-50">
      <div className=" p-6  min-w-[60%] bg-white shadow-lg rounded-lg">
        {/* Başlık Skeleton */}
        <Skeleton className="h-10 w-3/4 mb-6" />

        {/* Blog Detayları Skeleton */}
        <div
          id="blog-details"
          className="flex flex-wrap gap-4 pb-4 border-b border-gray-300 mb-6"
        >
          {/* Kategori Skeleton */}
          <Skeleton className="h-8 w-20 rounded-lg" />
          {/* Görüntülenme Sayısı Skeleton */}
          <Skeleton className="h-4 w-32" />
          {/* Oluşturulma Tarihi Skeleton */}
          <Skeleton className="h-4 w-40" />
        </div>

        {/* İçerik Skeleton */}
        <div className="pt-8 space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-4/6" />
          <Skeleton className="h-4 w-3/6" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-4/6" />
          <Skeleton className="h-4 w-3/6" />
          <Skeleton className="h-4 w-full" />
        </div>
      </div>
    </div>
  );
};

export default BlogPostSkeleton;
