"use client";

import React from "react";
import {
  Button,
  Card,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Progress,
  cn,
} from "@heroui/react";
import { Icon } from "@iconify/react";

const serverData = [
  {
    title: "CPU Usage",
    value: 38,
    status: "good",
    iconName: "solar:server-square-linear",
  },
  {
    title: "Server Load",
    value: 98,
    status: "danger",
    iconName: "solar:server-square-linear",
  },
  {
    title: "Memory Usage",
    value: 64,
    status: "warn",
    iconName: "solar:sd-card-linear",
  },
  {
    title: "Band Usage",
    value: 84,
    status: "danger",
    iconName: "solar:sd-card-linear",
  },
];

export default function ServerStatus() {
  return (
    <div className="mb-6">
      <h2 className="text-xl sm:text-2xl md:text-3xl font-bold py-4 sm:py-6">
        Server Status
      </h2>
      <dl className="grid w-full grid-cols-1 gap-3 sm:gap-4 md:gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {serverData.map(({ title, value, status, iconName }, index) => (
          <Card
            key={index}
            className="flex flex-col border border-transparent p-3 sm:p-4 dark:border-default-100"
          >
            <div
              className={cn(
                "flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-md border p-0.5",
                {
                  "border-success-200 bg-success-50 dark:border-success-100":
                    status === "good",
                  "border-warning-200 bg-warning-50 dark:border-warning-100":
                    status === "warn",
                  "border-danger-200 bg-danger-50 dark:border-danger-100":
                    status === "danger",
                }
              )}
            >
              <Icon
                className={cn({
                  "text-success-500": status === "good",
                  "text-warning-500": status === "warn",
                  "text-danger-500": status === "danger",
                })}
                icon={iconName}
                width={18}
              />
            </div>

            <div className="pt-1">
              <dt className="my-1 sm:my-2 text-xs sm:text-sm font-medium text-default-500">
                {title}
              </dt>
              <dd className="text-xl sm:text-2xl font-semibold text-default-700">
                {value}%
              </dd>
            </div>

            <Progress
              aria-label="Server Status"
              className="mt-2"
              color={
                status === "good"
                  ? "success"
                  : status === "warn"
                  ? "warning"
                  : "danger"
              }
              value={value}
            />

            <Dropdown
              classNames={{ content: "min-w-[120px]" }}
              placement="bottom-end"
            >
              <DropdownTrigger>
                <Button
                  isIconOnly
                  className="absolute right-2 top-2 w-auto rounded-full"
                  size="sm"
                  variant="light"
                >
                  <Icon height={16} icon="solar:menu-dots-bold" width={16} />
                </Button>
              </DropdownTrigger>
              <DropdownMenu itemClasses={{ title: "text-tiny" }} variant="flat">
                <DropdownItem key="view-details">View Details</DropdownItem>
                <DropdownItem key="export-data">Export Data</DropdownItem>
                <DropdownItem key="set-alert">Set Alert</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </Card>
        ))}
      </dl>
    </div>
  );
}
