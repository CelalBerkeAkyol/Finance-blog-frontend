import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
  Button,
  Input,
  Spinner,
} from "@nextui-org/react";
import { Icon } from "@iconify/react";
import {
  deleteUserAccount,
  clearUserState,
} from "../../app/features/user/userSlice";
import { useFeedback } from "../../context/FeedbackContext";
import { logInfo, logError } from "../../utils/logger";

const DeleteAccountPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { success, error: showError, warning } = useFeedback();
  const { userInfo, isLoading } = useSelector((state) => state.user);
  const [confirmText, setConfirmText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteConfirm = async () => {
    if (!userInfo) {
      showError("Kullanıcı bilgileri bulunamadı.");
      return;
    }

    if (confirmText !== userInfo.userName) {
      showError("Kullanıcı adınızı doğru girmelisiniz.");
      return;
    }

    // ID'yi doğru şekilde al
    const userId = userInfo.id || userInfo._id;

    if (!userId) {
      showError(
        "Kullanıcı ID'si bulunamadı. Lütfen sayfayı yenileyip tekrar deneyin."
      );
      return;
    }

    setIsDeleting(true);

    try {
      logInfo(
        "DeleteAccountPage",
        "Hesap silme isteği gönderiliyor, ID: " + userId
      );

      // ID'nin undefined, null veya boş string olup olmadığını son bir kez kontrol et

      const result = await dispatch(deleteUserAccount(userId)).unwrap();

      if (result.success) {
        // Kullanıcı oturumunu tamamen temizle
        dispatch(clearUserState());

        // Başarılı mesajı göster ve anasayfaya yönlendir
        success("Hesabınız başarıyla silindi.");

        // Sayfa yönlendirmesinden önce küçük bir gecikme ekle
        setTimeout(() => {
          navigate("/");
        }, 2000);
      } else {
        showError(
          "Hesap silme işlemi sırasında bir hata oluştu. Lütfen tekrar deneyin."
        );
      }
    } catch (err) {
      logError("DeleteAccountPage", "Hesap silme hatası:", err);
      showError(err.message || "Hesap silme işlemi sırasında bir hata oluştu.");
    } finally {
      setIsDeleting(false);
    }
  };

  // Yükleme durumu veya kullanıcı bilgisi yoksa
  if (isLoading || !userInfo) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner size="lg" label="Yükleniyor..." />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-xl mx-auto">
        <Card className="shadow-lg">
          <CardHeader className="flex gap-3 bg-danger-50">
            <Icon icon="mdi:alert-circle" className="text-danger" width={24} />
            <div className="flex flex-col">
              <p className="text-xl font-bold text-danger">Hesabı Sil</p>
              <p className="text-small text-default-500">
                Bu işlem geri alınamaz.
              </p>
            </div>
          </CardHeader>
          <Divider />
          <CardBody>
            <div className="space-y-6">
              <div className="p-4 bg-danger-50 rounded-lg">
                <h2 className="text-lg font-semibold text-danger mb-2">
                  Uyarı!
                </h2>
                <p className="text-sm">
                  Hesabınızı kalıcı olarak silmek üzeresiniz. Bu işlem geri
                  alınamaz ve tüm verileriniz kalıcı olarak silinecektir:
                </p>
                <ul className="list-disc ml-5 mt-2 text-sm">
                  <li>Kişisel bilgileriniz</li>
                  <li>Profiliniz</li>
                  <li>Hesap ayarlarınız</li>
                  <li>Tüm kayıtlı verileriniz</li>
                </ul>
              </div>

              <p className="text-sm">
                Hesabınızı kalıcı olarak silmek istediğinizden emin misiniz?
                Silinen hesap geri getirilemez. Eğer eminseniz, onay için
                kullanıcı adınızı aşağıya yazın:
              </p>

              <div className="mt-4">
                <Input
                  autoComplete="off"
                  placeholder={`Kullanıcı adınızı yazın (${userInfo.userName})`}
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  variant="bordered"
                  color="danger"
                  label="Kullanıcı Adınız"
                  labelPlacement="outside"
                  isDisabled={isDeleting}
                />
              </div>
            </div>
          </CardBody>
          <Divider />
          <CardFooter className="justify-between">
            <Button
              variant="flat"
              color="default"
              onClick={() => navigate(-1)}
              isDisabled={isDeleting}
            >
              Vazgeç
            </Button>
            <Button
              color="danger"
              onClick={handleDeleteConfirm}
              isLoading={isDeleting}
              isDisabled={confirmText !== userInfo.userName}
              startContent={<Icon icon="mdi:delete" />}
            >
              Hesabımı Kalıcı Olarak Sil
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default DeleteAccountPage;
