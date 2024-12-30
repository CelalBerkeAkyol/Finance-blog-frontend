// src/components/blog_components/blog_dashboard/blog_post/TableCellContent.jsx
import React from "react";
import {
  Chip,
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react";
import { capitalize } from "../../../../utils/capitalize";

const statusColorMap = {
  yayında: "success",
  düzenleniyor: "warning",
  arşivlenmiş: "secondary",
  taslak: "secondary",
};

const TableCellContent = ({ blog, columnKey }) => {
  const cellValue = blog[columnKey];

  switch (columnKey) {
    case "title":
      return (
        <span>{cellValue}</span> // sadece blog title dön
      );
    case "status":
      return (
        <Chip
          color={statusColorMap[blog.status] || "default"}
          className="capitalize"
        >
          {capitalize(blog.status)}
        </Chip>
      );
    case "createdAt":
    case "updatedAt":
      return new Date(cellValue).toLocaleDateString();
    case "actions":
      return (
        <div className="relative flex justify-end items-center gap-2">
          <Dropdown>
            <DropdownTrigger>
              <Button isIconOnly radius="full" size="sm" variant="light">
                {/* İkonu kaldırmak istiyorsanız burayı basitleştirin */}
                <span>⋮</span>
              </Button>
            </DropdownTrigger>
            <DropdownMenu>
              <DropdownItem key={`view-${blog._id}`}>View</DropdownItem>
              <DropdownItem key={`edit-${blog._id}`}>Edit</DropdownItem>
              <DropdownItem key={`delete-${blog._id}`}>Delete</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      );
    default:
      return cellValue;
  }
};

export default TableCellContent;
