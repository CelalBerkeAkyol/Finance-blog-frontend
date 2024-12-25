import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
} from "@nextui-org/react";
import UpgradeButton from "../../components/uyarılar/UpgradeButtonComponent";
import ServerErrorComponent from "../../components/uyarılar/ServerErrorComponent";
import SkeletonLoadingTable from "./Table/SkeletonLoadingTable";
import PaginationButton from "../buttons/PaginationButton";
import api from "../../api";
const CompanyDetail = () => {
  const { company_code } = useParams();
  const [balanceSheet, setBalanceSheet] = useState([]);
  const [transformedData, setTransformedData] = useState({});
  const [uniqueQuarters, setUniqueQuarters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Aynı anda 5 periyot göstereceğiz
  const columnsPerPage = 5;

  // currentPage -> 0’dan başlar; her "Sonraki" tıklamasında 1 artar
  const [currentPage, setCurrentPage] = useState(0);
  // Butona basılmadan önce currentPage’i kontrol et
  const goToPrevPage = () => {
    if (canGoPrev) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (canGoNext) {
      setCurrentPage(currentPage + 1);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        const response = await api.get(
          `/api/data/company-balance/?company=${company_code}`
        );
        const data = response.data;
        setBalanceSheet(data);

        // Verileri dönüştür ve quarter/year çiftleri oluştur
        const transformed = {};
        data.forEach((item) => {
          const periodKey = `${item.quarter}/${item.year}`;
          if (!transformed[item.kalem]) {
            transformed[item.kalem] = {};
          }
          transformed[item.kalem][periodKey] = item.formatted_value;
        });
        setTransformedData(transformed);

        // Tüm benzersiz quarter/year çiftlerini al
        const allPeriods = data.map((item) => ({
          year: parseInt(item.year, 10),
          quarter: parseInt(item.quarter, 10),
        }));

        // Benzersiz dönemleri elde et
        const uniquePeriods = [];
        const seen = new Set();
        for (const period of allPeriods) {
          const key = `${period.quarter}/${period.year}`;
          if (!seen.has(key)) {
            seen.add(key);
            uniquePeriods.push(period);
          }
        }

        // Dönemleri yıl ve çeyreğe göre azalan sırada sıralayalım
        uniquePeriods.sort((a, b) => {
          if (b.year === a.year) {
            return b.quarter - a.quarter;
          }
          return b.year - a.year;
        });

        // Kolon başlıkları için dizi oluştur
        const sortedPeriodKeys = uniquePeriods.map(
          (p) => `${p.quarter}/${p.year}`
        );
        setUniqueQuarters(sortedPeriodKeys);
      } catch (err) {
        console.error("Veri çekme hatası:", err);
        setError("Veri çekilirken bir hata oluştu.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [company_code]);

  // 1. Loading veya Error durumları
  if (loading) return <SkeletonLoadingTable />;
  if (error) return <ServerErrorComponent message={error} />;

  // 2. Toplam sütun ve kayma hesaplamaları
  const totalColumns = uniqueQuarters.length;

  // Kaç kez kayma yapabiliriz? (her defasında 1 ileri kayarak)
  // Örn: 8 kolon varsa ve 5 gösteriyorsak => 8 - 5 + 1 = 4 kayma
  const totalPages = totalColumns - columnsPerPage + 1;

  // Şu an gösterdiğimiz dilim: [currentPage, currentPage + 5)
  const startIndex = currentPage;
  const endIndex = currentPage + columnsPerPage;
  const visibleColumns = uniqueQuarters.slice(startIndex, endIndex);

  // Butonları pasif (disabled) yapmak için kontrol
  // currentPage 0’dan başlar => 0..(totalPages-1) arasında gezinebilir
  const canGoPrev = currentPage > 0;
  const canGoNext = currentPage < totalPages - 1;

  // 3. Render
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">
        Bilanço Verileri - {company_code}
      </h1>

      {/* Pagination Butonları */}
      <PaginationButton
        canGoPrev={canGoPrev} // Geri gitme durumu
        canGoNext={canGoNext} // İleri gitme durumu
        onPrev={goToPrevPage} // Geri gitme fonksiyonu
        onNext={goToNextPage} // İleri gitme fonksiyonu
      />

      {/* Tablo */}
      <Table aria-label="Company Balance Sheet" isStriped>
        <TableHeader>
          <TableColumn>HESAP KALEMİ</TableColumn>
          {visibleColumns.map((period) => (
            <TableColumn key={period}>{period}</TableColumn>
          ))}
        </TableHeader>
        <TableBody>
          {Object.keys(transformedData).length > 0 ? (
            Object.entries(transformedData).map(([kalem, periodValues]) => (
              <TableRow key={kalem}>
                <TableCell>{kalem}</TableCell>
                {visibleColumns.map((period) => (
                  <TableCell key={period}>
                    {periodValues[period] !== undefined
                      ? periodValues[period]
                      : "-"}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={visibleColumns.length + 1}
                className="text-center"
              >
                <UpgradeButton />
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default CompanyDetail;
