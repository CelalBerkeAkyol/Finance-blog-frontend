import React, { useState } from "react";
import axios from "../../api";
import EditPostForm from "../../components/blog_components/EditPostForm";
import PostList from "../../components/blog_components/PostList";

export default function BlogDashboard() {
  const [editingPost, setEditingPost] = useState(null);

  const handleSave = async (postData) => {
    try {
      if (editingPost) {
        await axios.put(`/posts/${editingPost._id}`, postData);
        alert("Post updated successfully!");
      } else {
        await axios.post("/posts", postData);
        alert("Post created successfully!");
      }
      setEditingPost(null); // Düzenleme işlemi bitti
    } catch (error) {
      console.error("Post işlemi başarısız:", error.message);
    }
  };

  const handleDelete = async (postId) => {
    try {
      await axios.delete(`/posts/${postId}`);
      alert("Post deleted successfully!");
    } catch (error) {
      console.error("Post silme işlemi başarısız:", error.message);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <EditPostForm onSubmit={handleSave} postToEdit={editingPost} />
      <div className="mt-6">
        <PostList
          onEdit={(post) => setEditingPost(post)}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
}
