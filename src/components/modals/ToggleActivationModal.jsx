import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@nextui-org/react";

const ToggleActivationModal = ({
  isOpen,
  onClose,
  selectedUser,
  handleToggleActivation,
  isLoading,
}) => {
  if (!selectedUser) return null;

  const isActivating = !selectedUser.isActive;
  const actionText = isActivating ? "aktifleştirmek" : "deaktif etmek";
  const buttonText = isActivating ? "Aktifleştir" : "Deaktif Et";
  const buttonColor = isActivating
    ? "bg-green-500 hover:bg-green-600"
    : "bg-orange-500 hover:bg-orange-600";
  const headerText = isActivating
    ? "Kullanıcı Aktivasyon"
    : "Kullanıcı Deaktivasyon";

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        {(onCloseModal) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              {headerText}
            </ModalHeader>
            <ModalBody>
              <p>
                <b>{selectedUser.userName}</b> ({selectedUser.email})
                kullanıcısını {actionText} istediğinize emin misiniz?
              </p>
              {!isActivating && (
                <p className="text-orange-600 mt-2">
                  Not: Deaktif edilen kullanıcı sisteme giriş yapamayacaktır.
                </p>
              )}
            </ModalBody>
            <ModalFooter>
              <Button variant="flat" onPress={onCloseModal}>
                İptal
              </Button>
              <Button
                className={`text-white ${buttonColor}`}
                onPress={handleToggleActivation}
                isLoading={isLoading}
              >
                {buttonText}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ToggleActivationModal;
