import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { upvotePost, downvotePost } from "../../app/features/blogs/postsSlice";
import { Icon } from "@iconify/react";

const VoteButtons = ({ postId }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // This pulls the logged-in status from your user slice
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);

  // Get the post from Redux to display current likes
  const post = useSelector((state) =>
    state.posts.posts.find((p) => p._id === postId)
  );
  const likeCount = post?.likes ?? 0;

  const handleUpvote = () => {
    if (!postId) return;

    // If user is not logged in, redirect to login
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    // Otherwise dispatch the upvote
    dispatch(upvotePost(postId));
  };

  const handleDownvote = () => {
    if (!postId) return;

    // If user is not logged in, redirect to login
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    // Otherwise dispatch the downvote
    dispatch(downvotePost(postId));
  };

  return (
    <div className="inline-flex items-center bg-gray-200 text-black rounded-full px-4 py-2 gap-2">
      <button
        onClick={handleUpvote}
        className="hover:bg-gray-300 rounded-full p-1 transition-colors touch-fix"
      >
        <Icon icon="mdi:thumb-up" width="20" />
      </button>
      <span className="text-sm font-semibold">{likeCount}</span>
      <button
        onClick={handleDownvote}
        className="hover:bg-gray-300 rounded-full p-1 transition-colors touch-fix"
      >
        <Icon icon="mdi:thumb-down" width="20" />
      </button>
    </div>
  );
};

export default VoteButtons;
