import React, { useEffect, useMemo, useState, useRef } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Button,
  Pagination,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Tooltip,
} from "@nextui-org/react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchPosts,
  clearState,
} from "../../../../app/features/blogs/postsSlice";
import TableCellContent from "./TableCellContent";
import { capitalize } from "../../../../utils/capitalize";
import { useNavigate } from "react-router-dom";
import { useFeedback } from "../../../../context/FeedbackContext";
import { Icon } from "@iconify/react";
import useScrollToTop from "../../../../hooks/useScrollToTop";
import { scrollToTop } from "../../../../utils/scrollHelpers";

const columns = [
  { name: "Başlık", uid: "title" },
  { name: "Yazar", uid: "author" },
  { name: "Kategori", uid: "category" },
  { name: "Durum", uid: "status" },
  { name: "Görüntülenme", uid: "views" },
  { name: "Oluşturulma Tarihi", uid: "createdAt" },
  { name: "Güncellenme Tarihi", uid: "updatedAt" },
  { name: "İşlemler", uid: "actions" },
];

const statusOptions = [
  { name: "yayında", uid: "yayında" },
  { name: "düzenleniyor", uid: "düzenleniyor" },
  { name: "arşivlenmiş", uid: "arşivlenmiş" },
  { name: "taslak", uid: "taslak" },
];

const BlogsTable = () => {
  const dispatch = useDispatch();
  const { posts, status, error, isError, errorMessage, pagination } =
    useSelector((state) => state.posts);
  const { success, error: showError } = useFeedback();
  // filtreleme işlemleri
  const [filterValue, setFilterValue] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortDescriptor, setSortDescriptor] = useState({
    column: "createdAt",
    direction: "descending",
  });
  const [page, setPage] = useState(1);
  const limit = 20;
  const navigate = useNavigate();
  const errorShownRef = useRef(false);

  // Page değiştiğinde sayfayı en üste kaydır
  useScrollToTop(page, { behavior: "auto", delay: 100 });

  // Postları getirme
  useEffect(() => {
    dispatch(fetchPosts({ page, limit }));
  }, [dispatch, page, limit]);

  // Hata mesajı varsa bildirim göster
  useEffect(() => {
    if (isError && errorMessage && !errorShownRef.current) {
      showError(errorMessage);
      errorShownRef.current = true;
      setTimeout(() => {
        dispatch(clearState());
        errorShownRef.current = false;
      }, 3000);
    }
  }, [isError, errorMessage, showError, dispatch]);

  const filteredBlogs = useMemo(() => {
    let filtered = Array.isArray(posts) ? [...posts] : [];
    if (filterValue) {
      filtered = filtered.filter((post) =>
        post.title.toLowerCase().includes(filterValue.toLowerCase())
      );
    }
    if (statusFilter !== "all") {
      filtered = filtered.filter((post) => post.status === statusFilter);
    }
    return filtered;
  }, [posts, filterValue, statusFilter]);

  const sortedBlogs = useMemo(() => {
    if (!filteredBlogs.length) return [];

    return [...filteredBlogs].sort((a, b) => {
      const aVal = a[sortDescriptor.column];
      const bVal = b[sortDescriptor.column];
      if (aVal < bVal) return sortDescriptor.direction === "ascending" ? -1 : 1;
      if (aVal > bVal) return sortDescriptor.direction === "ascending" ? 1 : -1;
      return 0;
    });
  }, [filteredBlogs, sortDescriptor]);

  const handleSortChange = (descriptor) => {
    setSortDescriptor(descriptor);
  };

  const handleFilterChange = (e) => {
    setFilterValue(e.target.value);
    setPage(1);
  };

  const handleStatusFilterChange = (selection) => {
    const selected = Array.from(selection)[0];
    setStatusFilter(selected === "all" ? "all" : selected);
    setPage(1);
  };

  const handlePageChange = (newPage) => {
    // Önce sayfayı tam olarak en üste kaydır, sonra sayfa değişimini gerçekleştir
    scrollToTop({ behavior: "instant", delay: 0 });
    setPage(newPage);
  };

  const handleAddPostClick = () => {
    navigate("/dashboard/post/new");
  };

  const handleRefresh = () => {
    dispatch(fetchPosts({ page, limit }));
    success("Postlar yenilendi.");
  };

  // Clear filters function
  const clearFilters = () => {
    setFilterValue("");
    setStatusFilter("all");
    setPage(1);
  };

  // Veri yükleme durumunda veya hata durumunda içerik
  const renderContent = () => {
    if (status === "loading") {
      return (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="ml-2">Yükleniyor...</span>
        </div>
      );
    }

    // Filtre uygulandığında veya uygulanmadığında pagination gösterme mantığı
    const isFiltering = filterValue || statusFilter !== "all";
    const paginationInfo = isFiltering
      ? {
          // Filtreleme yapılıyorsa, toplam filtrelenmiş sonuç sayısı üzerinden sayfalama
          totalPages: Math.max(1, Math.ceil(sortedBlogs.length / limit)),
        }
      : pagination;

    return (
      <>
        <div>
          <Table
            aria-label="Blogs Table"
            sortDescriptor={sortDescriptor}
            onSortChange={handleSortChange}
            isStriped
            classNames={{
              wrapper: "shadow-sm",
              base: "overflow-hidden",
              th: "text-xs sm:text-sm whitespace-nowrap bg-default-100",
              td: "text-xs sm:text-sm",
            }}
          >
            <TableHeader columns={columns}>
              {(column) => (
                <TableColumn
                  key={column.uid}
                  allowsSorting
                  className={
                    column.uid === "actions" ? "text-right w-[80px]" : ""
                  }
                >
                  {column.name}
                </TableColumn>
              )}
            </TableHeader>
            <TableBody emptyContent={"Görüntülenecek post bulunamadı."}>
              {sortedBlogs.map((post, index) => (
                <TableRow key={post._id || `row-${index}`}>
                  {columns.map((column) => (
                    <TableCell
                      key={`${post._id || `row-${index}`}-${column.uid}`}
                      className={
                        column.uid === "title" ? "max-w-[180px] truncate" : ""
                      }
                    >
                      <TableCellContent posts={post} columnKey={column.uid} />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination her zaman gösterilir, ancak filtreleme durumuna göre farklı değerlerle */}
        {paginationInfo && paginationInfo.totalPages > 1 && (
          <div className="flex justify-center sm:justify-between align-center items-center mt-4 flex-wrap gap-2">
            <Pagination
              total={paginationInfo.totalPages}
              initialPage={1}
              page={isFiltering ? 1 : page} // Filtreleme durumunda hep ilk sayfa gösterilir
              onChange={isFiltering ? undefined : handlePageChange} // Filtreleme durumunda sayfa değişimine izin verilmez
              size="sm"
              showControls
              isDisabled={isFiltering} // Filtreleme durumunda pagination devre dışı bırakılır
              className="mx-auto sm:mx-0"
            />
            {isFiltering && (
              <span className="text-xs text-gray-500 ml-2">
                Filtreleme yaparken sayfalama devre dışıdır. Sayfaları görmek
                için filtreleri temizleyin.
              </span>
            )}
          </div>
        )}
      </>
    );
  };

  return (
    <div className="p-3 sm:p-6 md:p-8 w-full">
      <div className="flex flex-wrap mb-3 gap-2 sm:gap-4">
        <Input
          clearable
          placeholder="Başlık ile ara..."
          value={filterValue}
          onChange={handleFilterChange}
          size="sm"
          startContent={<Icon icon="mdi:magnify" width="16" />}
          className="min-w-[200px] flex-1 max-w-md"
        />
        <Dropdown>
          <DropdownTrigger>
            <Button
              size="sm"
              color="primary"
              className="whitespace-nowrap min-w-0"
            >
              <Icon icon="mdi:filter-variant" className="block sm:hidden" />
              <span className="hidden sm:block">
                Durum:{" "}
                {statusFilter === "all" ? "Tümü" : capitalize(statusFilter)}
              </span>
            </Button>
          </DropdownTrigger>
          <DropdownMenu
            disallowEmptySelection
            aria-label="Durum Filtreleri"
            selectionMode="single"
            selectedKeys={
              statusFilter !== "all"
                ? new Set([statusFilter])
                : new Set(["all"])
            }
            onSelectionChange={handleStatusFilterChange}
          >
            <DropdownItem key="all">Tümü</DropdownItem>
            {statusOptions.map((status) => (
              <DropdownItem key={status.uid}>
                {capitalize(status.name)}
              </DropdownItem>
            ))}
          </DropdownMenu>
        </Dropdown>
        <div className="flex items-center gap-1 sm:gap-2 ml-auto">
          {(filterValue || statusFilter !== "all") && (
            <Button
              color="default"
              variant="flat"
              size="sm"
              onPress={clearFilters}
              startContent={<Icon icon="mdi:filter-off" width="18" />}
              className="min-w-0"
            >
              Filtreleri Temizle
            </Button>
          )}
          <Tooltip content="Yenile">
            <Button
              color="default"
              variant="flat"
              size="sm"
              isIconOnly
              onPress={handleRefresh}
              className="min-w-0"
            >
              <Icon icon="mdi:refresh" width="18" />
            </Button>
          </Tooltip>
          <Tooltip content="Yeni post ekle">
            <Button
              color="primary"
              variant="flat"
              size="sm"
              onPress={handleAddPostClick}
              className="min-w-0 whitespace-nowrap"
              startContent={
                <Icon icon="mdi:plus" width="18" className="block sm:hidden" />
              }
            >
              <span className="hidden sm:block">Yeni ekle</span>
              <span className="block sm:hidden">Ekle</span>
            </Button>
          </Tooltip>
        </div>
      </div>

      <div className="overflow-x-auto overflow-y-hidden">{renderContent()}</div>

      {/* Filtreleme sonucu bilgisi */}
      {(filterValue || statusFilter !== "all") && (
        <div className="mt-3 text-sm text-gray-500 text-center">
          <span>
            {filterValue ? `"${filterValue}" araması için ` : ""}
            {statusFilter !== "all"
              ? `"${capitalize(statusFilter)}" durumunda `
              : ""}
            {sortedBlogs.length} sonuç bulundu
          </span>
        </div>
      )}
    </div>
  );
};

export default BlogsTable;
