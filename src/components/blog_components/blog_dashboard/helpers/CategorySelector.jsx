import React from "react";

const CategorySelector = ({ selectedCategory, onChange, isInvalid }) => {
  const categories = [
    "mikro-ekonomi",
    "makro-ekonomi",
    "kişisel-finans",
    "tasarruf",
    "temel-analiz",
    "teknik-analiz",
    "kategori-yok",
    "araştırma",
  ];

  const handleChange = (e) => {
    onChange(e.target.value);
  };

  return (
    <div>
      <label
        htmlFor="category"
        className="block text-sm font-medium text-gray-700"
      >
        Kategori Seç
      </label>
      <select
        id="category"
        name="category"
        value={selectedCategory}
        onChange={handleChange}
        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
        required
      >
        <option value="" disabled>
          Kategori seçiniz
        </option>
        {categories.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CategorySelector;
