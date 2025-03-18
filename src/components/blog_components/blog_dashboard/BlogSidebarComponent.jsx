import React, { useState } from "react";
import { Icon } from "@iconify/react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import LogoutComponent from "../../auth/LogoutComponent";
import { Avatar, Button } from "@nextui-org/react";

const BlogSidebarComponent = () => {
  const { isAdmin, userInfo } = useSelector((state) => state.user);
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  // Sidebar genişliği için dinamik sınıf
  const sidebarClass = isOpen ? "w-64 md:w-1/5 lg:w-1/6" : "w-16 md:w-16";

  return (
    <div
      className={`${sidebarClass} h-screen flex flex-col border-r-1 border-r-content justify-between overflow-y-auto text-sm transition-all duration-300 relative bg-white`}
    >
      {/* Toggle Button - Sadece küçük ekranlarda görünür */}
      <button
        onClick={toggleSidebar}
        className="absolute -right-3 top-4 bg-white rounded-full p-1 shadow-md border border-gray-200 z-10"
      >
        <Icon
          icon={isOpen ? "mdi:chevron-left" : "mdi:chevron-right"}
          className="h-4 w-4"
        />
      </button>

      {/* Logo */}
      <div className="p-4 text-center">
        {isOpen ? (
          <h1 className="text-xl font-bold">Fin AI</h1>
        ) : (
          <h1 className="text-lg font-bold">F</h1>
        )}
      </div>

      {/* Menu */}
      <nav className="flex-grow">
        <ul className="space-y-2 px-2">
          <li>
            <Link
              to="/blog/posts"
              className="flex items-center p-2 rounded-lg hover:bg-content3"
            >
              <Icon
                icon="mdi:newspaper-variant-outline"
                className="h-5 w-5 min-w-5"
              />
              {isOpen && <span className="ml-2">Blog</span>}
            </Link>
          </li>
          <li>
            <Link
              to="/dashboard/posts"
              className="flex items-center p-2 rounded-lg hover:bg-content3"
            >
              <Icon icon="mdi:view-list-outline" className="h-5 w-5 min-w-5" />
              {isOpen && <span className="ml-2">Postlar</span>}
            </Link>
          </li>
          <li>
            <Link
              to="/dashboard/post/new"
              className="flex items-center p-2 rounded-lg hover:bg-content3"
            >
              <Icon
                icon="mdi:file-document-plus-outline"
                className="h-5 w-5 min-w-5"
              />
              {isOpen && <span className="ml-2">New Post</span>}
            </Link>
          </li>
          <li>
            <Link
              to="/dashboard/gallery"
              className="flex items-center p-2 rounded-lg hover:bg-content3"
            >
              <Icon
                icon="mdi:image-multiple-outline"
                className="h-5 w-5 min-w-5"
              />
              {isOpen && <span className="ml-2">Gallery</span>}
            </Link>
          </li>
          <li>
            <Link
              to="/dashboard/cheat-sheet"
              className="flex items-center p-2 rounded-lg hover:bg-content3"
            >
              <Icon
                icon="mdi:file-document-outline"
                className="h-5 w-5 min-w-5"
              />
              {isOpen && <span className="ml-2">CheatSheet</span>}
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
                  className="h-5 w-5 min-w-5"
                />
                {isOpen && <span className="ml-2">Users</span>}
              </Link>
            </li>
          )}
        </ul>
      </nav>

      {/* User Actions Section */}
      <div className="p-2 border-t border-content">
        <div className="flex flex-col gap-2">
          <Link
            to="/profile"
            className="flex items-center p-2 rounded-lg hover:bg-content3 w-full"
          >
            <Avatar
              src={userInfo?.profileImage}
              fallback={<Icon icon="mdi:account" className="h-4 w-4" />}
              size="sm"
            />
            {isOpen && (
              <span className="ml-2 truncate">{userInfo.userName}</span>
            )}
          </Link>
          <div className="flex items-center p-2 rounded-lg hover:bg-content3 w-full">
            <Icon icon="mdi:logout" className="h-5 w-5 min-w-5" />
            {isOpen ? (
              <LogoutComponent sidebar={true} />
            ) : (
              <span className="sr-only">Logout</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogSidebarComponent;
