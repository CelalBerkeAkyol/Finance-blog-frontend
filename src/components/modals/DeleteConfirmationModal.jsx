import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@nextui-org/react";
import { Icon } from "@iconify/react";

const DeleteConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Silme Onayı",
  message = "Bu öğeyi silmek istediğinize emin misiniz?",
  confirmLabel = "Sil",
  cancelLabel = "İptal",
  isLoading = false,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">{title}</ModalHeader>
            <ModalBody>
              <div className="flex items-start">
                <div className="mr-4 text-danger">
                  <Icon icon="mdi:alert-circle" width={24} />
                </div>
                <p>{message}</p>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button variant="flat" onPress={onClose} auto>
                {cancelLabel}
              </Button>
              <Button
                color="danger"
                onPress={() => {
                  onConfirm();
                }}
                isLoading={isLoading}
                auto
              >
                {confirmLabel}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default DeleteConfirmationModal;
