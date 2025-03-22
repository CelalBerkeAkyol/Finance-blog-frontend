"use client";

import React from "react";
import {
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
  Cell,
  PolarAngleAxis,
} from "recharts";
import {
  Card,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  cn,
} from "@heroui/react";
import { Icon } from "@iconify/react";

const data = [
  {
    title: "Activity",
    color: "#6B7280", // Default
    total: 1358,
    chartData: [{ name: "Active Users", value: 780, fill: "#4F46E5" }],
  },
  {
    title: "Revenue",
    color: "#4F46E5", // Primary
    total: 2450,
    chartData: [{ name: "Monthly", value: 1840, fill: "#4F46E5" }],
  },
  {
    title: "Engagement",
    color: "#9333EA", // primary
    total: 4200,
    chartData: [{ name: "Daily Views", value: 3150, fill: "#9333EA" }],
  },
  {
    title: "Conversion",
    color: "#10B981", // Success
    total: 1000,
    chartData: [{ name: "Sales", value: 750, fill: "#10B981" }],
  },
  {
    title: "Bounce Rate",
    color: "#F59E0B", // Warning
    total: 100,
    chartData: [{ name: "Exits", value: 80, fill: "#F59E0B" }],
  },
  {
    title: "Errors",
    color: "#EF4444", // Danger
    total: 500,
    chartData: [{ name: "Issues", value: 450, fill: "#EF4444" }],
  },
];

export default function InfoComponent() {
  return (
    <div className="mt-4">
      <h2 className="text-xl sm:text-2xl md:text-3xl font-bold py-4 sm:py-6">
        Web Page Status
      </h2>
      <dl className="grid w-full grid-cols-1 gap-3 sm:gap-4 md:gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4">
        {data.map((item, index) => (
          <CircleChartCard key={index} {...item} />
        ))}
      </dl>
    </div>
  );
}

const formatTotal = (value) => {
  return value?.toLocaleString() ?? "0";
};

const CircleChartCard = React.forwardRef(
  ({ className, title, color, chartData, total, ...props }, ref) => {
    return (
      <Card
        ref={ref}
        className={cn(
          "h-[200px] sm:h-[220px] md:h-[250px] border border-transparent dark:border-default-100",
          className
        )}
        {...props}
      >
        <div className="flex flex-col gap-y-1 sm:gap-y-2 p-3 sm:p-4 pb-0">
          <div className="flex items-center justify-between gap-x-2">
            <dt>
              <h3 className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
                {title}
              </h3>
            </dt>
            <div className="flex items-center justify-end gap-x-2">
              <Dropdown
                classNames={{ content: "min-w-[120px]" }}
                placement="bottom-end"
              >
                <DropdownTrigger>
                  <Button isIconOnly radius="full" size="sm" variant="light">
                    <Icon height={16} icon="solar:menu-dots-bold" width={16} />
                  </Button>
                </DropdownTrigger>
                <DropdownMenu variant="flat">
                  <DropdownItem key="view-details">View Details</DropdownItem>
                  <DropdownItem key="export-data">Export Data</DropdownItem>
                  <DropdownItem key="set-alert">Set Alert</DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
          </div>
        </div>
        <div className="flex h-full gap-x-3">
          <ResponsiveContainer
            className="outline-none"
            height="100%"
            width="100%"
          >
            <RadialBarChart
              barSize={8}
              cx="50%"
              cy="50%"
              data={chartData}
              endAngle={-45}
              innerRadius={70}
              outerRadius={60}
              startAngle={225}
            >
              <PolarAngleAxis
                angleAxisId={0}
                domain={[0, total]}
                tick={false}
                type="number"
              />
              <RadialBar
                angleAxisId={0}
                animationDuration={1000}
                animationEasing="ease"
                background={{ fill: "#E5E7EB" }}
                cornerRadius={12}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </RadialBar>
              <g>
                <text textAnchor="middle" x="50%" y="48%">
                  <tspan
                    className="fill-gray-500 text-[10px] sm:text-tiny"
                    dy="-0.5em"
                    x="50%"
                  >
                    {chartData?.[0].name}
                  </tspan>
                  <tspan
                    className="fill-gray-900 dark:fill-gray-100 text-sm sm:text-medium font-semibold"
                    dy="1.5em"
                    x="50%"
                  >
                    {formatTotal(total)}
                  </tspan>
                </text>
              </g>
            </RadialBarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    );
  }
);

CircleChartCard.displayName = "CircleChartCard";
