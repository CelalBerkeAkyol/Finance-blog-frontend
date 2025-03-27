import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardBody,
  CardFooter,
  Image,
  Chip,
  Avatar,
} from "@nextui-org/react";
import { Icon } from "@iconify/react";

// Format date to readable format
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("tr-TR", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const RelatedPostsComponent = ({ currentPostId, category }) => {
  const navigate = useNavigate();
  const { posts } = useSelector((state) => state.posts);

  // Find related posts (same category, excluding current post)
  const sameCategory = posts.filter(
    (post) => post.category === category && post._id !== currentPostId
  );

  // If we don't have 10 posts in the same category, add posts from other categories
  let relatedPosts = [...sameCategory];

  if (relatedPosts.length < 10) {
    const otherPosts = posts
      .filter(
        (post) => post.category !== category && post._id !== currentPostId
      )
      .slice(0, 10 - relatedPosts.length);

    relatedPosts = [...relatedPosts, ...otherPosts];
  }

  // Limit to 10 posts
  relatedPosts = relatedPosts.slice(0, 10);

  if (relatedPosts.length === 0) {
    return null;
  }

  return (
    <div className="w-full text-left">
      <h3 className="text-lg font-bold mb-4 text-gray-800 border-b pb-2 text-left">
        Önerilen Yazılar
      </h3>
      <div className="flex flex-col gap-4">
        {relatedPosts.map((post) => {
          // Get author information with fallbacks
          const authorName =
            typeof post.author === "object" && post.author?.userName
              ? post.author.userName
              : "İsimsiz Yazar";

          const authorOccupation =
            typeof post.author === "object" && post.author?.occupation
              ? post.author.occupation
              : "Yazar";

          const avatarUrl =
            typeof post.author === "object" && post.author?.profileImage
              ? post.author.profileImage
              : null;

          // Create a short summary if it exists
          const summary = post.summary
            ? post.summary.substring(0, 100) +
              (post.summary.length > 100 ? "..." : "")
            : "Açıklama bulunmuyor";

          return (
            <Card
              key={post._id}
              isPressable
              onPress={() => navigate(`/blog/post/${post._id}`)}
              className="hover:bg-gray-50 transition-colors duration-200 text-left border border-gray-100 rounded-lg shadow-sm"
            >
              <CardBody className="p-0 overflow-hidden">
                {post.coverImage && (
                  <Image
                    src={post.coverImage}
                    alt={post.title}
                    className="w-full h-32 object-cover"
                  />
                )}
              </CardBody>
              <CardFooter className="flex flex-col items-start justify-start p-3 text-left">
                <h4 className="text-sm font-semibold line-clamp-2 mb-2 text-left w-full">
                  {post.title}
                </h4>
                <p className="text-xs text-gray-600 mb-4 line-clamp-2 text-left w-full">
                  {summary}
                </p>

                <div className="flex items-center justify-start w-full mb-2 mt-1">
                  <Avatar
                    size="sm"
                    src={avatarUrl}
                    name={authorName.substring(0, 2).toUpperCase()}
                    className="mr-2"
                  />
                  <div className="flex flex-col items-start">
                    <span className="text-xs font-medium text-left">
                      {authorName}
                    </span>
                    <span className="text-xs text-gray-500 text-left">
                      {authorOccupation}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between w-full text-xs text-gray-500">
                  <div className="flex items-center gap-1 justify-start">
                    <Icon icon="mdi:calendar-outline" width={14} />
                    <span>{formatDate(post.createdAt)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Icon icon="mdi:eye-outline" width={14} />
                    <span>{post.views} görüntülenme</span>
                  </div>
                </div>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default RelatedPostsComponent;
