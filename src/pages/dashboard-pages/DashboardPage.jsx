import BannerComponent from "../../components/header/BannerComponent";
import CriclesComponent from "../../components/dashboard/data-görselleştirme/CriclesComponent";
import KPIComponent from "../../components/dashboard/data-görselleştirme/KPIComponent";
import LeftSidebar from "../../components/dashboard/sidebars/LeftSidebar";
import RightSidebar from "../../components/dashboard/sidebars/RightSidebar";
import TableComponent from "../../components/dashboard/Table/TableComponent";

const DashBoardPage = () => {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sol Navbar */}
      <LeftSidebar />

      {/* Ana İçerik */}
      <div className="flex-1 flex flex-col bg-gray-50 px-8 py-2 overflow-y-auto gap-5">
        <BannerComponent />
        <KPIComponent />
        <CriclesComponent />
        <TableComponent />
      </div>

      {/* Sağ Navbar */}
      <RightSidebar />
    </div>
  );
};

export default DashBoardPage;
