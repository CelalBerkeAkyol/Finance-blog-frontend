import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import HomePage from "./pages/HomePage";
import PricePage from "./pages/PricePage";
import PageNotFound from "./pages/PageNotFound";

import AuthorLoginPage from "./pages/blog_pages/AuthorLoginPage";
import BlogDashboardPage from "./pages/blog_pages/BlogDashboardPage";
import BlogPostPage from "./pages/blog_pages/BlogPostPage";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <>
      <Router>
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
            path="/blog-admin/edit-posts"
            element={
              <ProtectedRoute>
                <BlogPostPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </>
  );
}

export default App;
