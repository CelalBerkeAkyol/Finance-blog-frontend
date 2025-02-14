import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import HomePage from "./pages/HomePage";
import PricePage from "./pages/other_pages/PricePage";
import PageNotFound from "./pages/other_pages/PageNotFound";

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
import CheatSheet from "./components/blog_components/blog_dashboard/helpers/CheatSheet";
import AboutUsPage from "./pages/other_pages/AboutUsPage";
import DisclaimerPage from "./pages/other_pages/DisclaimerPage";
import PrivacyPolicyPage from "./pages/other_pages/PrivacyPolicyPage";
import ImagePage from "./pages/blog_pages/ImagePage";
import GalleryPage from "./pages/blog_pages/GalleryPage";
function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Router>
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />

            {/* Blog yazarları için */}
            <Route path="/blog-admin/login" element={<AuthorLoginPage />} />
            <Route path="/plans" element={<PricePage />} />
            <Route path="/about-us" element={<AboutUsPage />} />
            <Route path="/disclaimer" element={<DisclaimerPage />} />
            <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
            <Route
              path="/dashboard/home"
              element={
                <ProtectedRoute>
                  <BlogDashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/posts"
              element={
                <ProtectedRoute>
                  <BlogPostDashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/post/new"
              element={
                <ProtectedRoute>
                  <NewPostPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/post/edit/:id"
              element={
                <ProtectedRoute>
                  <EditPostPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/images"
              element={
                <ProtectedRoute>
                  <ImagePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/cheat-sheet"
              element={
                <ProtectedRoute>
                  <CheatSheet />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/gallery"
              element={
                <ProtectedRoute>
                  <GalleryPage />
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

            {/* 404 Sayfası */}
            <Route path="*" element={<PageNotFound />} />
            {/* Blog author sayfaları */}
          </Routes>
        </main>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
