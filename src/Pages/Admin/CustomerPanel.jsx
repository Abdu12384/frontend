import { useEffect, useState } from 'react'
import { MoreVertical, Search, Edit, Lock, Unlock, Check, X} from 'lucide-react'
import axioInstence from '../../utils/axioInstence'
import {format} from 'date-fns'
import Breadcrumbs from '../../Components/BrudCrums'



function CustomerPanel() {
   const [Users, setUsers] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [editingUsers, setEditingUsers] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [activeMenu, setActiveMenu] = useState(null)
  const [currentPage,setCurrentPage] = useState(1)
  const [filterStatus, setFilterStatus] = useState("All")
  const usersPerPage=5








   useEffect(()=>{

     const fetchUser = async()=>{
      
       try {
     const response= await axioInstence.get('/admin/users')
      console.log(response.data);
      
      setUsers(response.data)
        
       } catch (error) {
         console.error('Fetching User Error',error)
       }
  
     }
     fetchUser()
   },[])



   const toggleCustomersStatus = async (customerId) =>{
     try {
       const response = await axioInstence.put(`/admin/users/status/${customerId}`,
        {isActive: !Users.find(user => user._id === customerId).isActive}
       )
        
        const updatedUser = Users.map(user=>
           user._id === customerId
           ?{...user, isActive:!user.isActive}
           :user
        )
        setUsers(updatedUser)

     } catch (error) {
      console.error('Error toggling customer status',error)
     }
   }


const filteredCustomers = Users.filter(user =>{ 
  const matchesSearch =  user.fullName.toLowerCase().startsWith(searchTerm.toLowerCase())
  const matchesStatus =
    filterStatus === "All"||
    (filterStatus === "Active" && user.isActive)||
    (filterStatus === "Blocked" && !user.isActive)
    return matchesSearch && matchesStatus
 });



  // Pagination logic
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredCustomers.slice(indexOfFirstUser, indexOfLastUser);



  return (
     <>
      <Breadcrumbs/>
    <div className="min-h-screen  p-8 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold">Customers Panel</h1>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search customers..."
              className="pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
              onChange={(e) => setSearchTerm(e.target.value)}
              />
          </div>
        </div>

        <div className="mb-4 flex space-x-4">
          {["All", "Active", "Blocked"].map(status => (
            <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`px-4 py-2 rounded-lg ${
              filterStatus === status
              ? 'bg-purple-600 text-white'
              : 'bg-gray-700 text-gray-400'
            }`}
            >
              {status}
            </button>
          ))}
        </div>

        <div className="overflow-hidden rounded-lg border border-gray-700 bg-gray-500 shadow-xl">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-900 ">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">username</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Email ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Username</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Mobile</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Added</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700 bg-gray-800">
              {currentUsers.map((user) => (
                <tr key={user._id} className="hover:bg-gray-700 transition duration-150 ease-in-out">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0">
                        <span className="h-10 w-10 rounded-full bg-gray-600 flex items-center justify-center text-lg font-semibold">
                          {user.fullName ? user.fullName[0].toUpperCase():'-'}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium">{user.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{user.fullName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{user.mobile}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {user.createdAt ? format(new Date(user.createdAt), 'dd MMM yyyy') : 'Invalid Date'}
                    </td>
                  <td></td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        user.isActive 
                        ? 'bg-green-200 text-green-800'
                        : 'bg-red-200 text-red-800'
                      }`}
                      >
                      {/* {customer.status.charAt(0).toUpperCase() + customer.status.slice(1)} */}
                      {user.isActive ? 'Active':'Blocked'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="">
                      <button
                        onClick={() => setActiveMenu(activeMenu === user._id ? null : user._id)}
                        className="text-gray-400 hover:text-white focus:outline-none"
                        >
                        <MoreVertical className="h-5 w-5" />
                      </button>
                      {activeMenu === user._id && (
                        <div className="absolute right-10 mt-2 w-48 rounded-md shadow-lg z-50 bg-white ring-1 ring-black ring-opacity-5 ">
                          <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                            <button
                              onClick={() => {
                                setEditingUsers(user)
                                setIsModalOpen(true)
                                setActiveMenu(null)
                              }}
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 w-full flex text-left"
                              role="menuitem"
                              >
                              <Edit className='mr-2 h-4 w-4'/>
                              Edit
                            </button>
                            <button
                              onClick={() => toggleCustomersStatus(user._id)}
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 w-full flex text-left"
                              role="menuitem"
                              >
                              {user.isActive  ? (
                                <>
                                <Lock className='mr-2 h-4 w-4'/>
                                Block 
                                </>
                                ):(
                                  <>
                                  <Unlock className='mr-2 h-4 w-4'/>
                                   Unblock
                                  </>
                                   )}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Edit Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-gray-800 p-6 rounded-lg w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">Edit Customer</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400">Name</label>
                  <input
                    type="text"
                    value={editingUsers.fullName}
                    onChange={(e) => setEditingUsers({...editingUsers, fullName: e.target.value})}
                    className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-white"
                    />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400">Email</label>
                  <input
                    type="email"
                    value={editingUsers.email}
                    onChange={(e) => setEditingUsers({...editingUsers, email: e.target.value})}
                    className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-white"
                    />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400">Username</label>
                  <input
                    type="text"
                    value={editingUsers.fullName}
                    onChange={(e) => setEditingUsers({...editingUsers, fullName: e.target.value})}
                    className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-white"
                    />
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-600 rounded-md hover:bg-gray-500"
                    >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      // In a real app, you'd update this in your backend
                      setIsModalOpen(false)
                    }}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                    >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Pagination */}
        <div className='flex flex-wrap justify-center items-center mt-4 gap-2'>
      {Array.from({ length: Math.ceil(Users.length / usersPerPage) }, (_, index) => (
        <button
        key={index}
        onClick={() => setCurrentPage(index + 1)}
        className={`px-4 py-2 mx-1 rounded-lg  ${
          currentPage === index + 1 ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-400'
        }`}
        >
            {index + 1}
          </button>
        ))}
      </div>
      </div>
    </div>
        </>
  )

}

export default CustomerPanel