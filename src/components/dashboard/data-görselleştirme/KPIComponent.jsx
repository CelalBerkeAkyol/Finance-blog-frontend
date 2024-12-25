import React from "react";
import { Card, Chip, cn } from "@nextui-org/react";
import { Icon } from "@iconify/react";

const data2 = [
  {
    title: "Monthly Sales",
    value: "$345,892",
    change: "12.5%",
    changeType: "positive",
    trendType: "up",
    trendChipVariant: "flat",
    trendChipPosition: "bottom",
  },
  {
    title: "Operating Costs",
    value: "$98,234",
    change: "18.3%",
    changeType: "negative",
    trendType: "up",
    trendChipVariant: "flat",
    trendChipPosition: "bottom",
  },
  {
    title: "Net Income",
    value: "$247,658",
    change: "15.2%",
    changeType: "neutral",
    trendType: "neutral",
    trendChipVariant: "flat",
    trendChipPosition: "bottom",
  },
];

const TrendCard = ({
  title,
  value,
  change,
  changeType,
  trendType,
  trendChipPosition = "top",
  trendChipVariant = "light",
}) => {
  return (
    <Card className=" border border-transparent dark:border-default-100">
      <div className="flex p-4">
        <div className="flex flex-col gap-y-2">
          <dt className="text-small font-medium text-default-500">{title}</dt>
          <dd className="text-2xl font-semibold text-default-700">{value}</dd>
        </div>
        <Chip
          className={cn("absolute right-4", {
            "top-4": trendChipPosition === "top",
            "bottom-4": trendChipPosition === "bottom",
          })}
          classNames={{
            content: "font-medium text-[0.65rem]",
          }}
          color={
            changeType === "positive"
              ? "success"
              : changeType === "neutral"
              ? "warning"
              : "danger"
          }
          radius="sm"
          size="sm"
          startContent={
            trendType === "up" ? (
              <Icon
                height={12}
                icon={"solar:arrow-right-up-linear"}
                width={12}
              />
            ) : trendType === "neutral" ? (
              <Icon height={12} icon={"solar:arrow-right-linear"} width={12} />
            ) : (
              <Icon
                height={12}
                icon={"solar:arrow-right-down-linear"}
                width={12}
              />
            )
          }
          variant={trendChipVariant}
        >
          {change}
        </Chip>
      </div>
    </Card>
  );
};

export default function KPIComponent() {
  return (
    <dl className="grid w-full grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 ">
      {data2.map((props, index) => (
        <TrendCard key={index} {...props} />
      ))}
    </dl>
  );
}
