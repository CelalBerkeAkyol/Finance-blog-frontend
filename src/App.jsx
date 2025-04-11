import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUser } from "./app/features/user/userSlice"; // Adjust the path as necessary
import { logRender } from "./utils/logger";
import ErrorBoundary from "./components/error/ErrorBoundary";
import { FeedbackProvider } from "./context/FeedbackContext";
import usePageNavigation from "./hooks/usePageNavigation";

import HomePage from "./pages/HomePage";
import PricePage from "./pages/other_pages/PricePage";
import PageNotFound from "./pages/other_pages/PageNotFound";
import ProfilePage from "./pages/other_pages/ProfilePage";
import DeleteAccountPage from "./pages/other_pages/DeleteAccountPage";
import TeamPage from "./pages/other_pages/TeamPage";
import AboutUsPage from "./pages/other_pages/AboutUsPage";
import DisclaimerPage from "./pages/other_pages/DisclaimerPage";
import PrivacyPolicyPage from "./pages/other_pages/PrivacyPolicyPage";
import AdminLogsPage from "./pages/AdminLogsPage";


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
import ForgetPassword from "./pages/auth/ForgetPassword";
import ResetPassword from "./pages/auth/ResetPassword";

import ProtectedRoute from "./components/auth/ProtectedRoute";
import BlogPostPage from "./pages/blog_pages/BlogPostPage";
import BlogsPage from "./pages/blog_pages/BlogsPage";
import Footer from "./components/footer/Footer";
import CategoryBasePostsPage from "./pages/blog_pages/CategoryBasePostsPage";
import CategoriesPage from "./pages/blog_pages/CategoriesPage";

import CheatSheet from "./components/blog_components/blog_dashboard/helpers/CheatSheet";

// Sayfa navigasyonu ve scroll yönetimini sağlayan bileşen
function AppContent() {
  const dispatch = useDispatch();

  // Tüm sayfa değişikliklerinde sayfayı en üste kaydır
  usePageNavigation();

  useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch]);

  logRender("App", false);

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />

          {/* Blog yazarları için */}

          <Route path="/plans" element={<PricePage />} />
          <Route path="/about-us" element={<AboutUsPage />} />
          <Route path="/disclaimer" element={<DisclaimerPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="/login" element={<LoginPage />} />
	  <Route path="/forget" element={<ForgetPassword />} />
	  <Route path="/reset" element={<ResetPassword />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/team" element={<TeamPage />} />
          <Route
            path="/delete-account"
            element={
              <ProtectedRoute allowedRoles={["user"]}>
                <DeleteAccountPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute allowedRoles={["admin", "author"]}>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/home"
            element={
              <ProtectedRoute allowedRoles={["admin", "author"]}>
                <DashboardHomePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/posts"
            element={
              <ProtectedRoute allowedRoles={["admin", "author"]}>
                <AllBlogPostsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/post/new"
            element={
              <ProtectedRoute allowedRoles={["admin", "author"]}>
                <NewPostPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/post/edit/:id"
            element={
              <ProtectedRoute allowedRoles={["admin", "author"]}>
                <EditPostPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/images"
            element={
              <ProtectedRoute allowedRoles={["admin", "author"]}>
                <ImagePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/cheat-sheet"
            element={
              <ProtectedRoute allowedRoles={["admin", "author"]}>
                <CheatSheet />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/gallery"
            element={
              <ProtectedRoute allowedRoles={["admin", "author"]}>
                <GalleryPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/logs"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminLogsPage />
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
              <ProtectedRoute allowedRoles={["admin"]}>
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
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <FeedbackProvider>
        <Router>
          <AppContent />
        </Router>
      </FeedbackProvider>
    </ErrorBoundary>
  );
}

export default App;
