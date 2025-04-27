import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react";
import { Icon } from "@iconify/react";

const ChangeRoleModal = ({
  roleModalOpen,
  onClose,
  selectedUser,
  selectedRole,
  setSelectedRole,
  handleUpdateRole,
  roleUpdateLoading,
}) => {
  return (
    <Modal isOpen={roleModalOpen} onClose={onClose}>
      <ModalContent>
        {(onCloseModal) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              Kullanıcı Rolünü Değiştir
            </ModalHeader>
            <ModalBody>
              {selectedUser && (
                <div className="flex flex-col gap-4">
                  <p>
                    <b>{selectedUser.userName}</b> ({selectedUser.email})
                    kullanıcısının rolünü değiştir:
                  </p>
                  <Dropdown>
                    <DropdownTrigger>
                      <Button
                        variant="bordered"
                        className="w-full justify-between"
                        endContent={<Icon icon="mdi:chevron-down" />}
                      >
                        {selectedRole || "Rol seçin"}
                      </Button>
                    </DropdownTrigger>
                    <DropdownMenu
                      aria-label="Roller"
                      selectionMode="single"
                      selectedKeys={[selectedRole]}
                      onSelectionChange={(keys) =>
                        setSelectedRole([...keys][0])
                      }
                    >
                      <DropdownItem key="user">User</DropdownItem>
                      <DropdownItem key="author">Author</DropdownItem>
                      <DropdownItem key="admin">Admin</DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                </div>
              )}
            </ModalBody>
            <ModalFooter>
              <Button variant="flat" onPress={onCloseModal}>
                İptal
              </Button>
              <Button
                className="bg-primary text-white hover:bg-secondary"
                onPress={handleUpdateRole}
                isLoading={roleUpdateLoading}
              >
                Güncelle
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ChangeRoleModal;
