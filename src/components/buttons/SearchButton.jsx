import React from "react";

const SearchButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="flex flex-auto w-full items-center justify-start text-sm gap-2 px-4 py-2 border border-gray-300 rounded-lg shadow-sm bg-white text-black hover:bg-gray-100 focus:ring-2 focus:ring-gray-500 focus:outline-none"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1"
        stroke="currentColor"
        className="w-5 h-5"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M11 19a8 8 0 100-16 8 8 0 000 16zm9-2l-3.35-3.35"
        />
      </svg>
      Search
    </button>
  );
};

export default SearchButton;
