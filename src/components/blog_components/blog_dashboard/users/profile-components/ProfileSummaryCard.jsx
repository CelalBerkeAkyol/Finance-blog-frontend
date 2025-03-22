import React from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Avatar,
  Button,
  Divider,
} from "@nextui-org/react";
import { Icon } from "@iconify/react";
import ProfileTabs from "./ProfileTabs";

// Profil özet kartı
const ProfileSummaryCard = ({ userInfo, onEditClick }) => (
  <Card className="mb-6">
    <CardHeader className="justify-between">
      <div className="flex gap-4">
        <Avatar src={userInfo.profileImage} size="lg" isBordered />
        <div className="flex flex-col gap-1 items-start justify-center">
          <h4 className="text-lg font-semibold">
            {userInfo.fullName || userInfo.userName || userInfo.username}
          </h4>
          <p className="text-small text-default-500">
            {userInfo.occupation || userInfo.role}
          </p>
        </div>
      </div>
      <Button
        color="primary"
        variant="flat"
        onPress={onEditClick}
        startContent={<Icon icon="mdi:pencil" />}
      >
        Profili Düzenle
      </Button>
    </CardHeader>
    <Divider />
    <CardBody>
      <ProfileTabs userInfo={userInfo} />
    </CardBody>
  </Card>
);

export default ProfileSummaryCard;
