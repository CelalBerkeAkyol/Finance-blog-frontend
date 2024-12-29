// src/features/blogs/BlogsTable.jsx
import React, { useEffect, useMemo } from "react";
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
import { fetchBlogs } from "../../../../app/features/blogs/blogSlice";
import TableCellContent from "./TableCellContent";

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

const capitalize = (s) => {
  return s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : "";
};

const BlogsTable = () => {
  const dispatch = useDispatch();
  const { blogs, status, error, pagination, count, total } = useSelector(
    (state) => state.blogs
  );

  // Local state
  const [filterValue, setFilterValue] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("all");
  const [rowsPerPage] = React.useState(20); // Sabit 20 satır
  const [sortDescriptor, setSortDescriptor] = React.useState({
    column: "createdAt",
    direction: "ascending",
  });
  const [page, setPage] = React.useState(1);

  useEffect(() => {
    dispatch(fetchBlogs({ page, limit: rowsPerPage }));
  }, [dispatch, page, rowsPerPage]);

  const filteredBlogs = useMemo(() => {
    let filtered = [...blogs];
    if (filterValue) {
      filtered = filtered.filter((blog) =>
        blog.title.toLowerCase().includes(filterValue.toLowerCase())
      );
    }
    if (statusFilter !== "all") {
      // Eğer çoklu seçim yapılıyorsa:
      // if (Array.isArray(statusFilter) && statusFilter.length > 0) {
      //   filtered = filtered.filter((blog) => statusFilter.includes(blog.status));
      // }
      // Tekli seçim için:
      filtered = filtered.filter((blog) => blog.status === statusFilter);
    }
    return filtered;
  }, [blogs, filterValue, statusFilter]);

  const sortedBlogs = useMemo(() => {
    const sorted = [...filteredBlogs].sort((a, b) => {
      const aVal = a[sortDescriptor.column];
      const bVal = b[sortDescriptor.column];
      if (aVal < bVal) return sortDescriptor.direction === "ascending" ? -1 : 1;
      if (aVal > bVal) return sortDescriptor.direction === "ascending" ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [filteredBlogs, sortDescriptor]);

  const handleSortChange = (descriptor) => {
    setSortDescriptor(descriptor);
  };

  const handleFilterChange = (e) => {
    setFilterValue(e.target.value);
    setPage(1);
  };

  // Durum filtresi için seçim değişikliği işlevi
  const handleStatusFilterChange = (selection) => {
    // Tekli seçim için:
    const selected = Array.from(selection)[0]; // Set'ten ilk elemanı al
    setStatusFilter(selected === "all" ? "all" : selected);
    setPage(1);

    // Çoklu seçim için:
    // setStatusFilter(Array.from(selection));
    // setPage(1);
  };

  if (status === "loading") return <div>Yükleniyor...</div>;
  if (status === "failed") return <div>Hata: {error}</div>;

  return (
    <div className="p-4 w-full">
      {/* Üst İçerik */}
      <div className="flex justify-between mb-4">
        <Input
          clearable
          placeholder="Başlık ile ara..."
          value={filterValue}
          onChange={handleFilterChange}
          size="sm"
          css={{ width: "300px" }}
        />
        <Dropdown>
          <DropdownTrigger>
            <Button size="sm">
              Durum:{" "}
              {statusFilter === "all" ? "Tümü" : capitalize(statusFilter)}
            </Button>
          </DropdownTrigger>
          <DropdownMenu
            disallowEmptySelection
            aria-label="Durum Filtreleri"
            // Tekli seçim için:
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
          <Button size="sm">Yeni Ekle</Button>
        </div>
      </div>

      {/* Tablo */}
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
        <TableBody>
          {sortedBlogs.map((blog) => (
            <TableRow key={blog._id}>
              {columns.map((column) => (
                <TableCell key={`${blog._id}-${column.uid}`}>
                  <TableCellContent blog={blog} columnKey={column.uid} />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Alt İçerik */}
      <div className="flex justify-between items-center mt-4">
        <span className="text-sm text-gray-500">Toplam {total} blog</span>
        <Pagination
          total={Math.ceil(total / rowsPerPage)}
          initialPage={1}
          page={page}
          onChange={(p) => setPage(p)}
          size="sm"
        />
      </div>
    </div>
  );
};

export default BlogsTable;
