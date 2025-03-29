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
import { fetchTeamMembers } from "../../../../app/features/user/teamSlice";
import { logoutUser } from "../../../../app/features/user/userSlice";
import DeleteUserModal from "../../../modals/DeleteUserModal";
import HardDeleteUserModal from "../../../modals/HardDeleteUserModal";
import ChangeRoleModal from "../../../modals/ChangeRoleModal";
import ToggleActivationModal from "../../../modals/ToggleActivationModal";
import { useFeedback } from "../../../../context/FeedbackContext";

// MongoDB ObjectId validation helper function
const isValidObjectId = (id) => {
  return id && /^[0-9a-fA-F]{24}$/.test(id);
};

const UserListComponent = () => {
  const dispatch = useDispatch();

  // Redux state'lerini selektörlerle çek
  const userList = useSelector(selectUserList);
  const isLoading = useSelector(selectIsUserListLoading);
  const isError = useSelector(selectIsUserListError);
  const errorMessage = useSelector(selectUserListErrorMessage);
  const isFetched = useSelector(selectIsUserListFetched);
  // Admin kontrolü için kullanıcı rolünü çek - render sırasında değişmemesi için component seviyesinde
  const isAdmin = useSelector((state) => state.user.isAdmin);

  // Feedback context'i kullan
  const { success, error: showError } = useFeedback();

  // UI state'leri
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);

  // Soft delete modal yönetimi
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [deleteError, setDeleteError] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Hard delete modal yönetimi
  const [hardDeleteModalOpen, setHardDeleteModalOpen] = useState(false);
  const [hardDeleteLoading, setHardDeleteLoading] = useState(false);
  const [hardDeleteError, setHardDeleteError] = useState(null);

  // Rol değiştirme modal
  const [roleModalOpen, setRoleModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState("");
  const [roleUpdateLoading, setRoleUpdateLoading] = useState(false);
  const [roleUpdateError, setRoleUpdateError] = useState(null);

  // Aktivasyon değiştirme modal
  const [activationModalOpen, setActivationModalOpen] = useState(false);
  const [activationLoading, setActivationLoading] = useState(false);
  const [activationError, setActivationError] = useState(null);

  // Tek bir useEffect ile veri yükleme
  useEffect(() => {
    // Veri daha önce yüklenmediyse, yükle
    if (!isFetched && !isLoading) {
      console.log("🚀 Kullanıcı listesi ilk kez yükleniyor...");
      dispatch(fetchUsers());
    }
  }, [dispatch, isFetched, isLoading]);

  // Hata durumunda bildirim göster
  useEffect(() => {
    if (errorMessage && !isLoading) {
      showError(errorMessage);
    }
  }, [errorMessage, isLoading, showError]);

  // deleteError durumunda bildirim göster
  useEffect(() => {
    if (deleteError && !deleteLoading) {
      showError(deleteError);
    }
  }, [deleteError, deleteLoading, showError]);

  // roleUpdateError durumunda bildirim göster
  useEffect(() => {
    if (roleUpdateError && !roleUpdateLoading) {
      showError(roleUpdateError);
    }
  }, [roleUpdateError, roleUpdateLoading, showError]);

  // activationError durumunda bildirim göster
  useEffect(() => {
    if (activationError && !activationLoading) {
      showError(activationError);
    }
  }, [activationError, activationLoading, showError]);

  // hardDeleteError durumunda bildirim göster
  useEffect(() => {
    if (hardDeleteError && !hardDeleteLoading) {
      showError(hardDeleteError);
    }
  }, [hardDeleteError, hardDeleteLoading, showError]);

  // Tabloda görüntülenecek satır sayısı
  const rowsPerPage = 10;

  // Filtrelenmiş kullanıcılar (arama için)
  const filteredUsers = useMemo(() => {
    if (!userList) {
      return [];
    }

    if (!searchTerm || searchTerm.trim() === "") {
      return userList;
    }

    return userList.filter(
      (user) =>
        user.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.role?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [userList, searchTerm]);

  // Sayfalanmış sonuçlar
  const pages = Math.ceil((filteredUsers?.length || 0) / rowsPerPage);
  const paginatedItems = useMemo(() => {
    if (!filteredUsers) return [];
    const start = (page - 1) * rowsPerPage;
    return filteredUsers.slice(start, start + rowsPerPage);
  }, [page, filteredUsers, rowsPerPage]);

  // Arama
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setPage(1);
  };

  // Kullanıcı silme
  const openDeleteModal = (user) => {
    setSelectedUser(user);
    setDeleteError(null);
    onOpen();
  };

  // Kullanıcı kalıcı silme
  const openHardDeleteModal = (user) => {
    setSelectedUser(user);
    setHardDeleteError(null);
    setHardDeleteModalOpen(true);
  };

  // Soft delete (deaktif etme) işleyicisi
  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    setDeleteLoading(true);
    setDeleteError(null);

    try {
      // Kullanıcı ID'sinin geçerliliğini kontrol et
      if (!selectedUser._id || !isValidObjectId(selectedUser._id)) {
        throw new Error("Geçersiz kullanıcı ID'si");
      }

      // Redux action ile kullanıcıyı deaktif et
      const result = await dispatch(
        deleteUser({ userId: selectedUser._id })
      ).unwrap();

      // Deaktif edilen kullanıcı, oturum açmış kullanıcı mı kontrol et
      const isCurrentUser = result.data && result.data.isCurrentUser === true;

      console.log(
        "Deaktif etme sonucu:",
        result,
        "İşlem yapan kullanıcı mı:",
        isCurrentUser
      );

      // Modal'ı kapat
      onClose();

      // Kullanıcıyı UI'dan kaldır (fetchUsers() çağırmak yerine)
      if (userList) {
        // Deaktif edilen kullanıcının aktivasyon durumunu güncelle
        dispatch(
          updateUserInList({
            userId: selectedUser._id,
            updates: { isActive: false, deletedAt: new Date() },
          })
        );
      }

      // Eğer mevcut kullanıcı deaktif edildiyse
      if (isCurrentUser) {
        success("Hesabınız deaktif edildi, çıkış yapılıyor...");

        // Kullanıcıya bildirim göstermek için kısa bir bekleme süresi
        setTimeout(() => {
          // Tüm kullanıcı oturumunu temizle
          dispatch(logoutUser());
          // Login sayfasına yönlendir
          window.location.href = "/login";
        }, 2000);
      } else {
        success(
          `${result.data?.userName || "Kullanıcı"} başarıyla deaktif edildi`
        );
      }
    } catch (err) {
      const errorMessage =
        err.message || "Kullanıcı deaktif edilirken bir hata oluştu";
      setDeleteError(errorMessage);
      showError(errorMessage);
    } finally {
      setDeleteLoading(false);
    }
  };

  // Hard delete (kalıcı silme) işleyicisi
  const handleHardDeleteUser = async () => {
    if (!selectedUser) return;
    setHardDeleteLoading(true);
    setHardDeleteError(null);

    try {
      // Kullanıcı ID'sinin geçerliliğini kontrol et
      if (!selectedUser._id || !isValidObjectId(selectedUser._id)) {
        throw new Error("Geçersiz kullanıcı ID'si");
      }

      // Redux action ile kullanıcıyı kalıcı olarak sil
      const result = await dispatch(
        hardDeleteUser({ userId: selectedUser._id })
      ).unwrap();

      // Modal'ı kapat
      setHardDeleteModalOpen(false);

      // Kullanıcıyı UI'dan kaldır
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
      // Redux action ile kullanıcı rolünü güncelle
      const result = await dispatch(
        updateUserRole({
          userId: selectedUser._id,
          role: selectedRole,
        })
      ).unwrap();

      // Modal'ı kapat
      setRoleModalOpen(false);
      success(
        `${selectedUser.userName} kullanıcısının rolü "${selectedRole}" olarak güncellendi.`
      );

      // UI'daki kullanıcı veriyi güncelle (fetchUsers() çağırmak yerine)
      if (userList) {
        // Redux store'daki kullanıcının rolünü güncelle
        dispatch(
          updateUserInList({
            userId: selectedUser._id,
            updates: { role: selectedRole },
          })
        );
      }
    } catch (err) {
      const errorMessage =
        err.message || "Kullanıcı rolü güncellenirken bir hata oluştu";
      setRoleUpdateError(errorMessage);
      showError(errorMessage);
    } finally {
      setRoleUpdateLoading(false);
    }
  };

  // Kullanıcı listesini yenile - kullanıcı açıkça yenileme istediğinde
  const handleRefreshUsers = async () => {
    // Zaten yükleme yapılıyorsa engelle
    if (isLoading) {
      return;
    }

    try {
      console.log(
        "UserListComponent manuel kullanıcı listesi yenileme başlatıldı"
      );

      // Önce userSlice'ın isLoading durumunu true'ya ayarla
      dispatch(startManualRefresh());

      // Önce API erişimini kontrol et
      const results = await Promise.allSettled([
        dispatch(fetchUsers()).unwrap(),
        dispatch(fetchTeamMembers()).unwrap(),
      ]);

      // fetchUsers sonucu kontrolü
      const userResult = results[0];

      if (
        userResult.status === "fulfilled" &&
        userResult.value &&
        userResult.value.success
      ) {
        console.log(
          `UserListComponent kullanıcı listesi yenilendi: ${
            userResult.value.data?.length || 0
          } kullanıcı`
        );
        success("Kullanıcı listesi başarıyla yenilendi.");
      } else if (userResult.status === "rejected") {
        const err = userResult.reason;
        if (err && err.code === "AUTH_REQUIRED") {
          // Auth hatası - kullanıcı çıkış yapmış
          console.warn(
            "Kullanıcı oturumu sonlanmış, login sayfasına yönlendiriliyor"
          );
          // Doğrudan login sayfasına yönlendir
          window.location.href = "/login";
          return;
        } else {
          showError("Kullanıcı listesi yenilenirken bir sorun oluştu.");
          console.error(
            "UserListComponent kullanıcı listesi yenileme hatası:",
            userResult.reason
          );
        }
      }
    } catch (err) {
      // Auth hatası varsa login sayfasına yönlendir
      if (err && err.code === "AUTH_REQUIRED") {
        window.location.href = "/login";
        return;
      }

      console.error(
        "UserListComponent kullanıcı listesi yenileme hatası:",
        err
      );
      showError(
        "Kullanıcı listesi yenilenirken bir hata oluştu: " +
          (err.message || "Bilinmeyen hata")
      );
    }
  };

  // Aktivasyon değiştirme
  const openActivationModal = (user) => {
    setSelectedUser(user);
    setActivationModalOpen(true);
    setActivationError(null);
  };

  const handleToggleActivation = async () => {
    if (!selectedUser) return;
    setActivationLoading(true);

    try {
      // Redux action ile kullanıcı aktivasyon durumunu güncelle
      const result = await dispatch(
        toggleUserActivation({
          userId: selectedUser._id,
          isActive: !selectedUser.isActive,
        })
      ).unwrap();

      // Modal'ı kapat
      setActivationModalOpen(false);

      const statusText = !selectedUser.isActive
        ? "aktifleştirildi"
        : "deaktif edildi";

      success(`${selectedUser.userName} kullanıcısı başarıyla ${statusText}.`);

      // UI'daki kullanıcı verisini güncelle (fetchUsers() çağırmak yerine)
      if (userList) {
        // Redux store'daki kullanıcının aktivasyon durumunu güncelle
        dispatch(
          updateUserInList({
            userId: selectedUser._id,
            updates: { isActive: !selectedUser.isActive },
          })
        );
      }
    } catch (err) {
      const errorMessage =
        err.message ||
        "Kullanıcı aktivasyon durumu güncellenirken bir hata oluştu";
      setActivationError(errorMessage);
      showError(errorMessage);
    } finally {
      setActivationLoading(false);
    }
  };

  // Helper fonksiyonları - render sırasında sabit kalacak şekilde yeniden tanımlanmayacak
  const renderRole = React.useCallback((role) => {
    let bgColorClass = "bg-primary-500";
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
  }, []);

  const renderStatus = React.useCallback((isVerified) => {
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
  }, []);

  const renderActiveStatus = React.useCallback((isActive) => {
    const bgColorClass = isActive ? "bg-green-500" : "bg-red-500";
    const textColorClass = "text-white";

    return (
      <Chip
        size="sm"
        variant="flat"
        className={`${bgColorClass} ${textColorClass}`}
      >
        {isActive ? "Active" : "Passive"}
      </Chip>
    );
  }, []);

  // Aksiyon butonları - useSelector kullanmıyoruz
  const renderActions = React.useCallback(
    (user) => {
      return (
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
                icon={
                  user.isActive ? "mdi:account-cancel" : "mdi:account-check"
                }
              />
            </Button>
          </Tooltip>

          <Tooltip content="Deaktif Et">
            <Button
              isIconOnly
              size="sm"
              variant="light"
              className="text-orange-500 hover:bg-orange-100"
              onPress={() => openDeleteModal(user)}
            >
              <Icon icon="mdi:user-remove" />
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
      );
    },
    [
      isAdmin,
      openRoleModal,
      openActivationModal,
      openDeleteModal,
      openHardDeleteModal,
    ]
  );

  // Yükleniyor
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" label="Kullanıcılar yükleniyor..." />
      </div>
    );
  }

  // Hata
  if (isError) {
    return (
      <div className="flex justify-center items-center h-64 text-red-500">
        <p>Hata: {errorMessage}</p>
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
              onPress={handleRefreshUsers}
              aria-label="Yenile"
            >
              <Icon icon="mdi:refresh" className="text-lg" />
            </Button>
          </Tooltip>
        </div>
      </div>

      {/* Tablo */}
      <div className="w-full overflow-x-auto">
        {paginatedItems.length > 0 ? (
          <>
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
          </>
        ) : (
          <div className="flex justify-center items-center p-8 text-gray-500">
            Kullanıcı bulunamadı.
          </div>
        )}
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

// React.memo yerine normal export kullanarak sorunları önle
export default UserListComponent;
