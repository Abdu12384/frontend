import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Breadcrumbs = () => {
  const location = useLocation();


  const pathnames = location.pathname.split('/').filter((x) => x);

  // Check if the route is part of the admin side
  const isAdminPath = pathnames.includes('admin');

  return (
    <nav className=" px-5 py-3 rounded">
      <ol className="flex space-x-2 text-sm text-gray-500">
        {isAdminPath ? (
          // Admin side breadcrumbs
          <>
            <li>
              <Link to="/admin" className="text-purple-600 font-bold hover:underline">
                Admin
              </Link>
            </li>
            {pathnames.slice(1).map((value, index) => {
              const to = `/admin/${pathnames.slice(1, index + 1).join('/')}`;
              const isLast = index === pathnames.length - 2;

              return (
                <li key={to} className="flex items-center">
                  <span className="mx-2 text-white">/</span>
                  {isLast ? (
                    <span className="text-gray-100">{decodeURIComponent(value)}</span>
                  ) : (
                    <Link to={to} className="text-blue-600 hover:underline">
                      {decodeURIComponent(value)}
                    </Link>
                  )}
                </li>
              );
            })}
          </>
        ) : (
          // User side breadcrumbs
          <>
            <li>
              <Link to="/" className="text-blue-600 hover:underline">
                Home
              </Link>
            </li>
          </>
        )}
      </ol>
    </nav>
  );
};


export const BreadcrumbUserDhbrd = ({ items }) => {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2 text-gray-500">
        {items.map((item, index) => (
          <li key={index} className="flex items-center">
            {item.url ? (
              <Link
                to={item.url}
                className="hover:text-blue-600 transition duration-200"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-gray-700 font-medium">{item.label}</span>
            )}
            {index < items.length - 1 && (
              <span className="mx-2">/</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
