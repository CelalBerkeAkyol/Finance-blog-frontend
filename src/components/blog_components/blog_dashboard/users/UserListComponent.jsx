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
} from "@nextui-org/react";
import { Icon } from "@iconify/react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUsers,
  updateUserRole,
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

      // Auth hatası kontrolü - string yerine backend'den gelen error code'a göre
      if (
        errorMessage?.code === "AUTH_REQUIRED" ||
        errorMessage?.code === "UNAUTHORIZED_ACCESS" ||
        errorMessage?.code === "TOKEN_EXPIRED" ||
        errorMessage?.code === "INVALID_TOKEN" ||
        errorMessage?.code === "TOKEN_NOT_FOUND"
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
    let bgColorClass = "bg-primary";
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
            className="text-primary hover:bg-primary-100"
            onPress={() => openRoleModal(user)}
          >
            <Icon icon="mdi:account-convert" className="text-primary" />
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
              className="text-primary"
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
              <Icon icon="mdi:delete-forever" className="text-primary" />
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
              <Icon icon="mdi:refresh" className="text-primary" />
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
                    className="text-primary"
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
