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
      <div className="flex flex-col md:flex-row gap-8 py-8 container">
        <div className="md:w-[25%] w-full border-r min-w-[20%]">
          <div className="sticky top-20 max-h-[calc(100vh-8rem)] overflow-y-auto py-4">
            {isLoading ? (
              <TableSkeleton />
            ) : post ? (
              <TableOfContents content={post.content} />
            ) : null}
          </div>
        </div>
        <div className="md:w-[70%] w-full margin-auto px-4">
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
