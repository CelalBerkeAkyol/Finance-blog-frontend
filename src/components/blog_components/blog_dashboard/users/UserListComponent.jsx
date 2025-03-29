import React, { useState, useEffect, useMemo, useCallback } from "react";
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
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUsers,
  updateUserRole,
  deleteUser,
  hardDeleteUser,
  removeUser,
  updateUserInList,
  startManualRefresh,
  selectUserList,
  selectIsUserListLoading,
  selectIsUserListError,
  selectUserListErrorMessage,
  selectIsUserListFetched,
  toggleUserActivation,
} from "../../../../app/features/user/userListSlice";
import { logoutUser } from "../../../../app/features/user/userSlice";
import DeleteUserModal from "../../../modals/DeleteUserModal";
import HardDeleteUserModal from "../../../modals/HardDeleteUserModal";
import ChangeRoleModal from "../../../modals/ChangeRoleModal";
import ToggleActivationModal from "../../../modals/ToggleActivationModal";
import { useFeedback } from "../../../../context/FeedbackContext";

// MongoDB ObjectId validation helper function
const isValidObjectId = (id) => /^[0-9a-fA-F]{24}$/.test(id);

const UserListComponent = () => {
  const dispatch = useDispatch();
  const { success, error: showError } = useFeedback();

  // Redux state selectors
  const userList = useSelector(selectUserList);
  const isLoading = useSelector(selectIsUserListLoading);
  const isError = useSelector(selectIsUserListError);
  const errorMessage = useSelector(selectUserListErrorMessage);
  const isFetched = useSelector(selectIsUserListFetched);
  const isAdmin = useSelector((state) => state.user.isAdmin);
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);

  // Erro state tracking
  const [authError, setAuthError] = useState(false);

  // UI states
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedRole, setSelectedRole] = useState("");

  // Modal states with loading and error states
  const { isOpen, onOpen, onClose } = useDisclosure(); // Delete modal
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  const [hardDeleteModalOpen, setHardDeleteModalOpen] = useState(false);
  const [hardDeleteLoading, setHardDeleteLoading] = useState(false);
  const [hardDeleteError, setHardDeleteError] = useState(null);

  const [roleModalOpen, setRoleModalOpen] = useState(false);
  const [roleUpdateLoading, setRoleUpdateLoading] = useState(false);
  const [roleUpdateError, setRoleUpdateError] = useState(null);

  const [activationModalOpen, setActivationModalOpen] = useState(false);
  const [activationLoading, setActivationLoading] = useState(false);
  const [activationError, setActivationError] = useState(null);

  // Prevent fetch if we've already had an auth error
  useEffect(() => {
    // Eğer kullanıcı giriş yapmamışsa veya önceden auth hatası olduysa, fetch yapmayı dene
    if (!isFetched && !isLoading && isLoggedIn && !authError) {
      dispatch(fetchUsers())
        .unwrap()
        .catch((err) => {
          if (err.code === "AUTH_REQUIRED") {
            setAuthError(true);
            // Token hatası varsa login sayfasına yönlendir
            setTimeout(() => {
              window.location.href = "/login";
            }, 1000);
          }
        });
    }
  }, [dispatch, isFetched, isLoading, isLoggedIn, authError]);

  // Hata bildirimleri için referans kullan - sonsuz döngü sorununu önlemek için
  const errorsShown = React.useRef({});

  // Handle error notifications - use a ref to prevent infinite loops
  useEffect(() => {
    if (errorMessage && !isLoading && !errorsShown.current.errorMessage) {
      showError(errorMessage);
      errorsShown.current.errorMessage = true;

      // Auth hatası kontrolü
      if (
        errorMessage.includes("token") ||
        errorMessage.includes("izin") ||
        errorMessage.includes("yetki")
      ) {
        setAuthError(true);
        setTimeout(() => {
          window.location.href = "/login";
        }, 1000);
      }
    } else if (!errorMessage) {
      errorsShown.current.errorMessage = false;
    }

    // Diğer hatalar için benzer kontroller
    if (deleteError && !deleteLoading && !errorsShown.current.deleteError) {
      showError(deleteError);
      errorsShown.current.deleteError = true;
    } else if (!deleteError) {
      errorsShown.current.deleteError = false;
    }

    if (
      roleUpdateError &&
      !roleUpdateLoading &&
      !errorsShown.current.roleUpdateError
    ) {
      showError(roleUpdateError);
      errorsShown.current.roleUpdateError = true;
    } else if (!roleUpdateError) {
      errorsShown.current.roleUpdateError = false;
    }

    if (
      activationError &&
      !activationLoading &&
      !errorsShown.current.activationError
    ) {
      showError(activationError);
      errorsShown.current.activationError = true;
    } else if (!activationError) {
      errorsShown.current.activationError = false;
    }

    if (
      hardDeleteError &&
      !hardDeleteLoading &&
      !errorsShown.current.hardDeleteError
    ) {
      showError(hardDeleteError);
      errorsShown.current.hardDeleteError = true;
    } else if (!hardDeleteError) {
      errorsShown.current.hardDeleteError = false;
    }
  }, [
    errorMessage,
    isLoading,
    deleteError,
    deleteLoading,
    roleUpdateError,
    roleUpdateLoading,
    activationError,
    activationLoading,
    hardDeleteError,
    hardDeleteLoading,
    showError,
  ]);

  // Table configuration
  const rowsPerPage = 10;

  // Filter users based on search term
  const filteredUsers = useMemo(() => {
    if (!userList) return [];
    if (!searchTerm.trim()) return userList;

    return userList.filter(
      (user) =>
        user.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.role?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [userList, searchTerm]);

  // Paginate results
  const pages = Math.ceil((filteredUsers?.length || 0) / rowsPerPage);
  const paginatedItems = useMemo(() => {
    if (!filteredUsers.length) return [];
    const start = (page - 1) * rowsPerPage;
    return filteredUsers.slice(start, start + rowsPerPage);
  }, [page, filteredUsers, rowsPerPage]);

  // Event handlers
  const handleSearch = useCallback((e) => {
    setSearchTerm(e.target.value);
    setPage(1);
  }, []);

  const openDeleteModal = useCallback(
    (user) => {
      setSelectedUser(user);
      setDeleteError(null);
      onOpen();
    },
    [onOpen]
  );

  const openHardDeleteModal = useCallback((user) => {
    setSelectedUser(user);
    setHardDeleteError(null);
    setHardDeleteModalOpen(true);
  }, []);

  const openRoleModal = useCallback((user) => {
    setSelectedUser(user);
    setSelectedRole(user.role || "user");
    setRoleModalOpen(true);
    setRoleUpdateError(null);
  }, []);

  const openActivationModal = useCallback((user) => {
    setSelectedUser(user);
    setActivationModalOpen(true);
    setActivationError(null);
  }, []);

  // Action handlers - API işlemlerinde auth hatası kontrolü ekle
  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    setDeleteLoading(true);
    setDeleteError(null);

    try {
      if (!isValidObjectId(selectedUser._id)) {
        throw new Error("Geçersiz kullanıcı ID'si");
      }

      const result = await dispatch(
        deleteUser({ userId: selectedUser._id })
      ).unwrap();

      const isCurrentUser = result.data && result.data.isCurrentUser === true;
      onClose();

      // Update UI
      dispatch(
        updateUserInList({
          userId: selectedUser._id,
          updates: { isActive: false, deletedAt: new Date() },
        })
      );

      if (isCurrentUser) {
        success("Hesabınız deaktif edildi, çıkış yapılıyor...");
        setTimeout(() => {
          dispatch(logoutUser());
          window.location.href = "/login";
        }, 2000);
      } else {
        success(
          `${result.data?.userName || "Kullanıcı"} başarıyla deaktif edildi`
        );
      }
    } catch (err) {
      // Auth hatası kontrolü
      if (err?.code === "AUTH_REQUIRED") {
        setAuthError(true);
        showError("Oturum sonlandı, lütfen tekrar giriş yapın");
        setTimeout(() => {
          window.location.href = "/login";
        }, 1000);
        return;
      }

      const errorMessage =
        err.message || "Kullanıcı deaktif edilirken bir hata oluştu";
      setDeleteError(errorMessage);
      showError(errorMessage);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleHardDeleteUser = async () => {
    if (!selectedUser) return;
    setHardDeleteLoading(true);
    setHardDeleteError(null);

    try {
      if (!isValidObjectId(selectedUser._id)) {
        throw new Error("Geçersiz kullanıcı ID'si");
      }

      const result = await dispatch(
        hardDeleteUser({ userId: selectedUser._id })
      ).unwrap();

      setHardDeleteModalOpen(false);
      dispatch(removeUser(selectedUser._id));
      success(
        `${result.data?.userName || "Kullanıcı"} veritabanından tamamen silindi`
      );
    } catch (err) {
      const errorMessage =
        err.message || "Kullanıcı kalıcı olarak silinirken bir hata oluştu";
      setHardDeleteError(errorMessage);
      showError(errorMessage);
    } finally {
      setHardDeleteLoading(false);
    }
  };

  const handleUpdateRole = async () => {
    if (!selectedUser || !selectedRole) return;
    setRoleUpdateLoading(true);

    try {
      await dispatch(
        updateUserRole({
          userId: selectedUser._id,
          role: selectedRole,
        })
      ).unwrap();

      setRoleModalOpen(false);
      success(
        `${selectedUser.userName} kullanıcısının rolü "${selectedRole}" olarak güncellendi.`
      );

      dispatch(
        updateUserInList({
          userId: selectedUser._id,
          updates: { role: selectedRole },
        })
      );
    } catch (err) {
      const errorMessage =
        err.message || "Kullanıcı rolü güncellenirken bir hata oluştu";
      setRoleUpdateError(errorMessage);
      showError(errorMessage);
    } finally {
      setRoleUpdateLoading(false);
    }
  };

  const handleToggleActivation = async () => {
    if (!selectedUser) return;
    setActivationLoading(true);

    try {
      const result = await dispatch(
        toggleUserActivation({
          userId: selectedUser._id,
          isActive: !selectedUser.isActive,
        })
      ).unwrap();

      setActivationModalOpen(false);

      const statusText = !selectedUser.isActive
        ? "aktifleştirildi"
        : "deaktif edildi";
      success(`${selectedUser.userName} kullanıcısı başarıyla ${statusText}.`);

      dispatch(
        updateUserInList({
          userId: selectedUser._id,
          updates: {
            isActive: !selectedUser.isActive,
            deletedAt: !selectedUser.isActive ? null : new Date(),
          },
        })
      );

      setTimeout(() => {
        dispatch(fetchUsers());
      }, 500);
    } catch (err) {
      if (err?.code === "AUTH_REQUIRED") {
        setAuthError(true);
        showError("Oturum sonlandı, lütfen tekrar giriş yapın");
        setTimeout(() => {
          window.location.href = "/login";
        }, 1000);
        return;
      }

      const errorMessage =
        err.message ||
        "Kullanıcı aktivasyon durumu güncellenirken bir hata oluştu";
      setActivationError(errorMessage);
      showError(errorMessage);
    } finally {
      setActivationLoading(false);
    }
  };

  const handleRefreshUsers = async () => {
    if (isLoading || authError) return;

    try {
      dispatch(startManualRefresh());
      const result = await dispatch(fetchUsers()).unwrap();

      if (result?.success) {
        success("Kullanıcı listesi başarıyla yenilendi.");
      }
    } catch (err) {
      if (err?.code === "AUTH_REQUIRED") {
        setAuthError(true);
        showError("Oturum sonlandı, lütfen tekrar giriş yapın");
        setTimeout(() => {
          window.location.href = "/login";
        }, 1000);
        return;
      }

      showError(
        "Kullanıcı listesi yenilenirken bir hata oluştu: " +
          (err.message || "Bilinmeyen hata")
      );
    }
  };

  // UI Rendering helpers
  const renderRole = useCallback((role) => {
    let bgColorClass = "bg-primary-500";
    let textColorClass = "text-white";

    if (role?.toLowerCase() === "admin") {
      bgColorClass = "bg-red-500";
    } else if (role?.toLowerCase() === "author") {
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
  }, []);

  const renderStatus = useCallback(
    (isVerified) => (
      <Chip
        size="sm"
        variant="flat"
        className={`${
          isVerified ? "bg-green-500 text-white" : "bg-gray-300 text-gray-700"
        }`}
      >
        {isVerified ? "Verified" : "Not Verified"}
      </Chip>
    ),
    []
  );

  const renderActiveStatus = useCallback(
    (isActive) => (
      <Chip
        size="sm"
        variant="flat"
        className={`${isActive ? "bg-green-500" : "bg-red-500"} text-white`}
      >
        {isActive ? "Active" : "Passive"}
      </Chip>
    ),
    []
  );

  const renderActions = useCallback(
    (user) => (
      <div className="flex gap-2">
        <Tooltip content="Change Role">
          <Button
            isIconOnly
            size="sm"
            variant="light"
            className="text-yellow-500 hover:bg-yellow-100"
            onPress={() => openRoleModal(user)}
          >
            <Icon icon="mdi:account-convert" />
          </Button>
        </Tooltip>

        <Tooltip content={user.isActive ? "Deaktif Et" : "Aktifleştir"}>
          <Button
            isIconOnly
            size="sm"
            variant="light"
            className={
              user.isActive
                ? "text-orange-500 hover:bg-orange-100"
                : "text-green-500 hover:bg-green-100"
            }
            onPress={() => openActivationModal(user)}
          >
            <Icon
              icon={user.isActive ? "mdi:user-remove" : "mdi:account-check"}
            />
          </Button>
        </Tooltip>

        {isAdmin && (
          <Tooltip content="Kalıcı Olarak Sil">
            <Button
              isIconOnly
              size="sm"
              variant="light"
              className="text-red-600 hover:bg-red-100"
              onPress={() => openHardDeleteModal(user)}
            >
              <Icon icon="mdi:delete-forever" />
            </Button>
          </Tooltip>
        )}
      </div>
    ),
    [isAdmin, openRoleModal, openActivationModal, openHardDeleteModal]
  );

  // Loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" label="Kullanıcılar yükleniyor..." />
      </div>
    );
  }

  // Auth error state
  if (authError) {
    return (
      <div className="flex justify-center items-center h-64 text-red-500">
        <p>Oturum sonlandı, yönlendiriliyorsunuz...</p>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="flex justify-center items-center h-64 text-red-500">
        <p>Hata: {errorMessage}</p>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-4 overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-2 w-full">
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
              onPress={handleRefreshUsers}
              aria-label="Yenile"
            >
              <Icon icon="mdi:refresh" className="text-lg" />
            </Button>
          </Tooltip>
        </div>
      </div>

      {/* Table */}
      <div className="w-full overflow-x-auto">
        {paginatedItems.length > 0 ? (
          <Table
            aria-label="Kullanıcı listesi"
            className="w-full"
            bottomContent={
              pages > 0 && (
                <div className="flex w-full justify-center">
                  <Pagination
                    isCompact
                    showControls
                    showShadow
                    className="text-primary-500"
                    page={page}
                    total={pages}
                    onChange={setPage}
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
              <TableColumn>AKTİF</TableColumn>
              <TableColumn>SON GİRİŞ</TableColumn>
              <TableColumn>KAYIT TARİHİ</TableColumn>
              <TableColumn>SİLİNME TARİHİ</TableColumn>
              <TableColumn>İŞLEMLER</TableColumn>
            </TableHeader>
            <TableBody>
              {paginatedItems.map((item) => (
                <TableRow key={item._id}>
                  <TableCell className="truncate max-w-[130px]">
                    {item.userName}
                  </TableCell>
                  <TableCell className="truncate max-w-[180px]">
                    {item.email}
                  </TableCell>
                  <TableCell>{renderRole(item.role)}</TableCell>
                  <TableCell>{renderStatus(item.isVerified)}</TableCell>
                  <TableCell>{renderActiveStatus(item.isActive)}</TableCell>
                  <TableCell className="truncate max-w-[100px]">
                    {item.lastLogin
                      ? new Date(item.lastLogin).toLocaleDateString("tr-TR")
                      : "-"}
                  </TableCell>
                  <TableCell className="truncate max-w-[100px]">
                    {new Date(item.createdAt).toLocaleDateString("tr-TR")}
                  </TableCell>
                  <TableCell className="truncate max-w-[100px]">
                    {item.deletedAt
                      ? new Date(item.deletedAt).toLocaleDateString("tr-TR")
                      : "-"}
                  </TableCell>
                  <TableCell>{renderActions(item)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="flex justify-center items-center p-8 text-gray-500">
            Kullanıcı bulunamadı.
          </div>
        )}
      </div>

      {/* Modals */}
      <DeleteUserModal
        isOpen={isOpen}
        onClose={onClose}
        selectedUser={selectedUser}
        deleteError={deleteError}
        handleDeleteUser={handleDeleteUser}
        isLoading={deleteLoading}
      />
      <HardDeleteUserModal
        isOpen={hardDeleteModalOpen}
        onClose={() => setHardDeleteModalOpen(false)}
        selectedUser={selectedUser}
        handleHardDeleteUser={handleHardDeleteUser}
        isLoading={hardDeleteLoading}
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
      <ToggleActivationModal
        isOpen={activationModalOpen}
        onClose={() => setActivationModalOpen(false)}
        selectedUser={selectedUser}
        handleToggleActivation={handleToggleActivation}
        isLoading={activationLoading}
      />
    </div>
  );
};

export default UserListComponent;
