// tüm kategorilerin listelendiği sayfa
import React from "react";
import { Link } from "react-router-dom";
// TODO api yardımı ile güncel olarak hangi kategorilrein olduğunu çek
const categories = [
  "mikro-ekonomi",
  "Sağlık",
  "Spor",
  "Eğitim",
  "Finans",
  // Diğer kategorileri ekleyin...
];

const CategoriesPage = () => {
  return (
    <div className="min-h-screen bg-white py-12 sm:py-12">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">
            Tüm Kategoriler
          </h2>
          <p className="mt-2 text-lg text-gray-600">
            İlginizi çeken kategoriye tıklayın ve ilgili yazıları keşfedin.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-4">
          {categories.map((category) => (
            <Link
              key={category}
              to={`/blog/category/${encodeURIComponent(category)}`}
            >
              <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition">
                {category}
              </button>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoriesPage;
