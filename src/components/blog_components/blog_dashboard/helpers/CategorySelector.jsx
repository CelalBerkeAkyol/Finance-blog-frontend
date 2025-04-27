import React from "react";
import { Select, SelectItem } from "@nextui-org/react";

const CategorySelector = ({
  selectedCategory,
  onChange,
  className,
  isInvalid,
}) => {
  const categories = [
    "ekonomi",
    "finans",
    "veri-bilimi",
    "makine-öğrenmesi",
    "derin-öğrenme",
    "projeler",
    "kategori-yok",
  ];

  const handleSelectionChange = (e) => {
    onChange(e.target.value);
  };

  return (
    <Select
      label="Kategori Seç"
      placeholder="Kategori seçiniz"
      selectedKeys={selectedCategory ? [selectedCategory] : []}
      onChange={handleSelectionChange}
      className={className}
      isInvalid={isInvalid}
      errorMessage={isInvalid ? "Kategori seçimi zorunludur" : ""}
    >
      {categories.map((category) => (
        <SelectItem key={category} value={category}>
          {category}
        </SelectItem>
      ))}
    </Select>
  );
};

export default CategorySelector;
