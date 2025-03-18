import React from "react";
import { Icon } from "@iconify/react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import LogoutComponent from "../../auth/LogoutComponent";
import { Avatar } from "@nextui-org/react";

const BlogSidebarComponent = () => {
  const { isAdmin, userInfo } = useSelector((state) => state.user);

  return (
    <div className="w-1/6 h-screen flex flex-col border-r-1 border-r-content justify-between overflow-y-auto text-sm">
      {/* Logo */}
      <div className="p-4">
        <h1 className="text-2xl font-bold text-center">Fin AI</h1>
      </div>

      {/* Menu */}
      <nav className="flex-grow">
        <ul className="space-y-2 px-4">
          <li>
            <Link
              to="/blog/posts"
              className="flex items-center p-2 rounded-lg hover:bg-content3"
            >
              <Icon
                icon="mdi:account-group-outline"
                className="h-4 w-4 mr-2 "
              />
              Blog
            </Link>
          </li>
          <li>
            <Link
              to="/dashboard/posts"
              className="flex items-center p-2 rounded-lg hover:bg-content3"
            >
              <Icon
                icon="mdi:account-group-outline"
                className="h-4 w-4 mr-2 "
              />
              Postlar
            </Link>
          </li>
          <li>
            <Link
              to="/dashboard/post/new"
              className="flex items-center p-2 rounded-lg hover:bg-content3"
            >
              <Icon
                icon="mdi:account-group-outline"
                className="h-4 w-4 mr-2 "
              />
              New Post
            </Link>
          </li>
          <li>
            <Link
              to="/dashboard/gallery"
              className="flex items-center p-2 rounded-lg hover:bg-content3"
            >
              <Icon
                icon="mdi:account-group-outline"
                className="h-4 w-4 mr-2 "
              />
              Gallery
            </Link>
          </li>
          <li>
            <Link
              to="/dashboard/cheat-sheet"
              className="flex items-center p-2 rounded-lg hover:bg-content3"
            >
              <Icon
                icon="mdi:account-group-outline"
                className="h-4 w-4 mr-2 "
              />
              CheatSheet
            </Link>
          </li>
          {isAdmin && (
            <li>
              <Link
                to="/dashboard/users"
                className="flex items-center p-2 rounded-lg hover:bg-content3"
              >
                <Icon
                  icon="mdi:account-group-outline"
                  className="h-4 w-4 mr-2 "
                />
                Users
              </Link>
            </li>
          )}
        </ul>
      </nav>

      {/* User Actions Section */}
      <div className="p-4 border-t border-content">
        <div className="flex flex-col gap-2">
          <Link
            to="/profile"
            className="flex items-center p-2 rounded-lg hover:bg-content3 w-full"
          >
            <Avatar
              src={userInfo?.profileImage}
              fallback={<Icon icon="mdi:account" className="h-4 w-4" />}
              className="mr-2"
              size="sm"
            />
            {userInfo.userName}
          </Link>
          <div className="flex items-center p-2 rounded-lg hover:bg-content3 w-full">
            <Icon icon="mdi:logout" className="h-4 w-4 mr-2" />
            <LogoutComponent sidebar={true} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogSidebarComponent;
