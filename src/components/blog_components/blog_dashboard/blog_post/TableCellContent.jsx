// src/components/blog_components/blog_dashboard/blog_post/TableCellContent.jsx
import React from "react";
import {
  Chip,
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react";
import { capitalize } from "../../../../utils/capitalize";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { deletePost } from "../../../../app/features/blogs/postsSlice";

const statusColorMap = {
  yayında: "success",
  düzenleniyor: "warning",
  arşivlenmiş: "secondary",
  taslak: "secondary",
};

const TableCellContent = ({ posts, columnKey }) => {
  const cellValue = posts[columnKey];
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleView = () => {
    navigate(`/blog/post/${posts._id}`);
  };

  const handleEdit = () => {
    navigate(`/blog-admin/post/edit/${posts._id}`);
  };

  const handleDelete = () => {
    if (window.confirm("Bu postu silmek istediğinize emin misiniz?")) {
      dispatch(deletePost(posts._id))
        .then((result) => {
          if (result.meta.requestStatus === "fulfilled") {
            console.log("Post başarıyla silindi!");
          } else {
            console.error("Post silinirken hata oluştu:", result.payload);
          }
        })
        .catch((error) => console.error("Silme işlemi hata verdi:", error));
    }
  };
  switch (columnKey) {
    case "title":
      return <span>{cellValue}</span>; // sadece blog title dön
    case "status":
      return (
        <Chip
          color={statusColorMap[posts.status] || "default"}
          className="capitalize"
        >
          {capitalize(posts.status)}
        </Chip>
      );
    case "createdAt":
    case "updatedAt":
      return new Date(cellValue).toLocaleDateString();
    case "actions":
      return (
        <div className="relative flex justify-end items-center gap-2">
          <Dropdown>
            <DropdownTrigger>
              <Button isIconOnly radius="full" size="sm" variant="light">
                {/* Üç nokta sembolü */}
                <span>⋮</span>
              </Button>
            </DropdownTrigger>
            <DropdownMenu>
              <DropdownItem key={`view-${posts._id}`} onClick={handleView}>
                Görüntüle
              </DropdownItem>
              <DropdownItem key={`edit-${posts._id}`} onClick={handleEdit}>
                Düzenle
              </DropdownItem>
              <DropdownItem
                key={`delete-${posts._id}`}
                color="danger"
                onClick={handleDelete}
              >
                Sil
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      );
    default:
      return cellValue;
  }
};

export default TableCellContent;
