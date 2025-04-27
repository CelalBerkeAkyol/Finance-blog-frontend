import React from "react";
import { Card, CardBody, Button, Tooltip } from "@nextui-org/react";

const ColorSelector = ({ selectedColor, onColorSelect }) => {
  // Arka plan renk sınıfları
  const colors = [
    { name: "Mavi", class: "bg-blue-500" },
    { name: "Koyu Mavi", class: "bg-blue-600" },
    { name: "İndigo", class: "bg-indigo-600" },
    { name: "Mor", class: "bg-purple-600" },
    { name: "Pembe", class: "bg-pink-600" },
    { name: "Kırmızı", class: "bg-red-600" },
    { name: "Gül", class: "bg-rose-600" },
    { name: "Turuncu", class: "bg-orange-500" },
    { name: "Sarı", class: "bg-amber-500" },
    { name: "Yeşil", class: "bg-green-600" },
    { name: "Turkuaz", class: "bg-teal-600" },
    { name: "Deniz", class: "bg-cyan-600" },
    { name: "Gri", class: "bg-gray-500" },
    { name: "Koyu Gri", class: "bg-gray-600" },
    { name: "Arduvaz", class: "bg-slate-600" },
    { name: "Koyu Arduvaz", class: "bg-slate-800" },
  ];

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium mb-1">Renk Seçimi</label>

      <Card shadow="sm">
        <CardBody>
          <div className="grid grid-cols-8 gap-2">
            {colors.map((color, index) => (
              <Tooltip key={index} content={color.name}>
                <Button
                  isIconOnly
                  className={`w-8 h-8 rounded-md min-w-0 p-0 ${
                    selectedColor === color.class
                      ? "ring-2 ring-offset-2 ring-primary"
                      : ""
                  } ${color.class}`}
                  onClick={() => onColorSelect(color.class)}
                />
              </Tooltip>
            ))}
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default ColorSelector;
