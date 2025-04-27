import React, { useState, useEffect } from "react";
import { Select, SelectItem, Spinner } from "@nextui-org/react";
import axios from "../../../../api";
import { useFeedback } from "../../../../context/FeedbackContext";

const CategorySelector = ({
  selectedCategory,
  onChange,
  className,
  isInvalid,
}) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const { error } = useFeedback();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("/category/categories-with-details");
        if (response.data.success) {
          // Veritabanından gelen kategorileri yükle
          setCategories(
            response.data.data
              .filter((cat) => cat.active)
              .map((cat) => ({
                slug: cat.slug,
                name: cat.name,
              }))
          );
        } else {
          // Veritabanından kategoriler getirilemezse, kategorileri getirmeyi dene
          const basicResponse = await axios.get("/category/all-categories");
          if (basicResponse.data.success) {
            // Basit kategori sluglarını kullan
            setCategories(
              basicResponse.data.data.map((slug) => ({
                slug,
                name: slug
                  .split("-")
                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(" "),
              }))
            );
          }
        }
      } catch (err) {
        error("Kategoriler yüklenirken bir hata oluştu.");
        // Hata durumunda boş kategori listesi
        setCategories([{ slug: "kategori-yok", name: "Kategori Yok" }]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [error]);

  const handleSelectionChange = (e) => {
    onChange(e.target.value);
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2">
        <Spinner size="sm" />
        <span>Kategoriler yükleniyor...</span>
      </div>
    );
  }

  return (
    <Select
      label="Kategori Seç"
      placeholder="Kategori seçiniz"
      selectedKeys={selectedCategory ? [selectedCategory] : []}
      onChange={handleSelectionChange}
      className={className}
      isInvalid={isInvalid}
      errorMessage={isInvalid ? "Kategori seçimi zorunludur" : ""}
      popoverProps={{
        classNames: {
          content: "min-w-[280px]",
        },
      }}
      listboxProps={{
        itemClasses: {
          base: "py-2 px-3",
        },
      }}
    >
      {categories.map((category) => (
        <SelectItem
          key={category.slug}
          value={category.slug}
          textValue={category.name}
        >
          <div className="flex items-center gap-2">
            <span className="text-sm">{category.name}</span>
          </div>
        </SelectItem>
      ))}
    </Select>
  );
};

export default CategorySelector;
