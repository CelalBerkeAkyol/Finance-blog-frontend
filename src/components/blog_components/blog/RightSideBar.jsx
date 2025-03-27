import React from "react";
import RelatedPostsComponent from "./RelatedPostsComponent";

const RightSideBar = ({ post }) => {
  // Early return if no post provided
  if (!post) return null;

  return (
    <div className="w-full">
      <div className="w-full flex flex-col gap-6 py-4">
        {/* Related Posts Section */}
        <RelatedPostsComponent
          currentPostId={post._id}
          category={post.category}
        />

        {/* Additional sidebar components can be added here */}
      </div>
    </div>
  );
};

export default RightSideBar;
