import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  updateUserProfile,
  fetchUser,
} from "../../../../app/features/user/userSlice";
import {
  Spinner,
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/react";
import { logInfo, logError } from "../../../../utils/logger";
import { useFeedback } from "../../../../context/FeedbackContext";

// Modüler bileşenleri import ediyoruz
import {
  ProfileImageUploader,
  ProfileEditForm,
  ProfileSummaryCard,
  uploadProfileImage,
  validateImageFile,
  createImagePreview,
} from "./profile-components/ProfileComponents";

// Ana bileşen
const ProfileComponent = () => {
  const dispatch = useDispatch();
  const { userInfo, isLoading, isError, errorMessage } = useSelector(
    (state) => state.user
  );
  const { success, error: showError } = useFeedback();

  // State tanımlamaları
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [saveLoading, setSaveLoading] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isUserDataReady, setIsUserDataReady] = useState(false);

  // Profil resmi state'leri
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef(null);

  // Hata durumlarını izle
  useEffect(() => {
    if (isError && errorMessage) showError(errorMessage);
    if (saveError) showError(saveError);
  }, [isError, errorMessage, saveError, showError]);

  // Kullanıcı verilerini kontrol et
  useEffect(() => {
    if (!isLoading && !userInfo) {
      dispatch(fetchUser());
    }
  }, [isLoading, userInfo, dispatch]);

  // Form verilerini başlat
  useEffect(() => {
    if (userInfo) {
      initializeFormData(userInfo);
    }
  }, [userInfo]);

  // Form verilerini başlatma fonksiyonu
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

    setImagePreview(userData.profileImage || null);
    setSelectedImage(null);
  };

  // Resim seçme işleyicisi
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (validateImageFile(file, showError)) {
      setSelectedImage(file);
      createImagePreview(file, setImagePreview);
    }
  };

  // Düzenleme modunu başlat
  const handleStartEdit = async () => {
    if (!isUserDataReady) {
      try {
        await dispatch(fetchUser());
        setEditMode(true);
        onOpen();
      } catch (error) {
        showError(
          "Kullanıcı bilgileri getirilemedi. Lütfen sayfayı yenileyip tekrar deneyin."
        );
      }
    } else {
      logInfo("👤 Profil", "Düzenleme modu başlatıldı");
      setEditMode(true);
      onOpen();
    }
  };

  // Profil güncelleme işlevi
  const handleUpdateProfile = async () => {
    try {
      setSaveLoading(true);
      setSaveError(null);

      const userId = userInfo._id;
      if (!userId) {
        const errorMsg =
          "Kullanıcı ID'si bulunamadı. Lütfen sayfayı yenileyip tekrar deneyin.";
        logError("👤 Profil", errorMsg);
        setSaveError(errorMsg);
        return;
      }

      // Yeni resim yükleme
      let profileImageUrl = formData.profileImage;
      if (selectedImage) {
        const uploadedImageUrl = await uploadProfileImage(
          selectedImage,
          setUploadingImage,
          showError
        );
        if (uploadedImageUrl) {
          profileImageUrl = uploadedImageUrl;
        }
      }

      // Güncellenmiş form verisi
      const updatedFormData = {
        ...formData,
        profileImage: profileImageUrl,
      };

      // Redux eylemini gönder
      const resultAction = await dispatch(
        updateUserProfile({ userId, userData: updatedFormData })
      );

      if (updateUserProfile.fulfilled.match(resultAction)) {
        await dispatch(fetchUser());
        logInfo("👤 Profil", "Düzenleme modu kapatıldı");
        setEditMode(false);
        onClose();
        success("Profil bilgileriniz başarıyla güncellendi");
        setSelectedImage(null);
      } else if (updateUserProfile.rejected.match(resultAction)) {
        setSaveError(
          resultAction.payload || "Profil güncellenirken bir hata oluştu"
        );
      }
    } catch (err) {
      logError(
        "👤 Profil",
        "Profil güncelleme işleminde beklenmeyen hata",
        err
      );
      setSaveError("Profil güncellenirken bir hata oluştu");
    } finally {
      setSaveLoading(false);
    }
  };

  // Form değişikliklerini izleme
  const handleChange = (e) => {
    // Olay nesnesinin ve hedefinin tanımlı olduğundan emin oluyoruz
    if (!e || !e.target) return;

    const { name, value } = e.target;

    if (!name) return;

    // Derinlemesine nesne özellikleri için
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prevData) => ({
        ...prevData,
        [parent]: {
          ...(prevData[parent] || {}),
          [child]: value,
        },
      }));
    } else {
      // Basit özellikler için
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  // Dosya girişini tetikle
  const handleImageButtonClick = () => {
    fileInputRef.current.click();
  };

  // Seçilen resmi kaldır
  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImagePreview(userInfo.profileImage || null);
    setFormData({
      ...formData,
      profileImage: userInfo.profileImage || "",
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Yükleme görünümü
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" label="Profil yükleniyor..." />
      </div>
    );
  }

  // Hata görünümü
  if (isError) {
    return (
      <div className="flex flex-col justify-center items-center h-64 text-danger gap-4">
        <p>Hata: {errorMessage}</p>
        <Button color="primary" onPress={() => dispatch(fetchUser())}>
          Tekrar Dene
        </Button>
      </div>
    );
  }

  // Kullanıcı bulunamadı görünümü
  if (!userInfo) {
    return (
      <div className="flex flex-col justify-center items-center h-64 gap-4">
        <p>Kullanıcı bilgileri bulunamadı.</p>
        <Button color="primary" onPress={() => dispatch(fetchUser())}>
          Tekrar Dene
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <ProfileSummaryCard userInfo={userInfo} onEditClick={handleStartEdit} />

      {/* Profil Düzenleme Modalı */}
      <Modal
        isOpen={isOpen && editMode}
        onClose={onClose}
        size="2xl"
        scrollBehavior="inside"
        placement="center"
        classNames={{
          base: "sm:max-w-[80%] m-0 max-h-[90vh]",
          header: "border-b-[1px] border-default-100",
          footer: "border-t-[1px] border-default-100",
          closeButton: "hover:bg-default-100 active:bg-default-200",
        }}
        shouldBlockScroll={true}
        motionProps={{
          variants: {
            enter: {
              y: 0,
              opacity: 1,
              transition: {
                duration: 0.3,
                ease: "easeOut",
              },
            },
            exit: {
              y: 20,
              opacity: 0,
              transition: {
                duration: 0.2,
                ease: "easeIn",
              },
            },
          },
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Profil Düzenle
              </ModalHeader>
              <ModalBody className="pb-6">
                <ProfileImageUploader
                  imagePreview={imagePreview}
                  selectedImage={selectedImage}
                  uploadingImage={uploadingImage}
                  fileInputRef={fileInputRef}
                  userInfo={userInfo}
                  onImageChange={handleImageChange}
                  onImageClick={handleImageButtonClick}
                  onImageRemove={handleRemoveImage}
                />

                <ProfileEditForm
                  formData={formData}
                  handleChange={handleChange}
                />

                {saveError && <p className="text-danger mt-4">{saveError}</p>}
              </ModalBody>
              <ModalFooter>
                <Button variant="flat" onPress={onClose}>
                  İptal
                </Button>
                <Button
                  color="primary"
                  onPress={handleUpdateProfile}
                  isLoading={saveLoading || uploadingImage}
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
