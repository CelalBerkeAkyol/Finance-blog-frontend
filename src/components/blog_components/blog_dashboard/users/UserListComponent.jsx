import React, { useEffect, useState } from "react";
import axios from "../../../../api";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Tooltip,
  Pagination,
  Input,
  Button,
  Spinner,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react";
import { Icon } from "@iconify/react";

const UserListComponent = () => {
  // State tanımlamaları
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Rol değiştirme modalı için state'ler
  const [roleModalOpen, setRoleModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState("");
  const [roleUpdateLoading, setRoleUpdateLoading] = useState(false);
  const [roleUpdateError, setRoleUpdateError] = useState(null);

  // Pagination state
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  // Search state
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);

  // Kullanıcıları getir
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get("/user", { withCredentials: true });
      console.info("Kullanıcılar başarıyla alındı:", response.data);
      setUsers(response.data.data || []);
    } catch (err) {
      console.error("Kullanıcıları getirme hatası:", err);
      setError(
        err.response?.data?.message ||
          "Kullanıcılar yüklenirken bir hata oluştu"
      );
    } finally {
      setLoading(false);
    }
  };

  // Kullanıcı silme işlemi
  const handleDeleteUser = async () => {
    if (!selectedUser) return;

    try {
      setDeleteLoading(true);
      setDeleteError(null);

      await axios.delete(`/user/${selectedUser._id}`, {
        withCredentials: true,
      });
      console.info(`Kullanıcı başarıyla silindi: ${selectedUser._id}`);

      // Kullanıcı listesini güncelle
      setUsers(users.filter((user) => user._id !== selectedUser._id));

      // Modal'ı kapat
      onClose();
    } catch (err) {
      console.error("Kullanıcı silme hatası:", err);
      setDeleteError(
        err.response?.data?.message || "Kullanıcı silinirken bir hata oluştu"
      );
    } finally {
      setDeleteLoading(false);
    }
  };

  // Kullanıcı rolünü güncelleme işlemi
  const handleUpdateRole = async () => {
    if (!selectedUser || !selectedRole) return;

    try {
      setRoleUpdateLoading(true);
      setRoleUpdateError(null);

      const response = await axios.patch(
        `/user/${selectedUser._id}/role`,
        { role: selectedRole },
        { withCredentials: true }
      );

      console.info(
        `Kullanıcı rolü başarıyla güncellendi: ${selectedUser._id}, Yeni rol: ${selectedRole}`
      );

      // Kullanıcı listesini güncelle
      setUsers(
        users.map((user) =>
          user._id === selectedUser._id ? { ...user, role: selectedRole } : user
        )
      );

      // Modal'ı kapat
      setRoleModalOpen(false);
    } catch (err) {
      console.error("Kullanıcı rol güncelleme hatası:", err);
      setRoleUpdateError(
        err.response?.data?.message ||
          "Kullanıcı rolü güncellenirken bir hata oluştu"
      );
    } finally {
      setRoleUpdateLoading(false);
    }
  };

  // Silme modalını aç
  const openDeleteModal = (user) => {
    setSelectedUser(user);
    setDeleteError(null);
    onOpen();
  };

  // Rol değiştirme modalını aç
  const openRoleModal = (user) => {
    setSelectedUser(user);
    setSelectedRole(user.role || "user");
    setRoleUpdateError(null);
    setRoleModalOpen(true);
  };

  // Component mount olduğunda kullanıcıları getir
  useEffect(() => {
    fetchUsers();
  }, []);

  // Arama terimi veya kullanıcı listesi değiştiğinde filtreleme yap
  useEffect(() => {
    if (users && users.length > 0) {
      const filtered = users.filter(
        (user) =>
          user.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.role?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers([]);
    }
  }, [users, searchTerm]);

  // Calculate pagination
  const pages = Math.ceil(filteredUsers.length / rowsPerPage);
  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return filteredUsers.slice(start, end);
  }, [page, filteredUsers, rowsPerPage]);

  // Handle search
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setPage(1); // Reset to first page on search
  };

  // Render user role with appropriate color
  const renderRole = (role) => {
    let color;
    switch (role?.toLowerCase()) {
      case "admin":
        color = "danger";
        break;
      case "author":
        color = "warning";
        break;
      default:
        color = "primary";
    }
    return (
      <Chip color={color} size="sm" variant="flat">
        {role || "User"}
      </Chip>
    );
  };

  // Render user status
  const renderStatus = (isVerified) => {
    return (
      <Chip color={isVerified ? "success" : "default"} size="sm" variant="flat">
        {isVerified ? "Verified" : "Not Verified"}
      </Chip>
    );
  };

  // Render actions column
  const renderActions = (user) => {
    return (
      <div className="flex gap-2">
        <Tooltip content="Change Role">
          <Button
            isIconOnly
            size="sm"
            variant="light"
            onClick={() => openRoleModal(user)}
          >
            <Icon icon="mdi:account-convert" className="text-warning" />
          </Button>
        </Tooltip>
        <Tooltip content="Delete User">
          <Button
            isIconOnly
            size="sm"
            variant="light"
            onClick={() => openDeleteModal(user)}
          >
            <Icon icon="mdi:delete" className="text-danger" />
          </Button>
        </Tooltip>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" label="Kullanıcılar yükleniyor..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64 text-danger">
        <p>Hata: {error}</p>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Kullanıcı Listesi</h2>
        <div className="flex gap-2">
          <Input
            placeholder="Kullanıcı ara..."
            value={searchTerm}
            onChange={handleSearch}
            startContent={<Icon icon="mdi:magnify" />}
            className="w-64"
          />
          <Button
            color="primary"
            startContent={<Icon icon="mdi:refresh" />}
            onClick={fetchUsers}
          >
            Yenile
          </Button>
        </div>
      </div>

      <Table
        aria-label="Kullanıcı listesi"
        bottomContent={
          pages > 0 ? (
            <div className="flex w-full justify-center">
              <Pagination
                isCompact
                showControls
                showShadow
                color="primary"
                page={page}
                total={pages}
                onChange={(page) => setPage(page)}
              />
            </div>
          ) : null
        }
      >
        <TableHeader>
          <TableColumn>KULLANICI ADI</TableColumn>
          <TableColumn>E-POSTA</TableColumn>
          <TableColumn>ROL</TableColumn>
          <TableColumn>DURUM</TableColumn>
          <TableColumn>KAYIT TARİHİ</TableColumn>
          <TableColumn>İŞLEMLER</TableColumn>
        </TableHeader>
        <TableBody
          items={items}
          emptyContent={"Kullanıcı bulunamadı."}
          loadingContent={<Spinner />}
        >
          {(item) => (
            <TableRow key={item._id}>
              <TableCell>{item.userName}</TableCell>
              <TableCell>{item.email}</TableCell>
              <TableCell>{renderRole(item.role)}</TableCell>
              <TableCell>{renderStatus(item.isVerified)}</TableCell>
              <TableCell>
                {new Date(item.createdAt).toLocaleDateString("tr-TR")}
              </TableCell>
              <TableCell>{renderActions(item)}</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Silme Onay Modalı */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Kullanıcı Silme Onayı
              </ModalHeader>
              <ModalBody>
                {selectedUser && (
                  <p>
                    <b>{selectedUser.userName}</b> ({selectedUser.email})
                    kullanıcısını silmek istediğinize emin misiniz? Bu işlem
                    geri alınamaz.
                  </p>
                )}
                {deleteError && <p className="text-danger">{deleteError}</p>}
              </ModalBody>
              <ModalFooter>
                <Button variant="flat" onPress={onClose}>
                  İptal
                </Button>
                <Button
                  color="danger"
                  onPress={handleDeleteUser}
                  isLoading={deleteLoading}
                >
                  Sil
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Rol Değiştirme Modalı */}
      <Modal isOpen={roleModalOpen} onClose={() => setRoleModalOpen(false)}>
        <ModalContent>
          {(onClose) => (
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
                          setSelectedRole(Array.from(keys)[0])
                        }
                      >
                        <DropdownItem key="user">User</DropdownItem>
                        <DropdownItem key="author">Author</DropdownItem>
                        <DropdownItem key="admin">Admin</DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                  </div>
                )}
                {roleUpdateError && (
                  <p className="text-danger">{roleUpdateError}</p>
                )}
              </ModalBody>
              <ModalFooter>
                <Button variant="flat" onPress={() => setRoleModalOpen(false)}>
                  İptal
                </Button>
                <Button
                  color="primary"
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
    </div>
  );
};

export default UserListComponent;
