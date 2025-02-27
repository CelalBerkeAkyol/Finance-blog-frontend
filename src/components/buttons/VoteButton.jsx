import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { upvotePost, downvotePost } from "../../app/features/blogs/postsSlice";
import { Icon } from "@iconify/react";

const VoteButtons = ({ postId }) => {
  const dispatch = useDispatch();

  // Redux store'dan bu post'u buluyoruz
  const post = useSelector((state) =>
    state.posts.posts.find((p) => p._id === postId)
  );

  // likes alanı varsa göster, yoksa 0
  const likeCount = post?.likes ?? 0;

  // Oy artırma fonksiyonu
  const handleUpvote = () => {
    if (!postId) return;
    dispatch(upvotePost(postId));
  };

  // Oy azaltma fonksiyonu
  const handleDownvote = () => {
    if (!postId) return;
    dispatch(downvotePost(postId));
  };

  return (
    <div className="inline-flex items-center bg-gray-200 text-black rounded-full px-4 py-2 gap-2">
      <button
        onClick={handleUpvote}
        className="hover:bg-gray-300 rounded-full p-1 transition-colors"
      >
        <Icon icon="mdi:arrow-up" width="18" height="18" />
      </button>

      <span className="font-semibold">{likeCount}</span>

      <button
        onClick={handleDownvote}
        className="hover:bg-gray-300 rounded-full p-1 transition-colors"
      >
        <Icon icon="mdi:arrow-down" width="18" height="18" />
      </button>
    </div>
  );
};

export default VoteButtons;
