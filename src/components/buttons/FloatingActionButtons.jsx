import React, { useState, useCallback, useEffect } from "react";
import { Icon } from "@iconify/react";
import TableOfContents from "../blog_components/blog/TableOfContents";
import ScrollToTopButton from "./ScrollToTopButton";

const FloatingActionButtons = ({ content }) => {
  const [isTocOpen, setIsTocOpen] = useState(false);
  const [showTocButton, setShowTocButton] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const toggleTocSidebar = useCallback(() => {
    setIsTocOpen((prevState) => !prevState);
  }, []);

  // Handle scroll event to show/hide TOC button
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Hide when scrolling down, show when scrolling up
      if (currentScrollY > lastScrollY && currentScrollY > 40) {
        // Scrolling down
        setShowTocButton(false);
      } else {
        // Scrolling up
        setShowTocButton(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <>
      {/* Table of Contents Sidebar Button - Only on mobile */}
      <div
        className={`fixed bottom-5 right-5 z-50 transition-opacity duration-300 md:hidden ${
          showTocButton ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <button
          onClick={toggleTocSidebar}
          className="bg-gray-700 hover:bg-gray-900 text-white w-10 h-10 rounded-full shadow-lg flex items-center justify-center touch-manipulation"
          aria-label="Başlıklar"
          type="button"
        >
          <Icon icon="mdi:table-of-contents" width="18" />
        </button>
      </div>

      {/* Scroll to Top Button comes at default position */}
      <ScrollToTopButton />

      {/* Table of Contents Sidebar - Only visible when button clicked */}
      <div
        className={`fixed top-0 right-0 z-50 h-full w-64 sm:w-72 md:hidden bg-white/90 backdrop-blur-sm shadow-lg transition-transform duration-300 ${
          isTocOpen ? "translate-x-0" : "translate-x-full"
        } overflow-y-auto`}
      >
        {/* Close Button */}
        <div className="sticky top-0 p-4 bg-white/80 backdrop-blur-sm z-10">
          <button
            onClick={toggleTocSidebar}
            className="absolute top-2 right-2 p-2 rounded-full hover:bg-gray-200 transition-colors"
            aria-label="Kapat"
          >
            <Icon icon="mdi:close" width="20" />
          </button>
          <h2 className="text-xl font-bold text-gray-800 ml-2">Başlıklar</h2>
        </div>

        {/* Table of Contents */}
        <div className="px-2 pb-4">
          {content && <TableOfContents content={content} />}
        </div>
      </div>

      {/* Overlay when sidebar is open */}
      {isTocOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40 md:hidden"
          onClick={toggleTocSidebar}
          aria-hidden="true"
        />
      )}
    </>
  );
};

export default FloatingActionButtons;
