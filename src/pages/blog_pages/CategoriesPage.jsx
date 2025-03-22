// tüm kategorilerin listelendiği sayfa
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../../api";
import { Spinner } from "@nextui-org/react";
import CustomNavbar from "../../components/header/CustomNavbar";
import { useFeedback } from "../../context/FeedbackContext";
import { Icon } from "@iconify/react";
import ErrorComponent from "../../components/error/ErrorComponent";

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
  const { error: showError } = useFeedback();
  const navigate = useNavigate();

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

  if (loading) {
    return (
      <>
        <CustomNavbar />
        <div className="min-h-screen bg-gray-50 flex justify-center items-center">
          <Spinner
            size="lg"
            color="primary"
            label="Kategoriler yükleniyor..."
          />
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <CustomNavbar />
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center px-4">
          <ErrorComponent
            message={error}
            code="FETCH_ERROR"
            onAction={() => window.location.reload()}
            actionText="Tekrar Dene"
          />
        </div>
      </>
    );
  }

  return (
    <>
      <CustomNavbar />
      <div className="min-h-screen bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-3">
              Kategorilerimizi Keşfedin
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              İlgi alanınıza uygun kategorilere göz atın ve en güncel makaleleri
              keşfedin.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => {
              const { icon, color } = getCategoryIcon(category);

              return (
                <Link
                  key={category}
                  to={`/blog/category/${encodeURIComponent(category)}`}
                  className="transform transition-all duration-300 hover:scale-105"
                >
                  <div className="bg-white rounded-xl shadow-md overflow-hidden h-full border border-gray-100">
                    <div className="px-6 py-8 sm:p-10 h-full flex flex-col">
                      <div className="flex items-center mb-4">
                        <div className={`p-2 rounded-lg ${color} mr-4`}>
                          <Icon icon={icon} className="text-white text-2xl" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-800">
                          {slugToReadable(category)}
                        </h3>
                      </div>
                      <p className="text-gray-600 mt-2 flex-grow">
                        {slugToReadable(category)} kategorisindeki tüm
                        makaleleri görüntüleyin.
                      </p>
                      <div className="mt-6 flex items-center text-primary">
                        <span className="text-sm font-medium">
                          Makaleleri Görüntüle
                        </span>
                        <Icon icon="mdi:arrow-right" className="ml-2 text-lg" />
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default CategoriesPage;
