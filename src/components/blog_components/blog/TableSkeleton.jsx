import React from "react";
import { Skeleton } from "@nextui-org/react";
function TableSkeleton() {
  return (
    <nav className="toc p-6 sticky text-sm">
      {/* Başlık */}
      <h2 className="text-xl text-center font-bold mb-4">
        <div className="animate-pulse h-5 w-36 bg-gray-200 rounded mx-auto" />
      </h2>
      {/* İçerik Skeleton */}
      <div className="pt-6 space-y-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-4/6" />
        <Skeleton className="h-4 w-3/6" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />

        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
      </div>
    </nav>
  );
}

export default TableSkeleton;
