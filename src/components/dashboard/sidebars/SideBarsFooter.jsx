import React from "react";
import { Icon } from "@iconify/react";
import { Link } from "react-router-dom";
import { Avatar } from "@nextui-org/react";

const SideBarsFooter = () => {
  return (
    <div className="border-t border-lime-900 p-4">
      <ul className="space-y-2">
        <li>
          <Link
            to="/settings"
            className="flex items-center p-2 rounded-lg hover:bg-lime-900"
          >
            <Icon
              icon="mdi:cog-outline"
              className="w-5 h-5 mr-2 text-neutral-50"
            />
            Ayarlar
          </Link>
        </li>
        <li>
          <Link
            to="/help"
            className="flex items-center p-2 rounded-lg hover:bg-lime-900"
          >
            <Icon
              icon="mdi:help-circle-outline"
              className="w-5 h-5 mr-2 text-neutral-50"
            />
            Yardım
          </Link>
        </li>
      </ul>
      <div className="flex flex-row mt-5 mb-2 text-sm content-center items-center">
        <Avatar
          src="https://via.placeholder.com/40/09f/333.png"
          alt="User Avatar"
          size="sm"
          color="success"
        />
        <p className="ml-4">Celal Berke Akyol</p>
      </div>
    </div>
  );
};

export default SideBarsFooter;
