import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@nextui-org/react";

const HardDeleteUserModal = ({
  isOpen,
  onClose,
  selectedUser,
  handleHardDeleteUser,
  isLoading,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        {(onCloseModal) => (
          <>
            <ModalHeader className="flex flex-col gap-1 text-red-600">
              Kullanıcıyı Kalıcı Olarak Silme
            </ModalHeader>
            <ModalBody>
              {selectedUser && (
                <div className="space-y-2">
                  <p className="font-semibold text-danger">
                    DİKKAT: Bu işlem geri alınamaz!
                  </p>
                  <p>
                    <b>{selectedUser.userName}</b> ({selectedUser.email})
                    kullanıcısını veritabanından kalıcı olarak silmek
                    istediğinize emin misiniz?
                  </p>
                  <p className="text-red-500">
                    Bu işlem sonucunda kullanıcının tüm verileri silinecek ve
                    geri getirilemeyecektir.
                  </p>
                </div>
              )}
            </ModalBody>
            <ModalFooter>
              <Button variant="flat" onPress={onCloseModal}>
                İptal
              </Button>
              <Button
                className="bg-red-600 text-white hover:bg-red-700"
                onPress={handleHardDeleteUser}
                isLoading={isLoading}
              >
                Kalıcı Olarak Sil
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default HardDeleteUserModal;
