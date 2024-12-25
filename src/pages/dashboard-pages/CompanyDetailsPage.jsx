import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CompanyDetail from "../../components/dashboard/CompanyDetail";
import LeftSidebar from "../../components/dashboard/LeftSidebar";
const CompanyDetailsPage = () => {
  return (
    <Router>
      <Routes>
        <Route path="/app/company/:company_code" element={<CompanyDetail />} />
      </Routes>
    </Router>
  );
};

export default CompanyDetailsPage;
