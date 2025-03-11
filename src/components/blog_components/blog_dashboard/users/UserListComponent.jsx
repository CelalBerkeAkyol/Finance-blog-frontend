import React, { useState, useEffect, useMemo } from "react";
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
  useDisclosure,
} from "@nextui-org/react";
import { Icon } from "@iconify/react";
import useUsers from "../../../../hooks/useUsers";
import DeleteUserModal from "../../../modals/DeleteUserModal";
import ChangeRoleModal from "../../../modals/ChangeRoleModal";
import axios from "../../../../api";

const UserListComponent = () => {
  const {
    users,
    setUsers,
    filteredUsers,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    rowsPerPage,
    fetchUsers,
  } = useUsers();

  const [page, setPage] = useState(1);

  // Modal yönetimi
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [deleteError, setDeleteError] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Rol değiştirme modal
  const [roleModalOpen, setRoleModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState("");
  const [roleUpdateLoading, setRoleUpdateLoading] = useState(false);
  const [roleUpdateError, setRoleUpdateError] = useState(null);

  // Kullanıcıları ilk yükleme
  useEffect(() => {
    fetchUsers();
  }, []);

  // Arama
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setPage(1);
  };

  // Sayfalanmış sonuçlar
  const pages = Math.ceil(filteredUsers.length / rowsPerPage);
  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return filteredUsers.slice(start, start + rowsPerPage);
  }, [page, filteredUsers, rowsPerPage]);

  // Kullanıcı silme
  const openDeleteModal = (user) => {
    setSelectedUser(user);
    setDeleteError(null);
    onOpen();
  };
  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    setDeleteLoading(true);
    setDeleteError(null);

    try {
      await axios.delete(`/user/${selectedUser._id}`, {
        withCredentials: true,
      });
      setUsers(users.filter((u) => u._id !== selectedUser._id));
      onClose();
    } catch (err) {
      setDeleteError(
        err.response?.data?.message || "Kullanıcı silinirken bir hata oluştu"
      );
    } finally {
      setDeleteLoading(false);
    }
  };

  // Rol değiştirme
  const openRoleModal = (user) => {
    setSelectedUser(user);
    setSelectedRole(user.role || "user");
    setRoleModalOpen(true);
    setRoleUpdateError(null);
  };
  const handleUpdateRole = async () => {
    if (!selectedUser || !selectedRole) return;
    setRoleUpdateLoading(true);

    try {
      await axios.patch(
        `/user/${selectedUser._id}/role`,
        { role: selectedRole },
        { withCredentials: true }
      );
      setUsers(
        users.map((u) =>
          u._id === selectedUser._id ? { ...u, role: selectedRole } : u
        )
      );
      setRoleModalOpen(false);
    } catch (err) {
      setRoleUpdateError(
        err.response?.data?.message ||
          "Kullanıcı rolü güncellenirken bir hata oluştu"
      );
    } finally {
      setRoleUpdateLoading(false);
    }
  };

  // Basit renk tanımı
  const renderRole = (role) => {
    let color = "primary";
    if (role?.toLowerCase() === "admin") color = "danger";
    if (role?.toLowerCase() === "author") color = "warning";
    return (
      <Chip color={color} size="sm" variant="flat">
        {role || "User"}
      </Chip>
    );
  };
  const renderStatus = (isVerified) => (
    <Chip color={isVerified ? "success" : "default"} size="sm" variant="flat">
      {isVerified ? "Verified" : "Not Verified"}
    </Chip>
  );

  // Aksiyon butonları
  const renderActions = (user) => (
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

  // Yükleniyor
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" label="Kullanıcılar yükleniyor..." />
      </div>
    );
  }

  // Hata
  if (error) {
    return (
      <div className="flex justify-center items-center h-64 text-danger">
        <p>Hata: {error}</p>
      </div>
    );
  }

  // Asıl render
  return (
    <div className="w-full flex flex-col gap-4">
      {/* Üst kısım */}
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

      {/* Tablo */}
      <Table
        aria-label="Kullanıcı listesi"
        bottomContent={
          pages > 0 && (
            <div className="flex w-full justify-center">
              <Pagination
                isCompact
                showControls
                showShadow
                color="primary"
                page={page}
                total={pages}
                onChange={(p) => setPage(p)}
              />
            </div>
          )
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
        <TableBody items={items} emptyContent={"Kullanıcı bulunamadı."}>
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

      {/* Modallar */}
      <DeleteUserModal
        isOpen={isOpen}
        onClose={onClose}
        selectedUser={selectedUser}
        deleteError={deleteError}
        handleDeleteUser={handleDeleteUser}
        isLoading={deleteLoading}
      />
      <ChangeRoleModal
        roleModalOpen={roleModalOpen}
        onClose={() => setRoleModalOpen(false)}
        selectedUser={selectedUser}
        selectedRole={selectedRole}
        setSelectedRole={setSelectedRole}
        handleUpdateRole={handleUpdateRole}
        roleUpdateLoading={roleUpdateLoading}
        roleUpdateError={roleUpdateError}
      />
    </div>
  );
};

export default UserListComponent;
