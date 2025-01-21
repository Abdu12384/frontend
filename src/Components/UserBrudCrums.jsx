import React from 'react';
import { Link } from 'react-router-dom'; // Assuming you're using react-router

const UserBreadcrumb = ({ productName }) => {
  return (
    <nav className="text-sm mb-4">
      <ol className="list-reset flex text-gray-500">
        <li>
          <Link to="/" className="text-[#8b6c5c] hover:text-[#3d2516]">Home</Link>
        </li>
        <li>
          <span className="mx-2">/</span>
        </li>
        <li className="text-gray-800 font-semibold">
          {productName}
        </li>
      </ol>
    </nav>
  );
};

export default UserBreadcrumb;
