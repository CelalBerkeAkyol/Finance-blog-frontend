import React from "react";

const statusOptions = ["yayında", "düzenleniyor", "arşivlenmiş", "taslak"];

const StatusSelector = ({ value, onChange }) => {
  const handleStatusChange = (e) => {
    onChange(e.target.value);
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700">
        Durum Seçin
      </label>
      <select
        value={value}
        onChange={handleStatusChange}
        className="w-full p-2 border rounded-md"
      >
        {statusOptions.map((status) => (
          <option key={status} value={status}>
            {status}
          </option>
        ))}
      </select>
    </div>
  );
};

export default StatusSelector;
