import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import HomePage from "./pages/HomePage";
import PricePage from "./pages/PricePage";
import PageNotFound from "./pages/PageNotFound";

import AuthorLoginPage from "./pages/blog_pages/AuthorLoginPage";
import BlogDashboardPage from "./pages/blog_pages/BlogDashboardPage";

import ProtectedRoute from "./components/ProtectedRoute";
import NewPostPage from "./pages/blog_pages/NewPostPage";
import BlogPostPage from "./pages/blog_pages/BlogPostPage";
import BlogPostDashboardPage from "./pages/blog_pages/BlogPostDashboardPage";

import BlogsPage from "./pages/blog_pages/BlogsPage";
import Footer from "./components/footer/Footer";

import CategoryBasePostsPage from "./pages/blog_pages/CategoryBasePostsPage";
import CategoriesPage from "./pages/blog_pages/CategoriesPage";
import EditPostPage from "./pages/blog_pages/EditPostPage";
import CheatSheet from "./components/blog_components/blog_dashboard/edit_posts/CheatSheet";
function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Router>
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            {/* Blog yazarları için */}
            <Route path="/blog-admin/login" element={<AuthorLoginPage />} />

            <Route path="/plans" element={<PricePage />} />

            {/* 404 Sayfası */}
            <Route path="*" element={<PageNotFound />} />
            {/* Blog author sayfaları */}

            <Route
              path="/blog-admin/dashboard"
              element={
                <ProtectedRoute>
                  <BlogDashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/blog-admin/posts"
              element={
                <ProtectedRoute>
                  <BlogPostDashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/blog-admin/post/new"
              element={
                <ProtectedRoute>
                  <NewPostPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/blog-admin/post/edit/:id"
              element={
                <ProtectedRoute>
                  <EditPostPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/blog-admin/cheat-sheet"
              element={
                <ProtectedRoute>
                  <CheatSheet />
                </ProtectedRoute>
              }
            />
            <Route path="/blog/posts/" element={<BlogsPage />} />
            <Route path="/blog/post/:id" element={<BlogPostPage />} />
            <Route path="/blog/categories" element={<CategoriesPage />} />
            <Route
              path="/blog/category/:category"
              element={<CategoryBasePostsPage />}
            />
          </Routes>
        </main>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
