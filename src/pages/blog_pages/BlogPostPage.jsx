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
import RightSideBarSkeleton from "../../components/blog_components/blog/RightSideBarSkeleton";
import FloatingActionButtons from "../../components/buttons/FloatingActionButtons";
import { logInfo, logError } from "../../utils/logger";

function BlogPostPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { posts, isLoading } = useSelector((state) => state.posts);
  const post = posts.find((p) => p._id === id);

  // Local state flag to ensure the view is incremented only once
  const [hasIncremented, setHasIncremented] = useState(false);
  const [loadedPosts, setLoadedPosts] = useState(false);

  // Sayfa yüklendiğinde en üste scroll et
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "auto",
    });
  }, [id]); // id değiştiğinde (farklı bir blog post açıldığında) scroll'u sıfırla

  // Load all posts only once when component mounts
  useEffect(() => {
    logInfo("BlogPostPage", "Fetching all posts for related posts sidebar");
    // The fetchPosts action expects an object with page and limit properties
    dispatch(fetchPosts({ page: 1, limit: 100 }))
      .then((response) => {
        logInfo("BlogPostPage", "Fetched posts response:", response);
        setLoadedPosts(true);
      })
      .catch((error) => {
        logError("BlogPostPage", "Error fetching posts:", error);
      });
  }, [dispatch]);

  // Load specific post when ID changes
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
      <div className="flex flex-col md:flex-row gap-4 md:gap-6 py-6 md:py-8 container mx-auto px-2 max-w-[1600px] w-full">
        {/* Masaüstü için Table of Contents */}
        <div className="md:w-[18%] w-full md:border-r min-w-[200px] hidden md:block">
          <div className="sticky top-20 max-h-[calc(100vh-8rem)] overflow-y-auto py-2">
            {isLoading ? (
              <TableSkeleton />
            ) : post ? (
              <TableOfContents content={post.content} />
            ) : null}
          </div>
        </div>

        {/* Blog İçeriği */}
        <div className="w-full md:w-[57%] lg:w-[57%] mx-auto">
          {isLoading ? (
            <BlogPostSkeleton />
          ) : post ? (
            <>
              <BlogPostComponent post={post} />

              {/* Mobil için önerilen yazılar - blog post altında göster */}
              <div className="mt-8 md:hidden">
                <div className="border-t pt-4">
                  {!isLoading && post && posts.length > 0 ? (
                    <RightSideBar post={post} />
                  ) : (
                    <RightSideBarSkeleton />
                  )}
                </div>
              </div>
            </>
          ) : null}
        </div>

        {/* Sağ Kenar Çubuğu - Önerilen Yazılar */}
        <div
          className="md:w-[25%] lg:w-[23%] hidden md:block pl-2 md:pl-4 border-l pt-4"
          style={{
            position: "sticky",
            top: "5rem",
            maxHeight: "calc(100vh - 8rem)",
            overflowY: "auto",
          }}
        >
          {!isLoading && post && posts.length > 0 ? (
            <RightSideBar post={post} />
          ) : (
            <RightSideBarSkeleton />
          )}
        </div>
      </div>

      {/* Floating Action Buttons */}
      {!isLoading && post && <FloatingActionButtons content={post.content} />}
    </div>
  );
}

export default BlogPostPage;
