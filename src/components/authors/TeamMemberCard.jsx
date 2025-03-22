import React from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Avatar,
  Link,
} from "@nextui-org/react";
import { Icon } from "@iconify/react";

const TeamMemberCard = ({ author }) => {
  // Default image for team members without a profile picture
  const defaultImage = "https://i.pravatar.cc/150?u=default";

  // Format social links for proper display with icon
  const socialLinks = [
    {
      name: "twitter",
      icon: "mdi:twitter",
      url: author.socialLinks?.twitter || "",
      color: "text-blue-500",
    },
    {
      name: "linkedin",
      icon: "mdi:linkedin",
      url: author.socialLinks?.linkedin || "",
      color: "text-blue-700",
    },
    {
      name: "github",
      icon: "mdi:github",
      url: author.socialLinks?.github || "",
      color: "text-gray-800",
    },
  ].filter((link) => link.url);

  return (
    <Card className="p-4 shadow-md hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="pb-0 pt-2 px-4 flex-col items-center">
        <Avatar
          isBordered
          radius="full"
          size="lg"
          src={author.profileImage || defaultImage}
          className="w-28 h-28 text-large"
          imgProps={{
            className: "object-cover",
          }}
        />
        <h4 className="font-bold text-xl mt-4">
          {author.fullName || author.userName || "Team Member"}
        </h4>
        <p className="text-small text-default-500 font-medium mt-1">
          {author.occupation || "Content Creator"}
        </p>
      </CardHeader>

      <CardBody className="py-4 text-center">
        <p className="text-default-700">
          {author.bio || "This team member hasn't added a bio yet."}
        </p>
      </CardBody>

      <CardFooter className="pt-0 justify-center gap-3">
        {socialLinks.length > 0 ? (
          socialLinks.map((link) => (
            <Link
              key={link.name}
              isExternal
              href={link.url}
              className={`${link.color} hover:opacity-80`}
            >
              <Icon icon={link.icon} width={24} height={24} />
            </Link>
          ))
        ) : (
          <p className="text-tiny text-default-400">
            No social links available
          </p>
        )}

        {author.website && (
          <Link
            isExternal
            href={author.website}
            className="text-primary hover:opacity-80"
          >
            <Icon icon="mdi:web" width={24} height={24} />
          </Link>
        )}
      </CardFooter>
    </Card>
  );
};

export default TeamMemberCard;
