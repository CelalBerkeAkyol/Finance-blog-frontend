import React from "react";
import { Icon } from "@iconify/react";
import SearchButton from "../../buttons/SearchButton";
import { Link } from "react-router-dom";
import SideBarsFooter from "./SideBarsFooter";
const LeftSidebar = () => {
  return (
    <div className="w-64 bg-lime-800 text-neutral-100 h-screen flex flex-col  justify-between overflow-y-auto text-sm">
      {/* Logo */}
      <div className="p-4">
        <h1 className="text-2xl font-bold text-center">Fin AI</h1>
      </div>

      {/* Menu */}
      <nav className="flex-grow">
        <ul className="space-y-3 px-4">
          <li>
            <SearchButton />
          </li>
          <li>
            <Link
              to="/app"
              className="flex items-center p-2 rounded-lg hover:bg-lime-900"
            >
              <Icon
                icon="material-symbols:dashboard"
                className="w-5 h-5 mr-2 text-neutral-50"
              />
              Dashboard
            </Link>
          </li>
          <li>
            <Link
              to="/flow"
              className="flex items-center p-2 rounded-lg hover:bg-lime-900"
            >
              <Icon
                icon="mdi:flowchart"
                className="w-5 h-5 mr-2 text-neutral-50"
              />
              Akış
            </Link>
          </li>
          <li>
            <Link
              to="/sectors"
              className="flex items-center p-2 rounded-lg hover:bg-lime-900"
            >
              <Icon
                icon="material-symbols:business-center-outline"
                className="w-5 h-5 mr-2 text-neutral-50"
              />
              Sektörler
            </Link>
          </li>
          <li>
            <Link
              to="/compare"
              className="flex items-center p-2 rounded-lg hover:bg-lime-900"
            >
              <Icon
                icon="mdi:scale-balance"
                className="w-5 h-5 mr-2 text-neutral-50"
              />
              Sektör Karşılaştırma
            </Link>
          </li>
          <li>
            <Link
              to="/app/all-companies"
              className="flex items-center p-2 rounded-lg hover:bg-lime-900"
            >
              <Icon
                icon="mdi:office-building"
                className="w-5 h-5 mr-2 text-neutral-50"
              />
              Companies
            </Link>
          </li>

          <li>
            <Link
              to="/favorites"
              className="flex items-center p-2 rounded-lg hover:bg-lime-900"
            >
              <Icon
                icon="mdi:star-outline"
                className="w-5 h-5 mr-2 text-neutral-50"
              />
              Favoriler
            </Link>
          </li>

          {/* --- Yeni Chatbot List Elemanı (En Sona Ekledik) --- */}
          <li>
            <Link
              to="/app/chatbot"
              className="flex items-center p-2 rounded-lg hover:bg-lime-900"
            >
              <Icon
                icon="mdi:chat-processing-outline"
                className="w-5 h-5 mr-2 text-neutral-50"
              />
              Chatbot
            </Link>
          </li>
        </ul>
      </nav>

      <SideBarsFooter />
    </div>
  );
};

export default LeftSidebar;
