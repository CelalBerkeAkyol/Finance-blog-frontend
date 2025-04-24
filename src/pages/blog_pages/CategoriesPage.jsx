// tüm kategorilerin listelendiği sayfa
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../../api";
import { Spinner, Pagination } from "@nextui-org/react";
import CustomNavbar from "../../components/header/CustomNavbar";
import { useFeedback } from "../../context/FeedbackContext";
import { Icon } from "@iconify/react";
import ErrorComponent from "../../components/error/ErrorComponent";
import useScrollToTop from "../../hooks/useScrollToTop";
import { scrollToTop } from "../../utils/scrollHelpers";

// Kategori isimlerini okunabilir hale getiriyor
function slugToReadable(slug) {
  if (!slug) return "Kategori Yok";
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

// Kategorilere özel ikon ve renk belirlenmesi
const getCategoryIcon = (category) => {
  const icons = {
    "mikro-ekonomi": { icon: "mdi:chart-line", color: "bg-blue-500" },
    "makro-ekonomi": { icon: "mdi:chart-areaspline", color: "bg-indigo-600" },
    "kişisel-finans": { icon: "mdi:wallet", color: "bg-green-600" },
    tasarruf: { icon: "mdi:piggy-bank", color: "bg-amber-500" },
    "temel-analiz": { icon: "mdi:finance", color: "bg-purple-600" },
    "teknik-analiz": { icon: "mdi:chart-bar", color: "bg-rose-600" },
    "kategori-yok": { icon: "mdi:help-circle", color: "bg-gray-500" },
    araştırma: { icon: "mdi:magnify", color: "bg-cyan-600" },
  };

  return icons[category] || { icon: "mdi:tag", color: "bg-slate-600" };
};

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const { error: showError } = useFeedback();
  const navigate = useNavigate();

  // Items per page
  const itemsPerPage = 9;

  // Page değiştiğinde sayfayı en üste kaydır
  useScrollToTop(page, { behavior: "auto", delay: 100 });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("/category/all-categories");
        if (response.data.success) {
          setCategories(response.data.data);
        } else {
          setError("Kategoriler yüklenirken bir hata oluştu.");
        }
      } catch (err) {
        setError(err.message || "Kategoriler yüklenirken bir hata oluştu.");
        showError(err.message || "Kategoriler yüklenirken bir hata oluştu.");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [showError]);

  const handlePageChange = (newPage) => {
    // Önce sayfayı tam olarak en üste kaydır, sonra sayfa değişimini gerçekleştir
    scrollToTop({ behavior: "instant", delay: 0 });
    setPage(newPage);
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <CustomNavbar />
        <div className="flex-grow flex justify-center items-center">
          <Spinner
            size="lg"
            color="primary"
            label="Kategoriler yükleniyor..."
          />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col min-h-screen">
        <CustomNavbar />
        <div className="flex-grow flex justify-center items-center px-4">
          <ErrorComponent
            message={error}
            code="FETCH_ERROR"
            onAction={() => window.location.reload()}
            actionText="Tekrar Dene"
          />
        </div>
      </div>
    );
  }

  // Paginate categories
  const totalPages = Math.ceil(categories.length / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedCategories = categories.slice(startIndex, endIndex);

  return (
    <div className="flex flex-col min-h-screen">
      <CustomNavbar />
      <main className="flex-grow">
        <div className="bg-white py-2 mb-12 min-h-full">
          <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
            <div className="mx-auto my-4 sm:my-6 text-start bg-gradient-to-r from-sky-950 to-lime-900 text-white py-4 px-4 rounded-lg shadow-lg">
              <h1 className="text-2xl sm:text-3xl font-bold">Kategoriler</h1>
              <p className="mt-2 text-sm sm:text-base text-gray-300">
                Tüm blog kategorileri ve içerikleri
              </p>
            </div>

            <div className="pt-3">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4 md:gap-5">
                {paginatedCategories.map((category) => {
                  const { icon, color } = getCategoryIcon(category);

                  return (
                    <article
                      key={category}
                      className="flex flex-col w-full h-full bg-white shadow-sm hover:shadow-md rounded-md overflow-hidden transition-all border border-gray-100 cursor-pointer"
                      onClick={() =>
                        navigate(
                          `/blog/category/${encodeURIComponent(category)}`
                        )
                      }
                    >
                      <div className="p-3 sm:p-4 flex-grow">
                        <div className="flex items-center mb-3">
                          <div className={`p-2 rounded-lg ${color} mr-3`}>
                            <Icon icon={icon} className="text-white text-xl" />
                          </div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {slugToReadable(category)}
                          </h3>
                        </div>
                        <div className="text-gray-600 text-sm line-clamp-3">
                          {slugToReadable(category)} kategorisindeki makaleler,
                          analizler ve detaylı içerikleri görüntüleyin.
                        </div>
                      </div>

                      <div className=" p-3">
                        <Link
                          to={`/blog/category/${encodeURIComponent(category)}`}
                          className="flex items-center text-primary text-sm font-medium"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <span>Makaleleri Görüntüle</span>
                          <Icon icon="mdi:arrow-right" className="ml-2" />
                        </Link>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-8 mb-4">
                <Pagination
                  total={totalPages}
                  page={page}
                  onChange={handlePageChange}
                  color="primary"
                  showControls
                />
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default CategoriesPage;
