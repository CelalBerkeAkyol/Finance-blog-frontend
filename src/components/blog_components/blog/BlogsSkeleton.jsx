// /src/components/blog_components/BlogsSkeleton.jsx
import React from "react";

export default function BlogsSkeleton() {
  return (
    <div className="bg-white py-2 mb-12 min-h-full">
      <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
        {/* Başlık ve alt bilgi kısmı - Gerçek bileşene benzer şekilde */}
        <div className="mx-auto my-4 sm:my-6 text-start bg-gradient-to-r from-sky-950 to-lime-950 text-white py-4 px-4 rounded-lg shadow-lg opacity-70">
          <div className="h-8 bg-gray-500 rounded w-1/3 mb-3 animate-pulse"></div>
          <div className="h-5 bg-gray-500 rounded w-1/2 animate-pulse"></div>
        </div>

        {/* Blog yazıları için iskelet kartlar */}
        <div className=" pt-3">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4 md:gap-5">
            {[...Array(9)].map((_, index) => (
              <div className="flex" key={index}>
                <article className="flex flex-col w-full h-full bg-white shadow-sm rounded-md overflow-hidden transition-all border border-gray-100 animate-pulse">
                  <div className="p-3 sm:p-4 flex-grow">
                    {/* Kategori ve tarih iskeleti */}
                    <div className="flex flex-wrap items-center gap-1.5 mb-2">
                      <div className="h-4 bg-gray-200 rounded-full w-24"></div>
                      <div className="h-4 bg-gray-200 rounded-full w-16"></div>
                    </div>

                    {/* Başlık ve içerik iskeleti */}
                    <div className="mb-3">
                      <div className="h-6 bg-gray-200 rounded w-full mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-full mb-1"></div>
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-1"></div>
                      <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                    </div>
                  </div>

                  {/* Yazar bilgisi iskeleti */}
                  <div className="border-t border-gray-100 p-3 sm:p-4 flex items-center gap-3">
                    <div className="w-7 h-7 bg-gray-200 rounded-full"></div>
                    <div>
                      <div className="h-4 bg-gray-200 rounded w-24 mb-1"></div>
                      <div className="h-3 bg-gray-200 rounded w-16"></div>
                    </div>
                  </div>
                </article>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
