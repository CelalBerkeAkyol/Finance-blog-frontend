import React, { useState, useEffect } from "react";
import axios from "../../../../api";
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

const ProfileComponent = ({ userId, userInfo: propUserInfo }) => {
  const [user, setUser] = useState(propUserInfo || null);
  const [loading, setLoading] = useState(!propUserInfo);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [saveLoading, setSaveLoading] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Kullanıcı bilgilerini getir
  const fetchUserProfile = async () => {
    // Eğer prop olarak userInfo verilmişse, API çağrısı yapmaya gerek yok
    if (propUserInfo) {
      console.log("Using provided userInfo:", propUserInfo);
      setUser(propUserInfo);
      initializeFormData(propUserInfo);
      setLoading(false);
      return;
    }

    // userId yoksa API çağrısı yapma
    if (!userId) {
      console.error("No userId provided to fetch user profile");
      setError("Kullanıcı ID'si bulunamadı");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      console.log("Fetching user profile for ID:", userId);
      const response = await axios.get(`/user/${userId}`, {
        withCredentials: true,
      });
      console.info("Kullanıcı profili başarıyla alındı:", response.data);

      if (response.data && response.data.data) {
        setUser(response.data.data);
        initializeFormData(response.data.data);
      } else {
        console.error(
          "API yanıtında beklenen veri yapısı bulunamadı:",
          response.data
        );
        setError(
          "Kullanıcı bilgileri alınamadı. Lütfen daha sonra tekrar deneyin."
        );
      }
    } catch (err) {
      console.error("Kullanıcı profili getirme hatası:", err);
      setError(
        err.response?.data?.message ||
          "Kullanıcı profili yüklenirken bir hata oluştu"
      );
    } finally {
      setLoading(false);
    }
  };

  // Form verilerini başlat
  const initializeFormData = (userData) => {
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

  // Profil güncelleme
  const handleUpdateProfile = async () => {
    try {
      setSaveLoading(true);
      setSaveError(null);

      const username = user.userName || user.username;
      if (!username) {
        setSaveError(
          "Kullanıcı bilgileri eksik. Lütfen sayfayı yenileyip tekrar deneyin."
        );
        return;
      }

      const response = await axios.put(`/user/${username}`, formData, {
        withCredentials: true,
      });
      console.info("Kullanıcı profili başarıyla güncellendi:", response.data);

      if (response.data && response.data.data) {
        setUser(response.data.data);
        setEditMode(false);
        onClose();
      } else {
        console.error(
          "API yanıtında beklenen veri yapısı bulunamadı:",
          response.data
        );
        setSaveError(
          "Profil güncellenemedi. Lütfen daha sonra tekrar deneyin."
        );
      }
    } catch (err) {
      console.error("Kullanıcı profili güncelleme hatası:", err);
      setSaveError(
        err.response?.data?.message || "Profil güncellenirken bir hata oluştu"
      );
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

  // Component mount olduğunda kullanıcı bilgilerini getir
  useEffect(() => {
    console.log(
      "ProfileComponent mounted with userId:",
      userId,
      "and userInfo:",
      propUserInfo
    );
    fetchUserProfile();
  }, [userId, propUserInfo]);

  // Yükleme durumunda gösterilecek içerik
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" label="Profil yükleniyor..." />
      </div>
    );
  }

  // Hata durumunda gösterilecek içerik
  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-64 text-danger gap-4">
        <p>Hata: {error}</p>
        <Button color="primary" onClick={fetchUserProfile}>
          Tekrar Dene
        </Button>
      </div>
    );
  }

  // Kullanıcı bulunamadığında gösterilecek içerik
  if (!user) {
    return (
      <div className="flex flex-col justify-center items-center h-64 gap-4">
        <p>Kullanıcı bilgileri bulunamadı.</p>
        <Button color="primary" onClick={fetchUserProfile}>
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
              src={user.profileImage}
              size="lg"
              isBordered
              color={user.role === "admin" ? "danger" : "primary"}
            />
            <div className="flex flex-col gap-1 items-start justify-center">
              <h4 className="text-lg font-semibold">
                {user.fullName || user.userName || user.username}
              </h4>
              <p className="text-small text-default-500">
                {user.occupation || user.role}
              </p>
            </div>
          </div>
          <Button
            color="primary"
            variant="flat"
            onClick={() => {
              setEditMode(true);
              onOpen();
            }}
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
                    {user.bio || "Henüz bir biyografi eklenmemiş."}
                  </p>
                </div>
                <div>
                  <h5 className="text-sm font-semibold text-default-500">
                    Meslek
                  </h5>
                  <p className="mt-1">{user.occupation || "Belirtilmemiş"}</p>
                </div>
                <div>
                  <h5 className="text-sm font-semibold text-default-500">
                    Web Sitesi
                  </h5>
                  {user.website ? (
                    <Link
                      href={user.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1"
                    >
                      {user.website}
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
                  <p className="mt-1">{user.email}</p>
                </div>
                <div>
                  <h5 className="text-sm font-semibold text-default-500">
                    Sosyal Medya
                  </h5>
                  <div className="flex gap-4 mt-2">
                    {user.socialLinks?.twitter && (
                      <Link
                        href={user.socialLinks.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Icon icon="mdi:twitter" width={24} />
                      </Link>
                    )}
                    {user.socialLinks?.linkedin && (
                      <Link
                        href={user.socialLinks.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Icon icon="mdi:linkedin" width={24} />
                      </Link>
                    )}
                    {user.socialLinks?.github && (
                      <Link
                        href={user.socialLinks.github}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Icon icon="mdi:github" width={24} />
                      </Link>
                    )}
                    {!user.socialLinks?.twitter &&
                      !user.socialLinks?.linkedin &&
                      !user.socialLinks?.github && (
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
                  <p className="mt-1">{user.userName || user.username}</p>
                </div>
                <div>
                  <h5 className="text-sm font-semibold text-default-500">
                    Rol
                  </h5>
                  <p className="mt-1">{user.role}</p>
                </div>
                <div>
                  <h5 className="text-sm font-semibold text-default-500">
                    Hesap Durumu
                  </h5>
                  <p className="mt-1">
                    {user.isVerified ? "Doğrulanmış" : "Doğrulanmamış"}
                  </p>
                </div>
                <div>
                  <h5 className="text-sm font-semibold text-default-500">
                    Kayıt Tarihi
                  </h5>
                  <p className="mt-1">
                    {user.createdAt
                      ? new Date(user.createdAt).toLocaleDateString("tr-TR")
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
