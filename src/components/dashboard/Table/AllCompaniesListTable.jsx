import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
} from "@nextui-org/react"; // <-- @nextui-org/react ekliyoruz
import api from "../../../api";
import ServerErrorComponent from "../../uyarılar/ServerErrorComponent";
import SkeletonLoadingTable from "./SkeletonLoadingTable";
// Bir arama ikonu isterseniz:
const SearchIcon = (props) => {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      focusable="false"
      height="1em"
      role="presentation"
      viewBox="0 0 24 24"
      width="1em"
      {...props}
    >
      <path
        d="M11.5 21C16.7467 21 21 16.7467 21 11.5C21 6.25329 16.7467 2 11.5 2C6.25329 2 2 6.25329 2 11.5C2 16.7467 6.25329 21 11.5 21Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
      <path
        d="M22 22L20 20"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
};

const AllCompaniesListTable = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(true);

  // ARAMA (filtre) state
  const [searchQuery, setSearchQuery] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("authToken");

    api
      .get("/api/data/all-companies/")
      .then((response) => {
        setData(response.data);
      })
      .catch((err) => {
        console.error("Veri çekme hatası:", err);
        setError("Sunucuda bir hata oluştu, lütfen tekrar deneyiniz.");
      })
      .finally(() => {
        setIsLoaded(false);
      });
  }, []);

  // 1) Loading durumunu göster
  if (isLoaded) {
    return (
      <div style={{ padding: "1rem" }}>
        <SkeletonLoadingTable />
      </div>
    );
  }

  // 2) Hata varsa hata bileşenini göster
  if (error) {
    return <ServerErrorComponent message={error} />;
  }

  // 3) Filtreleme (search) uyguluyoruz
  const filteredData = data.filter((item) => {
    const lowerSearch = searchQuery.toLowerCase();
    const code = item.company_code.toLowerCase();
    const name = item.company_name.toLowerCase();
    // Örneğin company_code VEYA company_name içinde geçiyorsa
    return code.includes(lowerSearch) || name.includes(lowerSearch);
  });

  return (
    <div style={{ padding: "1rem" }}>
      {/* ARAMA INPUT'u */}
      <div style={{ marginBottom: "1rem", maxWidth: "300px" }}>
        <Input
          placeholder="Şirket kodu veya adı ara..."
          startContent={<SearchIcon className="text-default-400" />}
          size="sm"
          clearable
          onClear={() => setSearchQuery("")}
          value={searchQuery}
          variant="bordered"
          onValueChange={(value) => setSearchQuery(value)} // NextUI v2 için
          // onChange={(e) => setSearchQuery(e.target.value)} // Eski versiyonda
        />
      </div>

      {/* FİLTRELENMİŞ TABLO */}
      <Table
        isStriped
        classNames={{
          th: "bg-[#D8D8D9] h-16",
        }}
      >
        <TableHeader isRowHeader={true} className="h-16 !important">
          <TableColumn>Şirket Kodu</TableColumn>
          <TableColumn>Şirket Adı</TableColumn>
          <TableColumn>Şirket KAP Linki</TableColumn>
        </TableHeader>

        <TableBody
          // Boş sonuç varsa görüntüleyin
          emptyContent={
            filteredData.length === 0 ? "Sonuç bulunamadı" : "Yükleniyor..."
          }
          items={filteredData}
        >
          {(item) => (
            <TableRow key={item.company_code}>
              <TableCell
                onClick={() => navigate(`/app/company/${item.company_code}`)}
                style={{ cursor: "pointer" }}
              >
                {item.company_code}
              </TableCell>
              <TableCell>{item.company_name}</TableCell>
              <TableCell>
                <a
                  href={item.company_link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {item.company_link}
                </a>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default AllCompaniesListTable;
