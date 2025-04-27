import React from "react";
import { Skeleton } from "@nextui-org/react";

const RightSideBarSkeleton = () => {
  return (
    <div className="w-full text-left">
      <h3 className="text-lg font-semibold mb-4">
        <Skeleton className="h-6 w-32 rounded-md" />
      </h3>
      <div className="flex flex-col gap-4">
        {[...Array(5)].map((_, index) => (
          <div
            key={index}
            className="border border-gray-200 rounded-lg p-4 shadow-sm"
          >
            <Skeleton className="h-4 w-3/4 mb-2 rounded-md" />
            <Skeleton className="h-3 w-full mb-1 rounded-md" />
            <div className="flex justify-between mt-3">
              <Skeleton className="h-3 w-1/4 rounded-md" />
              <Skeleton className="h-3 w-1/5 rounded-md" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RightSideBarSkeleton;
