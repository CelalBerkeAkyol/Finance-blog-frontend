import React from "react";
import ChatButton from "../../buttons/ChatButton";

const RightSidebar = () => {
  const favoriteCompanies = [
    { name: "S&P 500", value: "+0.30%", change: "+13.02" },
    { name: "Nasdaq", value: "+0.15%", change: "+8.45" },
    { name: "DAX", value: "+0.10%", change: "+5.13" },
    { name: "FTSE 100", value: "+0.20%", change: "+6.52" },
    { name: "Nikkei 225", value: "-0.05%", change: "-3.12" },
  ];

  return (
    <div className="w-64 bg-gray-100 h-screen flex flex-col justify-between overflow-y-auto p-4">
      {/* Başlık */}
      <h2 className="text-lg font-bold mb-4">Favori Şirketler</h2>

      {/* Şirketler Listesi */}
      <ul className="space-y-2 flex-grow">
        {favoriteCompanies.map((company, index) => (
          <li
            key={index}
            className="flex justify-between items-center bg-gray-200 p-2 rounded-lg"
          >
            <span className="font-medium">{company.name}</span>
            <div className="text-right">
              <p className="text-green-500 text-sm">{company.value}</p>
              <p className="text-xs text-gray-500">{company.change}</p>
            </div>
          </li>
        ))}
      </ul>

      {/* Chat Bot */}
      <div className="mt-6">
        <ChatButton />
      </div>
    </div>
  );
};

export default RightSidebar;
