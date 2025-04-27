import React, { useState } from "react";
import {
  Card,
  CardBody,
  Button,
  ScrollShadow,
  Tooltip,
} from "@nextui-org/react";
import { Icon } from "@iconify/react";

const IconSelector = ({ selectedIcon, onIconSelect }) => {
  const [searchTerm, setSearchTerm] = useState("");

  // Sık kullanılan ikonlar
  const commonIcons = [
    { name: "Etiket", icon: "mdi:tag" },
    { name: "Grafik", icon: "mdi:chart-line" },
    { name: "Finans", icon: "mdi:finance" },
    { name: "Para", icon: "mdi:cash" },
    { name: "Banka", icon: "mdi:bank" },
    { name: "Veri", icon: "mdi:database" },
    { name: "Kod", icon: "mdi:code-braces" },
    { name: "Yapay Zeka", icon: "mdi:brain" },
    { name: "Robot", icon: "mdi:robot" },
    { name: "Uygulama", icon: "mdi:application" },
    { name: "Belge", icon: "mdi:file-document" },
    { name: "Grafik", icon: "mdi:chart-areaspline" },
    { name: "Grafik", icon: "mdi:chart-bar" },
    { name: "Grafik", icon: "mdi:chart-pie" },
    { name: "Büyüteç", icon: "mdi:magnify" },
    { name: "Yardım", icon: "mdi:help-circle" },
    { name: "Analiz", icon: "mdi:chart-box" },
    { name: "Haber", icon: "mdi:newspaper" },
    { name: "Liste", icon: "mdi:view-list" },
    { name: "Kitap", icon: "mdi:book-open-page-variant" },
    { name: "Para", icon: "mdi:currency-usd" },
    { name: "Borsa", icon: "mdi:trending-up" },
    { name: "Kumbara", icon: "mdi:piggy-bank" },
    { name: "Cüzdan", icon: "mdi:wallet" },
  ];

  // Arama terimini içeren ikonlar
  const filteredIcons = searchTerm.trim()
    ? commonIcons.filter(
        (item) =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.icon.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : commonIcons;

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium mb-1">İkon Seçimi</label>

      <div className="relative mb-2">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="İkon ara..."
          className="w-full px-3 py-2 border rounded-md text-sm focus:ring-2 focus:ring-primary/30"
        />
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400">
          <Icon icon="mdi:magnify" />
        </div>
      </div>

      <Card shadow="sm">
        <CardBody>
          <ScrollShadow className="max-h-[180px]">
            <div className="grid grid-cols-6 sm:grid-cols-8 gap-2">
              {filteredIcons.map((item, index) => (
                <Tooltip key={index} content={item.icon}>
                  <Button
                    isIconOnly
                    variant={selectedIcon === item.icon ? "solid" : "light"}
                    color={selectedIcon === item.icon ? "primary" : "default"}
                    className="min-w-0 h-8 w-8"
                    onClick={() => onIconSelect(item.icon)}
                  >
                    <Icon icon={item.icon} />
                  </Button>
                </Tooltip>
              ))}
              {filteredIcons.length === 0 && (
                <p className="text-gray-500 text-sm col-span-full text-center py-4">
                  İkon bulunamadı
                </p>
              )}
            </div>
          </ScrollShadow>
        </CardBody>
      </Card>
    </div>
  );
};

export default IconSelector;
