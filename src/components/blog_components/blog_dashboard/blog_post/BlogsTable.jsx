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

const columns = [
  { name: "Başlık", uid: "title" },
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
  const { posts, status, error, total, isError, errorMessage } = useSelector(
    (state) => state.posts
  );
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

  const handleAddPostClick = () => {
    navigate("/dashboard/new-post");
  };

  const handleRefresh = () => {
    dispatch(fetchPosts({ page, limit }));
    success("Postlar yenilendi.");
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

    return (
      <div>
        <Table
          aria-label="Blogs Table"
          sortDescriptor={sortDescriptor}
          onSortChange={handleSortChange}
          striped
        >
          <TableHeader columns={columns}>
            {(column) => (
              <TableColumn key={column.uid} allowsSorting>
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
                  >
                    <TableCellContent posts={post} columnKey={column.uid} />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="flex justify-between align-center items-center mt-4">
          <Pagination
            total={Math.ceil((total || 0) / limit)}
            initialPage={1}
            page={page}
            onChange={(p) => setPage(p)}
            size="sm"
          />
        </div>
      </div>
    );
  };

  return (
    <div className="p-12 w-full">
      <div className="flex mb-4 gap-6">
        <Input
          clearable
          placeholder="Başlık ile ara..."
          value={filterValue}
          onChange={handleFilterChange}
          size="sm"
          className="flex-initial w-[40%]"
        />
        <Dropdown>
          <DropdownTrigger>
            <Button size="sm" color="primary">
              Durum:{" "}
              {statusFilter === "all" ? "Tümü" : capitalize(statusFilter)}
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
        <div className="flex items-center gap-2">
          <Button
            color="default"
            variant="flat"
            size="sm"
            onClick={handleRefresh}
          >
            Yenile
          </Button>
          <Button
            color="primary"
            variant="flat"
            size="sm"
            onClick={handleAddPostClick}
          >
            Yeni ekle
          </Button>
        </div>
      </div>

      {renderContent()}
    </div>
  );
};

export default BlogsTable;
