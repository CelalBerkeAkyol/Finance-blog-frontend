import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Spinner,
  Input,
  Chip,
  Tooltip,
  Pagination,
} from "@nextui-org/react";
import { Icon } from "@iconify/react";
import axios from "../../api";
import { useFeedback } from "../../context/FeedbackContext";
import BlogSidebarComponent from "../../components/blog_components/blog_dashboard/BlogSidebarComponent";
import CategoryFormModal from "../../components/blog_components/blog_dashboard/category/CategoryFormModal";
import DeleteConfirmationModal from "../../components/modals/DeleteConfirmationModal";

function CategoriesManagementPage() {
  const { success, error } = useFeedback();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  // Kategorileri getir
  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/category/categories-with-details");
      if (response.data.success) {
        setCategories(response.data.data);
      } else {
        error(response.data.message || "Kategoriler getirilemedi.");
      }
    } catch (err) {
      error(
        err.response?.data?.message ||
          "Kategoriler yüklenirken bir hata oluştu."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Modal işlevleri
  const handleAdd = () => {
    setSelectedCategory(null);
    setShowModal(true);
  };

  const handleEdit = (category) => {
    setSelectedCategory(category);
    setShowModal(true);
  };

  const handleDelete = (category) => {
    setSelectedCategory(category);
    setShowDeleteModal(true);
  };

  const handleSaveCategory = async (categoryData) => {
    try {
      if (selectedCategory) {
        // Kategori güncelleme
        const response = await axios.put(
          `/category/admin/${selectedCategory._id}`,
          categoryData
        );
        if (response.data.success) {
          success("Kategori başarıyla güncellendi.");
          fetchCategories();
        }
      } else {
        // Yeni kategori ekleme
        const response = await axios.post("/category/admin", categoryData);
        if (response.data.success) {
          success("Kategori başarıyla oluşturuldu.");
          fetchCategories();
        }
      }
      setShowModal(false);
    } catch (err) {
      error(err.response?.data?.message || "İşlem sırasında bir hata oluştu.");
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      const response = await axios.delete(
        `/category/admin/${selectedCategory._id}`
      );
      if (response.data.success) {
        success("Kategori başarıyla silindi.");
        fetchCategories();
      }
      setShowDeleteModal(false);
    } catch (err) {
      error(
        err.response?.data?.message || "Kategori silinirken bir hata oluştu."
      );
    }
  };

  // Arama ve filtreleme
  const filteredCategories = categories.filter(
    (category) =>
      category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
      category.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination
  const pages = Math.ceil(filteredCategories.length / rowsPerPage);
  const paginatedCategories = filteredCategories.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  return (
    <div className="flex min-h-screen">
      <BlogSidebarComponent />

      <div className="flex-1 p-4 md:p-6">
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl md:text-2xl font-bold">Kategori Yönetimi</h1>
            <Button
              color="primary"
              startContent={<Icon icon="mdi:plus" />}
              onPress={handleAdd}
            >
              Yeni Kategori
            </Button>
          </div>

          <div className="flex justify-between items-center mb-4">
            <Input
              placeholder="Kategori ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              startContent={<Icon icon="mdi:magnify" />}
              className="max-w-sm"
            />
          </div>

          {loading ? (
            <div className="flex justify-center my-12">
              <Spinner size="lg" label="Kategoriler yükleniyor..." />
            </div>
          ) : (
            <>
              <Table
                aria-label="Kategoriler tablosu"
                bottomContent={
                  pages > 1 ? (
                    <div className="flex justify-center">
                      <Pagination
                        page={page}
                        total={pages}
                        onChange={setPage}
                        showControls
                      />
                    </div>
                  ) : null
                }
              >
                <TableHeader>
                  <TableColumn>KATEGORI</TableColumn>
                  <TableColumn>SLUG</TableColumn>
                  <TableColumn>AÇIKLAMA</TableColumn>
                  <TableColumn>DURUM</TableColumn>
                  <TableColumn width={150}>İŞLEMLER</TableColumn>
                </TableHeader>
                <TableBody
                  emptyContent="Kategori bulunamadı."
                  items={paginatedCategories}
                >
                  {(category) => (
                    <TableRow key={category._id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div
                            className={`p-2 rounded-lg ${
                              category.color || "bg-slate-600"
                            }`}
                          >
                            <Icon
                              icon={category.icon || "mdi:tag"}
                              className="text-white"
                            />
                          </div>
                          {category.name}
                        </div>
                      </TableCell>
                      <TableCell>{category.slug}</TableCell>
                      <TableCell>
                        <div
                          className="max-w-xs truncate"
                          title={category.description}
                        >
                          {category.description}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Chip
                          color={category.active ? "success" : "default"}
                          variant="flat"
                        >
                          {category.active ? "Aktif" : "Pasif"}
                        </Chip>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Tooltip content="Düzenle">
                            <Button
                              isIconOnly
                              size="sm"
                              variant="light"
                              onPress={() => handleEdit(category)}
                            >
                              <Icon icon="mdi:pencil" className="text-lg" />
                            </Button>
                          </Tooltip>
                          <Tooltip content="Sil">
                            <Button
                              isIconOnly
                              size="sm"
                              variant="light"
                              color="danger"
                              onPress={() => handleDelete(category)}
                            >
                              <Icon icon="mdi:delete" className="text-lg" />
                            </Button>
                          </Tooltip>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </>
          )}
        </div>
      </div>

      {/* Kategori Modal */}
      <CategoryFormModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleSaveCategory}
        category={selectedCategory}
      />

      {/* Silme Onay Modal */}
      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteConfirm}
        title="Kategori Silme"
        message={`"${selectedCategory?.name}" kategorisini silmek istediğinize emin misiniz?`}
        confirmLabel="Sil"
        cancelLabel="İptal"
      />
    </div>
  );
}

export default CategoriesManagementPage;
