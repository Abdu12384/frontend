import React from "react";

const StatusBadge = ({ status }) => {
  const statusClasses = {
    Active: "bg-green-100 text-green-800 ring-green-600/20",
    Blocked: "bg-red-100 text-red-800 ring-red-600/20",
    Available: "bg-blue-100 text-blue-800 ring-blue-600/20",
    Unavailable: "bg-gray-100 text-gray-800 ring-gray-600/20",
    Pending: "bg-yellow-100 text-yellow-800 ring-yellow-600/20",
    Processing: "bg-purple-100 text-purple-800 ring-purple-600/20",
  };

  return (
    <span
      className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${
        statusClasses[status] || "bg-gray-100 text-gray-800 ring-gray-600/20"
      }`}
    >
      {status}
    </span>
  );
};

export default StatusBadge;