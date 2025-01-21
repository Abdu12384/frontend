import React from 'react'

export function Customers() {
  return (
    <div className="text-white">
      <h2 className="text-2xl font-semibold mb-4">Customers</h2>
      <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-2xl p-6">
        <table className="w-full">
          <thead>
            <tr className="text-left">
              <th className="pb-3">ID</th>
              <th className="pb-3">Name</th>
              <th className="pb-3">Email</th>
              <th className="pb-3">Total Orders</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="py-2">1</td>
              <td className="py-2">John Doe</td>
              <td className="py-2">john@example.com</td>
              <td className="py-2">5</td>
            </tr>
            <tr>
              <td className="py-2">2</td>
              <td className="py-2">Jane Smith</td>
              <td className="py-2">jane@example.com</td>
              <td className="py-2">3</td>
            </tr>
            <tr>
              <td className="py-2">3</td>
              <td className="py-2">Bob Johnson</td>
              <td className="py-2">bob@example.com</td>
              <td className="py-2">7</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

