import React, { useState, useEffect } from "react";
import axios from "../../../../api";
import { useSelector, useDispatch } from "react-redux";
import {
  updateUserProfile,
  fetchUser,
} from "../../../../app/features/user/userSlice";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Avatar,
  Button,
  Divider,
  Input,
  Textarea,
  Spinner,
  Tabs,
  Tab,
  Link,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/react";
import { Icon } from "@iconify/react";

const ProfileComponent = () => {
  const dispatch = useDispatch();
  const { userInfo, isLoading, isError, errorMessage } = useSelector(
    (state) => state.user
  );

  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [saveLoading, setSaveLoading] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isUserDataReady, setIsUserDataReady] = useState(false);

  // Kullanıcı bilgilerinin hazır olup olmadığını kontrol et
  useEffect(() => {
    if (userInfo && (userInfo._id || userInfo.id)) {
      setIsUserDataReady(true);
    } else {
      setIsUserDataReady(false);
      // Kullanıcı bilgileri eksikse, yeniden getir
      dispatch(fetchUser());
    }
  }, [userInfo, dispatch]);

  // Form verilerini başlat
  const initializeFormData = (userData) => {
    if (!userData) return;

    setFormData({
      userName: userData.userName || userData.username || "",
      fullName: userData.fullName || "",
      email: userData.email || "",
      bio: userData.bio || "",
      occupation: userData.occupation || "",
      website: userData.website || "",
      socialLinks: {
        twitter: userData.socialLinks?.twitter || "",
        linkedin: userData.socialLinks?.linkedin || "",
        github: userData.socialLinks?.github || "",
      },
      profileImage: userData.profileImage || "",
    });
  };

  // Düzenleme modunu başlat
  const handleStartEdit = async () => {
    // Kullanıcı bilgileri hazır değilse, önce bilgileri getir
    if (!isUserDataReady) {
      console.log("Kullanıcı bilgileri hazır değil, bilgiler getiriliyor...");
      try {
        await dispatch(fetchUser());
        // Bilgiler geldikten sonra düzenleme modunu başlat
        setEditMode(true);
        onOpen();
      } catch (error) {
        console.error("Kullanıcı bilgileri getirilemedi:", error);
        alert(
          "Kullanıcı bilgileri getirilemedi. Lütfen sayfayı yenileyip tekrar deneyin."
        );
      }
    } else {
      // Kullanıcı bilgileri hazırsa, düzenleme modunu başlat
      setEditMode(true);
      onOpen();
    }
  };

  // Profil güncelleme
  const handleUpdateProfile = async () => {
    try {
      setSaveLoading(true);
      setSaveError(null);

      // Kullanıcı ID'si kontrolü
      const userId = userInfo._id || userInfo.id;

      console.log("Kullanıcı bilgileri:", userInfo); // Hata ayıklama için

      if (!userId) {
        setSaveError(
          "Kullanıcı ID'si bulunamadı. Lütfen sayfayı yenileyip tekrar deneyin."
        );
        return;
      }

      // Redux action'ını kullanarak profil güncelleme
      const resultAction = await dispatch(
        updateUserProfile({ userId, userData: formData })
      );

      if (updateUserProfile.fulfilled.match(resultAction)) {
        console.info(
          "Kullanıcı profili başarıyla güncellendi:",
          resultAction.payload
        );

        // Kullanıcı bilgilerini yeniden getir
        await dispatch(fetchUser());

        setEditMode(false);
        onClose();
      } else if (updateUserProfile.rejected.match(resultAction)) {
        console.error("Profil güncelleme hatası:", resultAction.payload);
        setSaveError(
          resultAction.payload || "Profil güncellenirken bir hata oluştu"
        );
      }
    } catch (err) {
      console.error("Kullanıcı profili güncelleme hatası:", err);
      setSaveError("Profil güncellenirken bir hata oluştu");
    } finally {
      setSaveLoading(false);
    }
  };

  // Form değişikliklerini izle
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: value,
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  // Component mount olduğunda form verilerini başlat
  useEffect(() => {
    if (userInfo) {
      console.log("Redux'tan gelen userInfo:", userInfo); // Kullanıcı bilgilerini konsola yazdır
      initializeFormData(userInfo);
    }
  }, [userInfo]);

  // Yükleme durumunda gösterilecek içerik
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" label="Profil yükleniyor..." />
      </div>
    );
  }

  // Hata durumunda gösterilecek içerik
  if (isError) {
    return (
      <div className="flex flex-col justify-center items-center h-64 text-danger gap-4">
        <p>Hata: {errorMessage}</p>
        <Button color="primary" onClick={() => dispatch(fetchUser())}>
          Tekrar Dene
        </Button>
      </div>
    );
  }

  // Kullanıcı bulunamadığında gösterilecek içerik
  if (!userInfo) {
    return (
      <div className="flex flex-col justify-center items-center h-64 gap-4">
        <p>Kullanıcı bilgileri bulunamadı.</p>
        <Button color="primary" onClick={() => dispatch(fetchUser())}>
          Tekrar Dene
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Card className="mb-6">
        <CardHeader className="justify-between">
          <div className="flex gap-4">
            <Avatar
              src={userInfo.profileImage}
              size="lg"
              isBordered
              color={userInfo.role === "admin" ? "danger" : "primary"}
            />
            <div className="flex flex-col gap-1 items-start justify-center">
              <h4 className="text-lg font-semibold">
                {userInfo.fullName || userInfo.userName || userInfo.username}
              </h4>
              <p className="text-small text-default-500">
                {userInfo.occupation || userInfo.role}
              </p>
            </div>
          </div>
          <Button
            color="primary"
            variant="flat"
            onClick={handleStartEdit}
            startContent={<Icon icon="mdi:pencil" />}
          >
            Profili Düzenle
          </Button>
        </CardHeader>
        <Divider />
        <CardBody>
          <Tabs aria-label="Profil Bilgileri">
            <Tab key="about" title="Hakkında">
              <div className="space-y-4 p-4">
                <div>
                  <h5 className="text-sm font-semibold text-default-500">
                    Biyografi
                  </h5>
                  <p className="mt-1">
                    {userInfo.bio || "Henüz bir biyografi eklenmemiş."}
                  </p>
                </div>
                <div>
                  <h5 className="text-sm font-semibold text-default-500">
                    Meslek
                  </h5>
                  <p className="mt-1">
                    {userInfo.occupation || "Belirtilmemiş"}
                  </p>
                </div>
                <div>
                  <h5 className="text-sm font-semibold text-default-500">
                    Web Sitesi
                  </h5>
                  {userInfo.website ? (
                    <Link
                      href={userInfo.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1"
                    >
                      {userInfo.website}
                    </Link>
                  ) : (
                    <p className="mt-1">Belirtilmemiş</p>
                  )}
                </div>
              </div>
            </Tab>
            <Tab key="contact" title="İletişim">
              <div className="space-y-4 p-4">
                <div>
                  <h5 className="text-sm font-semibold text-default-500">
                    E-posta
                  </h5>
                  <p className="mt-1">{userInfo.email}</p>
                </div>
                <div>
                  <h5 className="text-sm font-semibold text-default-500">
                    Sosyal Medya
                  </h5>
                  <div className="flex gap-4 mt-2">
                    {userInfo.socialLinks?.twitter && (
                      <Link
                        href={userInfo.socialLinks.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Icon icon="mdi:twitter" width={24} />
                      </Link>
                    )}
                    {userInfo.socialLinks?.linkedin && (
                      <Link
                        href={userInfo.socialLinks.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Icon icon="mdi:linkedin" width={24} />
                      </Link>
                    )}
                    {userInfo.socialLinks?.github && (
                      <Link
                        href={userInfo.socialLinks.github}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Icon icon="mdi:github" width={24} />
                      </Link>
                    )}
                    {!userInfo.socialLinks?.twitter &&
                      !userInfo.socialLinks?.linkedin &&
                      !userInfo.socialLinks?.github && (
                        <p>Sosyal medya hesapları belirtilmemiş</p>
                      )}
                  </div>
                </div>
              </div>
            </Tab>
            <Tab key="account" title="Hesap">
              <div className="space-y-4 p-4">
                <div>
                  <h5 className="text-sm font-semibold text-default-500">
                    Kullanıcı Adı
                  </h5>
                  <p className="mt-1">
                    {userInfo.userName || userInfo.username}
                  </p>
                </div>
                <div>
                  <h5 className="text-sm font-semibold text-default-500">
                    Rol
                  </h5>
                  <p className="mt-1">{userInfo.role}</p>
                </div>
                <div>
                  <h5 className="text-sm font-semibold text-default-500">
                    Hesap Durumu
                  </h5>
                  <p className="mt-1">
                    {userInfo.isVerified ? "Doğrulanmış" : "Doğrulanmamış"}
                  </p>
                </div>
                <div>
                  <h5 className="text-sm font-semibold text-default-500">
                    Kayıt Tarihi
                  </h5>
                  <p className="mt-1">
                    {userInfo.createdAt
                      ? new Date(userInfo.createdAt).toLocaleDateString("tr-TR")
                      : "Belirtilmemiş"}
                  </p>
                </div>
              </div>
            </Tab>
          </Tabs>
        </CardBody>
      </Card>

      {/* Profil Düzenleme Modalı */}
      <Modal isOpen={isOpen && editMode} onClose={onClose} size="2xl">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Profil Düzenle
              </ModalHeader>
              <ModalBody>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Kullanıcı Adı"
                    name="userName"
                    value={formData.userName}
                    onChange={handleChange}
                    variant="bordered"
                    isDisabled // Kullanıcı adı değiştirilemez
                  />
                  <Input
                    label="Tam Ad"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    variant="bordered"
                  />
                  <Input
                    label="E-posta"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    variant="bordered"
                    isDisabled // E-posta değiştirilemez
                  />
                  <Input
                    label="Meslek"
                    name="occupation"
                    value={formData.occupation}
                    onChange={handleChange}
                    variant="bordered"
                  />
                  <Input
                    label="Web Sitesi"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    variant="bordered"
                  />
                  <Input
                    label="Profil Resmi URL"
                    name="profileImage"
                    value={formData.profileImage}
                    onChange={handleChange}
                    variant="bordered"
                  />
                  <Input
                    label="Twitter"
                    name="socialLinks.twitter"
                    value={formData.socialLinks?.twitter}
                    onChange={handleChange}
                    variant="bordered"
                  />
                  <Input
                    label="LinkedIn"
                    name="socialLinks.linkedin"
                    value={formData.socialLinks?.linkedin}
                    onChange={handleChange}
                    variant="bordered"
                  />
                  <Input
                    label="GitHub"
                    name="socialLinks.github"
                    value={formData.socialLinks?.github}
                    onChange={handleChange}
                    variant="bordered"
                  />
                  <Textarea
                    label="Biyografi"
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    variant="bordered"
                    className="col-span-1 md:col-span-2"
                    maxLength={500}
                  />
                </div>
                {saveError && <p className="text-danger mt-4">{saveError}</p>}
              </ModalBody>
              <ModalFooter>
                <Button variant="flat" onPress={onClose}>
                  İptal
                </Button>
                <Button
                  color="primary"
                  onPress={handleUpdateProfile}
                  isLoading={saveLoading}
                >
                  Kaydet
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default ProfileComponent;
