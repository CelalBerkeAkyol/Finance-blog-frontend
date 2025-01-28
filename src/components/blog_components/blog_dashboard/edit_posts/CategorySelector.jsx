import React, { useState } from "react";

export default function CategorySelector({ selectedCategory, onChange }) {
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
        onChange={(e) => onChange(e.target.value)}
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
}
