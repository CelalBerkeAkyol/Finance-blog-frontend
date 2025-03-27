import React from "react";
import { Skeleton } from "@nextui-org/react";

function TableSkeleton() {
  return (
    <nav className="toc p-2 sm:p-4 sticky text-sm">
      {/* Başlık */}
      <h2 className="text-center font-bold mb-6">
        <Skeleton className="h-6 w-48 mx-auto rounded-md" />
      </h2>

      {/* Table of Contents Öğeleri */}
      <ul className="space-y-5">
        {/* Başlık ve alt başlık grupları - renkli kutu ve içeriğiyle */}
        <li className="mb-1">
          <Skeleton className="h-5 w-full rounded-md" />
        </li>
        <li className="ml-2 mb-1">
          <Skeleton className="h-4 w-5/6 rounded-md" />
        </li>
        <li className="ml-2 mb-3">
          <Skeleton className="h-4 w-4/6 rounded-md" />
        </li>

        <li className="ml-4 mb-1">
          <Skeleton className="h-4 w-3/4 rounded-md" />
        </li>
        <li className="ml-4 mb-4">
          <Skeleton className="h-4 w-2/3 rounded-md" />
        </li>

        {/* Başka bir ana başlık grubu */}
        <li className="mb-1">
          <Skeleton className="h-5 w-full rounded-md" />
        </li>
        <li className="ml-2 mb-1">
          <Skeleton className="h-4 w-5/6 rounded-md" />
        </li>
        <li className="ml-2 mb-3">
          <Skeleton className="h-4 w-4/5 rounded-md" />
        </li>

        {/* Son bir ana başlık grubu */}
        <li className="mb-1">
          <Skeleton className="h-5 w-full rounded-md" />
        </li>
        <li className="ml-2 mb-3">
          <Skeleton className="h-4 w-3/4 rounded-md" />
        </li>

        {/* Ek bir grup */}
        <li className="mb-1">
          <Skeleton className="h-5 w-full rounded-md" />
        </li>
        <li className="ml-2 mb-1">
          <Skeleton className="h-4 w-4/5 rounded-md" />
        </li>
      </ul>
    </nav>
  );
}

export default TableSkeleton;
