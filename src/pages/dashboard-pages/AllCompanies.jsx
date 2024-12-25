import LeftSidebar from "../../components/dashboard/sidebars/LeftSidebar";
import BannerComponent from "../../components/header/BannerComponent";
import AllCompaniesListTable from "../../components/dashboard/Table/AllCompaniesListTable";
const AllCompaniesPage = () => {
  return (
    <div className="flex h-screen overflow-hidden ">
      {/* Sol Navbar */}
      <LeftSidebar />

      {/* Ana İçerik */}
      <div className="flex-1  flex flex-col bg-gray-50 px-8 py-2 overflow-y-auto gap-5">
        <BannerComponent />
        <AllCompaniesListTable />
      </div>
    </div>
  );
};

export default AllCompaniesPage;
