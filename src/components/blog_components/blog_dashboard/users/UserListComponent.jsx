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
import { useFeedback } from "../../../../context/FeedbackContext";

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

  // Feedback context'i kullan
  const { success, error: showError, warning } = useFeedback();

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

  // Hata durumunda bildirim göster
  useEffect(() => {
    if (error) {
      showError(error);
    }
  }, [error, showError]);

  // deleteError durumunda bildirim göster
  useEffect(() => {
    if (deleteError) {
      showError(deleteError);
    }
  }, [deleteError, showError]);

  // roleUpdateError durumunda bildirim göster
  useEffect(() => {
    if (roleUpdateError) {
      showError(roleUpdateError);
    }
  }, [roleUpdateError, showError]);

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
      success(`${selectedUser.userName} kullanıcısı başarıyla silindi.`);
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Kullanıcı silinirken bir hata oluştu";
      setDeleteError(errorMessage);
      showError(errorMessage);
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
      success(
        `${selectedUser.userName} kullanıcısının rolü "${selectedRole}" olarak güncellendi.`
      );
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        "Kullanıcı rolü güncellenirken bir hata oluştu";
      setRoleUpdateError(errorMessage);
      showError(errorMessage);
    } finally {
      setRoleUpdateLoading(false);
    }
  };

  // Refresh users
  const handleRefreshUsers = async () => {
    try {
      await fetchUsers();
      success("Kullanıcı listesi başarıyla yenilendi.");
    } catch (err) {
      showError("Kullanıcı listesi yenilenirken bir hata oluştu.");
    }
  };

  // Basit renk tanımı
  const renderRole = (role) => {
    let bgColorClass = "bg-secondary-500";
    let textColorClass = "text-white";

    if (role?.toLowerCase() === "admin") {
      bgColorClass = "bg-red-500";
      textColorClass = "text-white";
    }
    if (role?.toLowerCase() === "author") {
      bgColorClass = "bg-yellow-500";
      textColorClass = "text-black";
    }

    return (
      <Chip
        size="sm"
        variant="flat"
        className={`${bgColorClass} ${textColorClass}`}
      >
        {role || "User"}
      </Chip>
    );
  };

  const renderStatus = (isVerified) => {
    const bgColorClass = isVerified ? "bg-green-500" : "bg-gray-300";
    const textColorClass = isVerified ? "text-white" : "text-gray-700";

    return (
      <Chip
        size="sm"
        variant="flat"
        className={`${bgColorClass} ${textColorClass}`}
      >
        {isVerified ? "Verified" : "Not Verified"}
      </Chip>
    );
  };

  // Aksiyon butonları
  const renderActions = (user) => (
    <div className="flex gap-2">
      <Tooltip content="Change Role">
        <Button
          isIconOnly
          size="sm"
          variant="light"
          className="text-yellow-500 hover:bg-yellow-100"
          onClick={() => openRoleModal(user)}
        >
          <Icon icon="mdi:account-convert" />
        </Button>
      </Tooltip>
      <Tooltip content="Delete User">
        <Button
          isIconOnly
          size="sm"
          variant="light"
          className="text-red-500 hover:bg-red-100"
          onClick={() => openDeleteModal(user)}
        >
          <Icon icon="mdi:delete" />
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
      <div className="flex justify-center items-center h-64 text-red-500">
        <p>Hata: {error}</p>
      </div>
    );
  }

  // Asıl render
  return (
    <div className="w-full flex flex-col gap-4 overflow-hidden">
      {/* Üst kısım */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-2 w-full overflow-hidden">
        <h1 className="text-2xl font-bold whitespace-nowrap">
          Kullanıcı Listesi
        </h1>
        <div className="flex w-full sm:w-auto items-center justify-end gap-2">
          <Input
            placeholder="Kullanıcı ara..."
            value={searchTerm}
            onChange={handleSearch}
            startContent={<Icon icon="mdi:magnify" />}
            className="w-full max-w-full sm:max-w-xs"
            size="sm"
          />
          <Tooltip content="Yenile">
            <Button
              isIconOnly
              className="bg-gray-100 text-gray-700 hover:bg-gray-200"
              size="sm"
              onClick={handleRefreshUsers}
              aria-label="Yenile"
            >
              <Icon icon="mdi:refresh" className="text-lg" />
            </Button>
          </Tooltip>
        </div>
      </div>

      {/* Tablo */}
      <div className="w-full overflow-x-auto">
        <Table
          aria-label="Kullanıcı listesi"
          classNames={{
            base: "max-w-full",
            table: "min-w-full",
          }}
          bottomContent={
            pages > 0 && (
              <div className="flex w-full justify-center">
                <Pagination
                  isCompact
                  showControls
                  showShadow
                  className="text-secondary-500"
                  page={page}
                  total={pages}
                  onChange={(p) => setPage(p)}
                />
              </div>
            )
          }
        >
          <TableHeader>
            <TableColumn className="w-[130px]">KULLANICI ADI</TableColumn>
            <TableColumn className="w-[180px]">E-POSTA</TableColumn>
            <TableColumn className="w-[70px]">ROL</TableColumn>
            <TableColumn className="w-[80px]">DURUM</TableColumn>
            <TableColumn className="w-[100px]">KAYIT TARİHİ</TableColumn>
            <TableColumn className="w-[70px]">İŞLEMLER</TableColumn>
          </TableHeader>
          <TableBody items={items} emptyContent={"Kullanıcı bulunamadı."}>
            {(item) => (
              <TableRow key={item._id}>
                <TableCell className="truncate max-w-[130px]">
                  {item.userName}
                </TableCell>
                <TableCell className="truncate max-w-[180px]">
                  {item.email}
                </TableCell>
                <TableCell>{renderRole(item.role)}</TableCell>
                <TableCell>{renderStatus(item.isVerified)}</TableCell>
                <TableCell className="truncate max-w-[100px]">
                  {new Date(item.createdAt).toLocaleDateString("tr-TR")}
                </TableCell>
                <TableCell>{renderActions(item)}</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

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
