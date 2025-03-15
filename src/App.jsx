import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUser } from "./app/features/user/userSlice"; // Adjust the path as necessary
import { logRender } from "./utils/logger";

import HomePage from "./pages/HomePage";
import PricePage from "./pages/other_pages/PricePage";
import PageNotFound from "./pages/other_pages/PageNotFound";
import ProfilePage from "./pages/other_pages/ProfilePage";

import ProtectedRoute from "./components/ProtectedRoute";
import BlogPostPage from "./pages/blog_pages/BlogPostPage";
import BlogsPage from "./pages/blog_pages/BlogsPage";
import Footer from "./components/footer/Footer";
import CategoryBasePostsPage from "./pages/blog_pages/CategoryBasePostsPage";
import CategoriesPage from "./pages/blog_pages/CategoriesPage";

import CheatSheet from "./components/blog_components/blog_dashboard/helpers/CheatSheet";
import AboutUsPage from "./pages/other_pages/AboutUsPage";
import DisclaimerPage from "./pages/other_pages/DisclaimerPage";
import PrivacyPolicyPage from "./pages/other_pages/PrivacyPolicyPage";

{
  /* dashboard pages */
}
import ImagePage from "./pages/dashboard_pages/ImagePage";
import GalleryPage from "./pages/dashboard_pages/GalleryPage";
import EditPostPage from "./pages/dashboard_pages/EditPostPage";
import DashboardHomePage from "./pages/dashboard_pages/DashboardHomePage";
import NewPostPage from "./pages/dashboard_pages/NewPostPage";
import AllBlogPostsPage from "./pages/dashboard_pages/AllBlogPostsPage";
import UsersPage from "./pages/dashboard_pages/UsersPage";

import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";

function App() {
  const dispatch = useDispatch();
  const { userInfo, isLoggedIn } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch]);

  logRender("App", false);

  return (
    <div className="min-h-screen flex flex-col">
      <Router>
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />

            {/* Blog yazarları için */}

            <Route path="/plans" element={<PricePage />} />
            <Route path="/about-us" element={<AboutUsPage />} />
            <Route path="/disclaimer" element={<DisclaimerPage />} />
            <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/home"
              element={
                <ProtectedRoute>
                  <DashboardHomePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/posts"
              element={
                <ProtectedRoute>
                  <AllBlogPostsPage />
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
            <Route
              path="/dashboard/users"
              element={
                <ProtectedRoute>
                  <UsersPage />
                </ProtectedRoute>
              }
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
