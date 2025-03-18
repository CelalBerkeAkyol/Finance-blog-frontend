import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@nextui-org/react";

const DeleteUserModal = ({
  isOpen,
  onClose,
  selectedUser,
  handleDeleteUser,
  isLoading,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        {(onCloseModal) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Kullanıcı Silme Onayı
            </ModalHeader>
            <ModalBody>
              {selectedUser && (
                <p>
                  <b>{selectedUser.userName}</b> ({selectedUser.email})
                  kullanıcısını silmek istediğinize emin misiniz? Bu işlem geri
                  alınamaz.
                </p>
              )}
            </ModalBody>
            <ModalFooter>
              <Button variant="flat" onPress={onCloseModal}>
                İptal
              </Button>
              <Button
                color="danger"
                onPress={handleDeleteUser}
                isLoading={isLoading}
              >
                Sil
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default DeleteUserModal;
