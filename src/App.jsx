import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ChatBotPage from "./pages/ChatBotPage";
import HomePage from "./pages/HomePage";
import PricePage from "./pages/PricePage";
import PageNotFound from "./pages/PageNotFound";
import DashboardPage from "./pages/dashboard-pages/DashboardPage";
import ProtectedRoute from "./components/ProtectedRoute";
import AllCompaniesPage from "./pages/dashboard-pages/AllCompanies";
import CompanyDetail from "./components/dashboard/CompanyDetail";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/app/chatbot" element={<ChatBotPage />} />
          <Route path="/plans" element={<PricePage />} />

          {/* 404 Sayfası */}
          <Route path="*" element={<PageNotFound />} />

          {/* Dashboard pages */}
          <Route
            path="/app"
            element={
              <ProtectedRoute>
                <DashboardPage /> {/* Korunan sayfa bileşeni */}
              </ProtectedRoute>
            }
          />
          <Route
            path="/app/all-companies"
            element={
              <ProtectedRoute>
                <AllCompaniesPage />
                {/* Korunan sayfa bileşeni */}
              </ProtectedRoute>
            }
          />
          <Route
            path="/app/company/:company_code"
            element={<CompanyDetail />}
          />
        </Routes>
      </Router>
    </>
  );
}

export default App;
