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
  removeUser,
  updateUserInList,
  startManualRefresh,
  selectUserList,
  selectIsUserListLoading,
  selectIsUserListError,
  selectUserListErrorMessage,
  selectIsUserListFetched,
} from "../../../../app/features/user/userListSlice";
import { fetchTeamMembers } from "../../../../app/features/user/teamSlice";
import { logoutUser } from "../../../../app/features/user/userSlice";
import DeleteUserModal from "../../../modals/DeleteUserModal";
import ChangeRoleModal from "../../../modals/ChangeRoleModal";
import { useFeedback } from "../../../../context/FeedbackContext";

// MongoDB ObjectId validation helper function
const isValidObjectId = (id) => {
  return id && /^[0-9a-fA-F]{24}$/.test(id);
};

const UserListComponent = () => {
  console.log("UserListComponent render edildi");

  const dispatch = useDispatch();

  // Redux state'lerini selektörlerle çek
  const userList = useSelector(selectUserList);
  const isLoading = useSelector(selectIsUserListLoading);
  const isError = useSelector(selectIsUserListError);
  const errorMessage = useSelector(selectUserListErrorMessage);
  const isFetched = useSelector(selectIsUserListFetched);

  // Feedback context'i kullan
  const { success, error: showError } = useFeedback();

  // UI state'leri
  const [searchTerm, setSearchTerm] = useState("");
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
    if (errorMessage) {
      showError(errorMessage);
    }
  }, [errorMessage, showError]);

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
  const items = useMemo(() => {
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

  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    setDeleteLoading(true);
    setDeleteError(null);

    try {
      // Kullanıcı ID'sinin geçerliliğini kontrol et
      if (!selectedUser._id || !isValidObjectId(selectedUser._id)) {
        throw new Error("Geçersiz kullanıcı ID'si");
      }

      // Redux action ile kullanıcıyı sil
      const result = await dispatch(
        deleteUser({ userId: selectedUser._id })
      ).unwrap();

      // Silinen kullanıcı, oturum açmış kullanıcı mı kontrol et
      if (result.data && result.data.isCurrentUser) {
        onClose();
        success("Hesabınız silindi, çıkış yapılıyor...");

        // Kullanıcıya bildirim göstermek için kısa bir bekleme süresi
        setTimeout(() => {
          // Tüm kullanıcı oturumunu temizle
          dispatch(logoutUser());
          // Login sayfasına yönlendir
          window.location.href = "/login";
        }, 2000);
      } else {
        success(`${result.data?.userName || "Kullanıcı"} başarıyla silindi`);
        // Modal'ı kapat
        onClose();

        // Kullanıcıyı UI'dan kaldır (fetchUsers() çağırmak yerine)
        if (userList) {
          // Redux store'dan silinen kullanıcıyı kaldır
          dispatch(removeUser(selectedUser._id));
        }
      }
    } catch (err) {
      const errorMessage =
        err.message || "Kullanıcı silinirken bir hata oluştu";
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
    try {
      console.log(
        "UserListComponent manuel kullanıcı listesi yenileme başlatıldı"
      );

      // Önce userSlice'ın isLoading durumunu true'ya ayarla
      dispatch(startManualRefresh());

      // İki action'ı da çağır ama sonuçlarını bekle
      const results = await Promise.all([
        dispatch(fetchUsers()).unwrap(),
        dispatch(fetchTeamMembers()).unwrap(),
      ]);

      // fetchUsers sonucu kontrolü
      const userResult = results[0];
      if (userResult && userResult.success) {
        console.log(
          `UserListComponent kullanıcı listesi yenilendi: ${
            userResult.data?.length || 0
          } kullanıcı`
        );
        success("Kullanıcı listesi başarıyla yenilendi.");
      } else {
        showError("Kullanıcı listesi yenilenirken bir sorun oluştu.");
        console.error(
          "UserListComponent kullanıcı listesi yenileme yanıtı:",
          userResult
        );
      }
    } catch (err) {
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

  // Basit renk tanımı
  const renderRole = (role) => {
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

  const renderActiveStatus = (isActive) => {
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
          onPress={() => openRoleModal(user)}
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
          onPress={() => openDeleteModal(user)}
        >
          <Icon icon="mdi:delete" />
        </Button>
      </Tooltip>
    </div>
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
            <TableColumn className="w-[130px]">KULLANICI ADI</TableColumn>
            <TableColumn className="w-[180px]">E-POSTA</TableColumn>
            <TableColumn className="w-[70px]">ROL</TableColumn>
            <TableColumn className="w-[80px]">DURUM</TableColumn>
            <TableColumn className="w-[80px]">AKTİF</TableColumn>
            <TableColumn className="w-[100px]">SON GİRİŞ</TableColumn>
            <TableColumn className="w-[100px]">KAYIT TARİHİ</TableColumn>
            <TableColumn className="w-[100px]">SİLİNME TARİHİ</TableColumn>
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

export default React.memo(UserListComponent);
