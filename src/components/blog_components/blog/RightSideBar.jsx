import React from "react";
import RelatedPostsComponent from "./RelatedPostsComponent";

const RightSideBar = ({ post }) => {
  // Early return if no post provided
  if (!post) return null;

  return (
    <RelatedPostsComponent currentPostId={post._id} category={post.category} />
  );
};

export default RightSideBar;
