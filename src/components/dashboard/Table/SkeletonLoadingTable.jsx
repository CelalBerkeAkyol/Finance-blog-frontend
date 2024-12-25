// src/components/SkeletonLoadingTable.jsx
import React from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Skeleton,
} from "@nextui-org/react";

export default function SkeletonLoadingTable() {
  // Örnek olarak 15 satır ve 4 kolon için skeleton gösterelim
  const rowCount = 15;
  const colCount = 3;

  return (
    <Table aria-label="Loading Table Skeleton" isStriped>
      <TableHeader>
        {Array.from({ length: colCount }).map((_, colIndex) => (
          <TableColumn
            key={colIndex}
            isRowHeader={true}
            className="h-16 bg-[#D8D8D9]"
          >
            <Skeleton className="w-52 h-6 rounded-lg" />
          </TableColumn>
        ))}
      </TableHeader>
      <TableBody>
        {Array.from({ length: rowCount }).map((_, rowIndex) => (
          <TableRow key={rowIndex}>
            {Array.from({ length: colCount }).map((_, colIndex) => (
              <TableCell key={colIndex} className="h-12">
                <Skeleton className="h-6 w-40 rounded-lg" />
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
