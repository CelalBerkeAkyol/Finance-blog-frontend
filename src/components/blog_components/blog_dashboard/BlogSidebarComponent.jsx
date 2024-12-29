import React from "react";
import { Icon } from "@iconify/react";

import { Link } from "react-router-dom";

const BlogSidebarComponent = () => {
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
              to="/blog-admin/posts"
              className="flex items-center p-2 rounded-lg hover:bg-content3"
            >
              <Icon
                icon="mdi:account-group-outline"
                className="h-4 w-4 mr-2 "
              />
              Postlar
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default BlogSidebarComponent;
