import React, { useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight,Percent,  Edit3, Eye, MoreVertical, Plus, UserX } from 'lucide-react'
import Breadcrumbs from '../../Components/BrudCrums'
import AddCategory from '../../Components/AdminComponents/AddCategory'
import {format} from 'date-fns'
import StatusBadge from '../../Components/AdminComponents/StatusBadge'
import Pagination from '../../Components/Pagination'
import { fetchCategories, toggleCategoryBlockStatus } from '../../services/authService'
import OfferCategoryForm from '../../Components/AdminComponents/AddOffer'
import toast, { Toaster } from "react-hot-toast";
import axioInstence from '../../utils/axioInstence'

function AdminCategory() {
  const [showForm, setShowForm]=useState(false)
  const[categories, setCategories]= useState([])
  const [menuOpen, setMenuOpen] = useState(null) 
  const [showOffer, setShowOffer] = useState(false)
  const [editCategory, setEditCategory] = useState(null); 
  const [selectedCategoryId, setSelectedCategoryId] = useState(null); // State for selected category ID
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 5;
  

  const indexOfLastCategory = currentPage * ordersPerPage;
  const indexOfFirstCategory = indexOfLastCategory - ordersPerPage;
  const currentCategories = categories.slice(indexOfFirstCategory, indexOfLastCategory);
  const totalPages = Math.ceil(categories.length / ordersPerPage);



   const handleAddCategory =()=>{
     setShowForm(true)
   }
   const handleCloseForm =()=>{
     setShowForm(false)
   }
   const handleCategoryAdded =()=>{
     setShowForm(false)
   }

   const handleAddOffer = (category) =>{
     setShowOffer(true)
     setMenuOpen(null); // Close the dropdown menu

   }

  

   const handleEditCatgroy = (category) =>{
      setShowForm(true)
      setMenuOpen(null)
      setEditCategory(category)
   }

   const handleCategoryUpdated = (updatedCategory) =>{
       setCategories((prev)=>
       prev.map((category)=>
         category._id === updatedCategory._id ? updatedCategory : category
      )
    )
    setShowForm(false)
   }

   const handleMenuToggle = (id) => {
    setMenuOpen((prev) => (prev === id ? null : id))
    setSelectedCategoryId(id)
  }

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    setMenuOpen(null); 
  };

  
   

   useEffect(()=>{

    const loadCategories = async () => {
      try {
          const data = await fetchCategories(); 
          console.log('Fetched categories', data);
          setCategories(data); 
      } catch (error) {
          console.error('Error loading categories', error);
      }
  };

  loadCategories();
   },[])


   const handleBlockToggle = async (id, isDeleted) => {
        try {
           const response = await toggleCategoryBlockStatus(id, isDeleted);
           
           setCategories((prevCategories) =>
            prevCategories.map((category) =>
              category._id === id ? { ...category, isDeleted: !category.isDeleted } : category
          )
        );
        toast.success(`Category ${!isDeleted ? 'blocked' : 'unblocked'} successfully!`);
        } catch (error) {
            console.error(error.response.data.message);
            toast.error('Failed to update category status. Please try again.');
        }
    };
  

    const handleRemoveOffer = async (categoryId) => {
      try {
        const response= await axioInstence.patch(`/admin/category/${categoryId}/remove-offer`); 
        console.log('Fetched categories',response);
        toast.success(response.data.message)

    } catch (error) {
        console.error('Error loading categories', error);
    }
    };

  return (
      <div className="min-h-screen  p-6">
              <Toaster position="top-right" reverseOrder={false}/>
      <div className="max-w-7xl mx-auto">
        <Breadcrumbs/>
        {/* Header Section */}
        <div className="flex justify-between items-center mb-8">
          
            <h1 className="text-2xl font-bold text-gray-100">Categories Management</h1>
       
          <div className="flex gap-3">
           
            <button 
             onClick={handleAddCategory}
             className="px-4 py-2 bg-purple-600 text-white rounded-lg flex items-center gap-2 hover:bg-purple-800 transition-colors">
              <Plus className="w-4 h-4" />
              Create Category
            </button>
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white bg-opacity-10 rounded-xl shadow-sm">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="px-6 py-4 text-left">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-gray-600">Category Name</span>
                  </div>
                </th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600 text-left">Description</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600 text-left">Stock</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600 text-left">Added</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600 text-left">Status</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600 text-left">Offer</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {currentCategories.map((category) => (
                <tr key={category._id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-3">
                     
                        <span className="font-medium text-gray-900">{category.name}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 max-w-[200px] text-gray-600">{category.description}</td>
                  <td className="px-6 py-4 text-gray-600">{category.stock}</td>
                  <td className="px-6 py-4 text-gray-600">
                  {category.createdAt ? format(new Date(category.createdAt), 'dd MMM yyyy') : 'Invalid Date'}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                    <StatusBadge
                  status={
                    category.isDeleted
                    ? "Blocked"
                    : "Active"
                    
                  }
                  />
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                      {category.offer ? (
                        <div className="flex items-center">
                          <Percent/>
                          <span>{category.offer.offerPercentage}% Off</span>
                        </div>
                      ) : (
                        <span>No Offer</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                    <div className="relative dropdown-container">
                      <button
                        className="p-2 hover:bg-gray-700 rounded-full"
                        onClick={() => handleMenuToggle(category._id)}
                      >
                        <MoreVertical className="h-5 w-5 text-gray-300" />
                      </button>
                      {menuOpen === category._id && (
                        <div className="absolute right-0 mt-2 w-40 bg-gray-800 rounded-lg shadow-lg z-50">
                          <button 
                          onClick={() => handleEditCatgroy(category)}
                          className="w-full px-4 py-2 text-left text-white text-sm hover:bg-gray-700 flex gap-2 items-center">
                            <Edit3 className="w-4 h-4" />
                            Edit
                          </button>
                          <button
                            onClick={() => handleBlockToggle(category._id, category.isDeleted)}
                            className="w-full px-4 py-2 text-left text-white text-sm hover:bg-gray-700 flex gap-2 items-center"
                        >
                            {category.isDeleted ? (
                                <>
                                    <UserX Check className="w-4 h-4" />
                                    Unblock
                                </>
                            ) : (
                                <>
                                    <UserX X className="w-4 h-4" />
                                    Block
                                </>
                            )}
                        </button>
                          <button
                          onClick={() => handleAddOffer(category._id)} 
                          className="w-full px-4 py-2 text-left text-white text-sm hover:bg-gray-700 flex gap-2 items-center">
                          <Plus className="w-4 h-4" />
                          Add Offer
                        </button>
                        {category.offer && (
                        <button
                          onClick={() => handleRemoveOffer(category._id)} 
                          className="w-full px-4 py-2 text-left text-white text-sm hover:bg-gray-700 flex gap-2 items-center">
                          <UserX className="w-4 h-4" />
                          Remove Offer
                        </button>
                      )}
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

        </div>
      </div>
      {totalPages > 1 && (
        <div className="mt-6">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}
      {showForm && (
        <AddCategory 
        onClose={handleCloseForm} 
        onSuccess={editCategory ? handleCategoryUpdated: handleCategoryAdded}
        category={editCategory}
        />
      )}
      {showOffer &&(
       <OfferCategoryForm
       categoryId={selectedCategoryId} // Pass the selected category ID
       onClose={() => setShowOffer(false)} // Ensure modal can be closed
       />

      )}
    </div>
  )
}

export default AdminCategory
