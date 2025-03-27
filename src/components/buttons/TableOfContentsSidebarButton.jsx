import React, { useState, useCallback } from "react";
import { Icon } from "@iconify/react";
import TableOfContents from "../blog_components/blog/TableOfContents";

const TableOfContentsSidebarButton = ({ content }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = useCallback(() => {
    setIsOpen((prevState) => !prevState);
  }, []);

  return (
    <>
      {/* Table of Contents Sidebar Button */}
      <div
        className={`fixed bottom-20 right-5 z-50 transition-opacity duration-300`}
      >
        <button
          onClick={toggleSidebar}
          className="bg-gray-700 hover:bg-gray-900 text-white w-10 h-10 rounded-full shadow-lg flex items-center justify-center touch-manipulation"
          aria-label="İçindekiler"
          type="button"
        >
          <Icon icon="mdi:table-of-contents" width="18" />
        </button>
      </div>

      {/* Table of Contents Sidebar */}
      <div
        className={`fixed top-0 right-0 z-50 h-full w-64 sm:w-72 md:w-80 bg-white/90 backdrop-blur-sm shadow-lg transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } overflow-y-auto`}
      >
        {/* Close Button */}
        <div className="sticky top-0 p-4 bg-white/80 backdrop-blur-sm z-10">
          <button
            onClick={toggleSidebar}
            className="absolute top-2 right-2 p-2 rounded-full hover:bg-gray-200 transition-colors"
            aria-label="Kapat"
          >
            <Icon icon="mdi:close" width="20" />
          </button>
          <h2 className="text-xl font-bold text-gray-800 ml-2">İçindekiler</h2>
        </div>

        {/* Table of Contents */}
        <div className="px-2 pb-4">
          {content && <TableOfContents content={content} />}
        </div>
      </div>

      {/* Overlay when sidebar is open */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40"
          onClick={toggleSidebar}
          aria-hidden="true"
        />
      )}
    </>
  );
};

export default TableOfContentsSidebarButton;
