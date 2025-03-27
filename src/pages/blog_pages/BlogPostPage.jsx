import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchPostById,
  incrementPostView,
  fetchPosts,
} from "../../app/features/blogs/postsSlice";
import BlogPostComponent from "../../components/blog_components/blog/BlogPostComponent";
import TableOfContents from "../../components/blog_components/blog/TableOfContents";
import BannerComponent from "../../components/header/BannerComponent";
import CustomNavbar from "../../components/header/CustomNavbar";
import BlogPostSkeleton from "../../components/blog_components/blog/BlogPostSkeleton";
import TableSkeleton from "../../components/blog_components/blog/TableSkeleton";
import RightSideBar from "../../components/blog_components/blog/RightSideBar";

function BlogPostPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { posts, isLoading } = useSelector((state) => state.posts);
  const post = posts.find((p) => p._id === id);

  // Local state flag to ensure the view is incremented only once
  const [hasIncremented, setHasIncremented] = useState(false);

  // Sayfa yüklendiğinde en üste scroll et
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "auto",
    });
  }, [id]); // id değiştiğinde (farklı bir blog post açıldığında) scroll'u sıfırla

  useEffect(() => {
    if (id) {
      dispatch(fetchPostById(id));
    }

    // Ensure we have posts data for the related posts sidebar
    if (posts.length === 0) {
      dispatch(fetchPosts());
    }
  }, [id, dispatch, posts.length]);

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
      <div className="flex flex-col md:flex-row gap-4 md:gap-6 py-6 md:py-8 container mx-auto">
        {/* Masaüstü için Table of Contents */}
        <div className="md:w-[15%] w-full md:border-r min-w-[180px] hidden md:block">
          <div className="sticky top-20 max-h-[calc(100vh-8rem)] overflow-y-auto py-2">
            {isLoading ? (
              <TableSkeleton />
            ) : post ? (
              <TableOfContents content={post.content} />
            ) : null}
          </div>
        </div>

        {/* Mobil için içeriğin üzerinde Table of Contents */}
        <div className="w-full md:hidden mb-3 bg-gray-50 rounded-lg p-2 shadow-sm">
          <details className="w-full">
            <summary className="text-sm font-medium text-gray-700 cursor-pointer py-2 touch-manipulation">
              İçindekiler 📑
            </summary>
            <div className="mt-2 border-t pt-2 px-1">
              {isLoading ? (
                <TableSkeleton />
              ) : post ? (
                <TableOfContents content={post.content} />
              ) : null}
            </div>
          </details>
        </div>

        {/* Blog İçeriği */}
        <div className="w-full md:w-[60%] lg:w-[60%] mx-auto">
          {isLoading ? (
            <BlogPostSkeleton />
          ) : post ? (
            <BlogPostComponent post={post} />
          ) : null}
        </div>

        {/* Sağ Kenar Çubuğu - Önerilen Yazılar */}
        <div className="md:w-[25%] lg:w-[20%] hidden md:block pl-2 md:pl-4 border-l">
          <div className="sticky top-20 max-h-[calc(100vh-8rem)] overflow-y-auto">
            {!isLoading && post && <RightSideBar post={post} />}
          </div>
        </div>
      </div>
    </div>
  );
}

export default BlogPostPage;
