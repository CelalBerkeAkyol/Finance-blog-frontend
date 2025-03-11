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

  // Silme modalını aç
  const openDeleteModal = (user) => {
    setSelectedUser(user);
    setDeleteError(null);
    onOpen();
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
      case "editor":
        color = "warning";
        break;
      default:
        color = "primary";
    }
    return (
      <Chip color={color} size="sm" variant="flat">
        {role || "HATA"}
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
        <Tooltip content="Edit User">
          <Button isIconOnly size="sm" variant="light">
            <Icon icon="mdi:pencil" className="text-default-500" />
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
    </div>
  );
};

export default UserListComponent;
