import React from "react";
import {
  Chip,
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/react";
import { capitalize } from "../../../../utils/capitalize";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  removePost,
  deletePost,
} from "../../../../app/features/blogs/postsSlice";

const statusColorMap = {
  yayında: "success",
  düzenleniyor: "warning",
  arşivlenmiş: "danger",
  taslak: "warning",
};

const TableCellContent = ({ posts, columnKey }) => {
  const cellValue = posts[columnKey];
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleView = () => {
    navigate(`/blog/post/${posts._id}`);
  };

  const handleEdit = () => {
    navigate(`/dashboard/post/edit/${posts._id}`);
  };

  const handleDelete = () => {
    onOpen(); // Silme onayı için modal'ı aç
  };

  const confirmDelete = () => {
    console.info(
      `TableCellContent: Post ${posts._id} silme işlemi başlatılıyor.`
    );

    dispatch(deletePost(posts._id))
      .unwrap()
      .then(() => {
        dispatch(removePost(posts._id)); // API başarılı olursa Redux Store'dan kaldır
        onClose(); // Modal'ı kapat
      })
      .catch((error) => {
        console.error("TableCellContent: Silme işlemi hata verdi:", error);
        onClose(); // Modal'ı kapat
        // Hata mesajı Redux store'da zaten kaydedilecek ve BlogsTable tarafından gösterilecek
      });
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
        <>
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

          {/* Silme Onay Modalı */}
          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalContent>
              <ModalHeader className="flex flex-col gap-1">
                Post Silme Onayı
              </ModalHeader>
              <ModalBody>
                <p>
                  "{posts.title}" başlıklı postu silmek istediğinize emin
                  misiniz?
                </p>
                <p className="text-sm text-gray-500">Bu işlem geri alınamaz.</p>
              </ModalBody>
              <ModalFooter>
                <Button color="default" variant="light" onPress={onClose}>
                  İptal
                </Button>
                <Button color="danger" onPress={confirmDelete}>
                  Sil
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </>
      );
    default:
      return cellValue;
  }
};

export default TableCellContent;
