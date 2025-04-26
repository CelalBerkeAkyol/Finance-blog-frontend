import React, { useState, useMemo, useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Textarea,
  Switch,
  Card,
  CardBody,
  Divider,
} from "@nextui-org/react";
import { Icon } from "@iconify/react";
import IconSelector from "./IconSelector";
import ColorSelector from "./ColorSelector";

const CategoryFormModal = ({ isOpen, onClose, onSave, category }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    icon: "mdi:tag",
    color: "bg-slate-600",
    active: true,
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mevcut kategori verileri ile form alanlarını doldur
  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name || "",
        description: category.description || "",
        icon: category.icon || "mdi:tag",
        color: category.color || "bg-slate-600",
        active: category.active !== undefined ? category.active : true,
      });
    } else {
      // Yeni kategori eklerken formu sıfırla
      setFormData({
        name: "",
        description: "",
        icon: "mdi:tag",
        color: "bg-slate-600",
        active: true,
      });
    }
    setErrors({});
  }, [category, isOpen]);

  // Modal başlığı
  const modalTitle = useMemo(() => {
    return category ? "Kategori Düzenle" : "Yeni Kategori Ekle";
  }, [category]);

  // Değer değişiklikleri
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // İlgili hatayı temizle
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  const handleIconChange = (newIcon) => {
    setFormData({ ...formData, icon: newIcon });
  };

  const handleColorChange = (newColor) => {
    setFormData({ ...formData, color: newColor });
  };

  const handleSwitchChange = (isSelected) => {
    setFormData({ ...formData, active: isSelected });
  };

  // Verileri doğrula
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Kategori adı zorunludur";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Kategori açıklaması zorunludur";
    } else if (formData.description.length > 250) {
      newErrors.description = "Açıklama 250 karakterden uzun olamaz";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Formu gönder
  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await onSave(formData);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="3xl">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              {modalTitle}
            </ModalHeader>
            <ModalBody>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <Input
                    label="Kategori Adı"
                    placeholder="Örn: Finansal Analiz"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    isInvalid={!!errors.name}
                    errorMessage={errors.name}
                    isRequired
                  />

                  <Textarea
                    label="Kategori Açıklaması"
                    placeholder="Bu kategorinin içeriğini tanımlayan kısa bir açıklama"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    isInvalid={!!errors.description}
                    errorMessage={errors.description}
                    maxLength={250}
                    isRequired
                  />

                  <div className="flex items-center justify-between">
                    <p className="text-sm">Aktif</p>
                    <Switch
                      isSelected={formData.active}
                      onValueChange={handleSwitchChange}
                      color="success"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <IconSelector
                    selectedIcon={formData.icon}
                    onIconSelect={handleIconChange}
                  />

                  <Divider className="my-2" />

                  <ColorSelector
                    selectedColor={formData.color}
                    onColorSelect={handleColorChange}
                  />

                  <Card className="mt-4" shadow="sm">
                    <CardBody>
                      <p className="text-sm font-medium mb-2">Önizleme:</p>
                      <div className="flex items-center gap-2">
                        <div className={`p-2 rounded-lg ${formData.color}`}>
                          <Icon
                            icon={formData.icon}
                            className="text-white text-xl"
                          />
                        </div>
                        <div>
                          <p className="font-medium">
                            {formData.name || "Kategori Adı"}
                          </p>
                          <p className="text-xs text-gray-500 line-clamp-1">
                            {formData.description || "Kategori açıklaması"}
                          </p>
                        </div>
                      </div>
                      <div className="mt-2 text-xs text-gray-400">
                        {formData.active ? "Aktif" : "Pasif"} durum
                      </div>
                    </CardBody>
                  </Card>
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button variant="flat" onPress={onClose}>
                İptal
              </Button>
              <Button
                color="primary"
                onPress={handleSubmit}
                isLoading={isSubmitting}
              >
                Kaydet
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default CategoryFormModal;
