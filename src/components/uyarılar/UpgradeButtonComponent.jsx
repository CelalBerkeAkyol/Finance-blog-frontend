import { Alert, Button } from "@nextui-org/react";

export default function UpgradeButton() {
  return (
    <div className="flex items-center justify-center w-2/6 ">
      <Alert
        color="warning"
        description="Upgrade to a paid plan to continue"
        endContent={
          <Button color="warning" size="sm" variant="flat">
            Upgrade
          </Button>
        }
        title="Bu şirket ilk 100 şirket içerisinde değil"
        variant="faded"
      />
    </div>
  );
}
