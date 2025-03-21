import React, { useRef } from "react";
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
  Tooltip,
} from "@nextui-org/react";
import { capitalize } from "../../../../utils/capitalize";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  removePost,
  deletePost,
} from "../../../../app/features/blogs/postsSlice";
import { useFeedback } from "../../../../context/FeedbackContext";
import { Icon } from "@iconify/react";

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
  const { success, error: showError, showAlert } = useFeedback();
  const errorShownRef = useRef(false);

  const handleView = () => {
    navigate(`/blog/post/${posts._id}`);
  };

  const handleEdit = () => {
    navigate(`/dashboard/post/edit/${posts._id}`);
  };

  const handleDelete = () => {
    onOpen();
  };

  const confirmDelete = () => {
    onClose();
    dispatch(deletePost(posts._id))
      .unwrap()
      .then(() => {
        dispatch(removePost(posts._id));
        success(`"${posts.title}" başlıklı post başarıyla silindi.`);
      })
      .catch((err) => {
        showAlert({
          cpde: err?.code,
          title: "Yetki Hatası",
          message: "Bu içeriği sadece içerik sahibi veya admin silebilir.",
          type: "error",
        });

        errorShownRef.current = true;
        setTimeout(() => {
          errorShownRef.current = false;
        }, 2000);
      });
  };

  switch (columnKey) {
    case "title":
      return <span>{cellValue}</span>;
    case "author":
      return <span>{posts.author?.userName}</span>;
    case "status":
      return (
        <Chip
          color={statusColorMap[posts.status] || "default"}
          size="sm"
          variant="flat"
          className="capitalize text-xs max-w-[110px] truncate"
        >
          {capitalize(posts.status)}
        </Chip>
      );
    case "createdAt":
    case "updatedAt":
      return (
        <span className="text-xs whitespace-nowrap">
          {new Date(cellValue).toLocaleDateString()}
        </span>
      );
    case "actions":
      return (
        <>
          <div className="relative flex justify-end items-center gap-1">
            <Tooltip content="Görüntüle">
              <Button isIconOnly size="sm" variant="light" onClick={handleView}>
                <Icon icon="mdi:eye-outline" width="16" />
              </Button>
            </Tooltip>
            <Tooltip content="Düzenle">
              <Button isIconOnly size="sm" variant="light" onClick={handleEdit}>
                <Icon icon="mdi:pencil-outline" width="16" />
              </Button>
            </Tooltip>
            <Tooltip content="Sil" color="danger">
              <Button
                isIconOnly
                size="sm"
                variant="light"
                color="danger"
                onClick={handleDelete}
              >
                <Icon icon="mdi:trash-outline" width="16" />
              </Button>
            </Tooltip>
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
