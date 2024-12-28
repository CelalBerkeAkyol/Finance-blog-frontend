import React, { useEffect, useState } from "react";
import axios from "../../api";
import { Button } from "@nextui-org/react";

export default function PostList({ onEdit, onDelete }) {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get("/posts/");
        setPosts(response.data.data); // Backend'e göre güncelle
      } catch (error) {
        console.error("Postları alırken hata oluştu:", error.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPosts();
  }, []);

  if (isLoading) return <p>Loading posts...</p>;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full table-auto border-collapse border border-gray-200">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-2 border">Title</th>
            <th className="px-4 py-2 border">Category</th>
            <th className="px-4 py-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {posts.map((post) => (
            <tr key={post._id} className="border-b">
              <td className="px-4 py-2">{post.title}</td>
              <td className="px-4 py-2">{post.category || "N/A"}</td>
              <td className="px-4 py-2">
                <Button size="sm" color="primary" onClick={() => onEdit(post)}>
                  Edit
                </Button>
                <Button
                  size="sm"
                  color="error"
                  onClick={() => onDelete(post._id)}
                  className="ml-2"
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
