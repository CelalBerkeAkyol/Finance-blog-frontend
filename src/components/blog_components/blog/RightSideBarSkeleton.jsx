import React from "react";
import { Skeleton } from "@nextui-org/react";

const RightSideBarSkeleton = () => {
  return (
    <div className="w-full text-left">
      <h3 className="text-2xl font-bold mb-4 ml-2 text-gray-800 border-b pb-2 text-left">
        <Skeleton className="h-8 w-48 rounded-md" />
      </h3>
      <div className="flex flex-col gap-5">
        {/* 4 adet kart skeleton'u */}
        {[...Array(4)].map((_, index) => (
          <div
            key={index}
            className="border border-gray-100 rounded-lg shadow-sm overflow-hidden"
          >
            {/* Kapak resmi skeleton */}
            <Skeleton className="w-full h-36 rounded-t-lg" />

            <div className="p-3">
              {/* Başlık skeleton */}
              <div className="mb-3">
                <Skeleton className="h-5 w-full mb-1 rounded-md" />
                <Skeleton className="h-5 w-5/6 rounded-md" />
              </div>

              {/* Özet skeleton */}
              <div className="mb-4">
                <Skeleton className="h-3 w-full mb-1 rounded-md" />
                <Skeleton className="h-3 w-11/12 mb-1 rounded-md" />
                <Skeleton className="h-3 w-5/6 rounded-md" />
              </div>

              {/* Yazar bilgisi skeleton */}
              <div className="flex items-center mb-2">
                <Skeleton className="h-8 w-8 rounded-full mr-2" />
                <div className="flex flex-col">
                  <Skeleton className="h-3 w-24 mb-1 rounded-md" />
                  <Skeleton className="h-3 w-16 rounded-md" />
                </div>
              </div>

              {/* Alt bilgiler skeleton */}
              <div className="flex items-center justify-between w-full mt-2">
                <Skeleton className="h-3 w-20 rounded-md" />
                <Skeleton className="h-3 w-24 rounded-md" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RightSideBarSkeleton;
