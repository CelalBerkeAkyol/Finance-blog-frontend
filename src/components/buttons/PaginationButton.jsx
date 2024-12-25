import { Button } from "@nextui-org/react";

export const ArrowLeftIcon = ({
  fill = "currentColor",
  size,
  height,
  width,
  ...props
}) => {
  return (
    <svg
      fill={fill}
      height={size || height || 24}
      viewBox="0 0 24 24"
      width={size || width || 24}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M15 19l-7-7 7-7"
        stroke={fill}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const ArrowRightIcon = ({
  fill = "currentColor",
  size,
  height,
  width,
  ...props
}) => {
  return (
    <svg
      fill={fill}
      height={size || height || 24}
      viewBox="0 0 24 24"
      width={size || width || 24}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M9 5l7 7-7 7"
        stroke={fill}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

const PaginationButton = ({ canGoPrev, canGoNext, onPrev, onNext }) => {
  return (
    <div className="flex justify-end gap-2 my-2">
      {/* Geri Butonu */}
      <Button
        isIconOnly
        disabled={!canGoPrev}
        aria-label="Previous"
        variant="faded"
        onPress={onPrev}
        size="sm"
      >
        <ArrowLeftIcon />
      </Button>

      {/* İleri Butonu */}
      <Button
        isIconOnly
        disabled={!canGoNext}
        aria-label="Next"
        variant="faded"
        onPress={onNext}
        size="sm"
      >
        <ArrowRightIcon />
      </Button>
    </div>
  );
};

export default PaginationButton;
