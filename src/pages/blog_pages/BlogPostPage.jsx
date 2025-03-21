import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchPostById,
  incrementPostView,
} from "../../app/features/blogs/postsSlice";
import BlogPostComponent from "../../components/blog_components/blog/BlogPostComponent";
import TableOfContents from "../../components/blog_components/blog/TableOfContents";
import BannerComponent from "../../components/header/BannerComponent";
import CustomNavbar from "../../components/header/CustomNavbar";
import BlogPostSkeleton from "../../components/blog_components/blog/BlogPostSkeleton";
import TableSkeleton from "../../components/blog_components/blog/TableSkeleton";

function BlogPostPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { posts, isLoading } = useSelector((state) => state.posts);
  const post = posts.find((p) => p._id === id);

  // Local state flag to ensure the view is incremented only once
  const [hasIncremented, setHasIncremented] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(fetchPostById(id));
    }
  }, [id, dispatch]);

  useEffect(() => {
    if (post && !hasIncremented) {
      dispatch(incrementPostView(post._id));
      setHasIncremented(true);
    }
  }, [post, dispatch, hasIncremented]);

  return (
    <div className="flex flex-col">
      <BannerComponent />
      <CustomNavbar />
      <div className="flex flex-col md:flex-row gap-4 md:gap-8 py-6 md:py-8 container mx-auto ">
        {/* Masaüstü için Table of Contents */}
        <div className="md:w-[20%] w-full md:border-r min-w-[180px] hidden md:block">
          <div className="sticky top-20 max-h-[calc(100vh-8rem)] overflow-y-auto py-4 pr-2">
            {isLoading ? (
              <TableSkeleton />
            ) : post ? (
              <TableOfContents content={post.content} />
            ) : null}
          </div>
        </div>

        {/* Mobil için içeriğin üzerinde Table of Contents */}
        <div className="w-full md:hidden mb-4 bg-gray-50 rounded-lg p-3">
          <details className="w-full">
            <summary className="font-medium text-gray-700 cursor-pointer py-2">
              İçindekiler 📑
            </summary>
            <div className="mt-2 border-t pt-2">
              {isLoading ? (
                <TableSkeleton />
              ) : post ? (
                <TableOfContents content={post.content} />
              ) : null}
            </div>
          </details>
        </div>

        {/* Blog İçeriği - Sağdan boşluk ile */}
        <div className="w-full md:w-[75%] lg:w-[70%] mx-auto md:pr-4 lg:pr-8">
          {isLoading ? (
            <BlogPostSkeleton />
          ) : post ? (
            <BlogPostComponent post={post} />
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default BlogPostPage;
