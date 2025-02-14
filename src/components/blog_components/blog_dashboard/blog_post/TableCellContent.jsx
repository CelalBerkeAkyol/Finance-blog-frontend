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
    console.info(`TableCellContent: Post ${posts._id} görüntüleniyor.`);
    navigate(`/blog/post/${posts._id}`);
  };

  const handleEdit = () => {
    console.info(
      `TableCellContent: Post ${posts._id} düzenleme sayfasına yönlendiriliyor.`
    );
    navigate(`/dashboard/post/edit/${posts._id}`);
  };

  const handleDelete = () => {
    if (window.confirm("Bu postu silmek istediğinize emin misiniz?")) {
      console.info(
        `TableCellContent: Post ${posts._id} silme işlemi başlatılıyor.`
      );
      dispatch(deletePost(posts._id))
        .then((result) => {
          if (result.meta.requestStatus === "fulfilled") {
            console.info("TableCellContent: Post başarıyla silindi!");
          } else {
            console.error(
              "TableCellContent: Post silinirken hata oluştu:",
              result.payload
            );
          }
        })
        .catch((error) =>
          console.error("TableCellContent: Silme işlemi hata verdi:", error)
        );
    }
  };

  switch (columnKey) {
    case "title":
      return <span>{cellValue}</span>;
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
