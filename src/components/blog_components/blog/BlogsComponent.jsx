import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchPosts } from "../../../app/features/blogs/postsSlice";
import PostCardComponent from "./PostCardComponent";
import BlogsSkeleton from "./BlogsSkeleton";
import ErrorComponent from "../../error/ErrorComponent";

export default function BlogsComponent() {
  const dispatch = useDispatch();
  const { posts, isLoading, isError, errorMessage, errorCode } = useSelector(
    (state) => state.posts
  );

  useEffect(() => {
    dispatch(fetchPosts({}));
  }, [dispatch]);

  if (isLoading) {
    return <BlogsSkeleton />;
  }

  if (isError) {
    return (
      <div className="w-full py-8">
        <ErrorComponent message={errorMessage} code={errorCode} />
      </div>
    );
  }

  return (
    <div className="bg-white py-2 mb-12 min-h-full">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <div className="mx-auto my-8 lg:mx-0 text-start bg-gradient-to-r from-gray-800 to-gray-700 text-white py-6 px-6 rounded-lg shadow-lg">
          <h1 className="text-pretty text-3xl font-bold sm:text-4xl">Blog</h1>
          <p className="mt-2 text-lg text-gray-300">
            Güncel içeriklerimizi keşfedin.
          </p>
        </div>
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-y-12 border-t border-gray-200 pt-6 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {posts.map((post, index) => (
            <PostCardComponent key={post._id || index} post={post} />
          ))}
        </div>
      </div>
    </div>
  );
}
