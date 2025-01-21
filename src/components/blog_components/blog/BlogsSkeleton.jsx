// /src/components/blog_components/BlogsSkeleton.jsx
import React from "react";

export default function BlogsSkeleton() {
  return (
    <div className="bg-white py-2 mb-12 min-h-full">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        {/* Başlık ve alt bilgi kısmı - Gerçek bileşene benzer şekilde */}
        <div className="mx-auto lg:mx-0 text-start bg-gradient-to-r py-4">
          <h1 className="text-pretty text-3xl font-semibold tracking-tight text-gray-900 sm:text-5xl animate-pulse">
            {/* Başlık iskeleti */}
            <span className="block bg-gray-300 rounded h-8 w-1/3"></span>
          </h1>
          <p className="mt-2 text-lg/8 text-gray-600 animate-pulse">
            {/* Alt bilgi iskeleti */}
            <span className="block bg-gray-300 rounded h-6 w-1/2"></span>
          </p>
        </div>

        {/* Blog yazıları için iskelet kartlar */}
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-y-12 border-t border-gray-200 pt-6 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {[...Array(6)].map((_, index) => (
            <div
              key={index}
              className="flex max-w-xl flex-col items-start bg-gray-50 mx-4 p-8 rounded-lg animate-pulse"
            >
              {/* Tarih ve kategori iskeleti */}
              <div className="flex items-center gap-x-4 text-xs mb-4">
                <div className="h-4 bg-gray-300 rounded w-24"></div>
                <div className="h-4 bg-gray-300 rounded w-16"></div>
              </div>
              {/* Başlık ve içerik iskeleti */}
              <div className="h-6 bg-gray-300 rounded w-full mb-4"></div>
              <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-300 rounded w-3/4 mb-4"></div>
              {/* Yazar bilgileri iskeleti */}
              <div className="relative mt-4 flex items-center gap-x-4">
                <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                <div className="flex flex-col gap-y-2">
                  <div className="h-4 bg-gray-300 rounded w-24"></div>
                  <div className="h-4 bg-gray-300 rounded w-16"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
