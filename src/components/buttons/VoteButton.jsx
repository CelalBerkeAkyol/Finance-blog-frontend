// VoteButtons.jsx
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@heroui/react";
import { Icon } from "@iconify/react";
import { upvotePost, downvotePost } from "../../app/features/blogs/postsSlice";

const VoteButtons = ({ postId }) => {
  const dispatch = useDispatch();

  // Post listesinden bu ID'ye sahip post'u buluyoruz
  const post = useSelector((state) =>
    state.posts.posts.find((p) => p._id === postId)
  );

  // "likes" değeri yoksa 0 olarak göster
  const likeCount = post?.likes || 0;

  const handleUpvote = () => {
    if (!postId) return;
    dispatch(upvotePost(postId));
  };

  const handleDownvote = () => {
    if (!postId) return;
    dispatch(downvotePost(postId));
  };

  return (
    <div className="flex items-center justify-end gap-2">
      {/* Butonlar solda */}
      <Button
        onPress={handleUpvote}
        isIconOnly
        className="bg-green-500 text-white rounded-full hover:bg-green-600 w-8 h-8 flex items-center justify-center"
      >
        <Icon icon="mdi:thumb-up" width="16" className="text-white" />
      </Button>
      <Button
        onPress={handleDownvote}
        isIconOnly
        className="bg-red-500 text-white rounded-full hover:bg-red-600 w-8 h-8 flex items-center justify-center"
      >
        <Icon icon="mdi:thumb-down" width="16" className="text-white" />
      </Button>

      {/* Beğeni sayısı en sağda */}
      <span className="text-gray-700 text-sm font-semibold">{likeCount}</span>
    </div>
  );
};

export default VoteButtons;
