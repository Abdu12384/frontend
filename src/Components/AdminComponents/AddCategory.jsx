import React,{useState} from 'react'
import axioInstence from '../../utils/axioInstence';
import { X } from 'lucide-react';
import toast, { Toaster } from "react-hot-toast";



function AddCategory({onClose, onSuccess, category={} }) {

  const [formData, setFormData] = useState({ 
    name:category?.name || '', 
    description: category?.description || '' 
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
       if(category?._id){
        const response = await axioInstence.put(`/admin/categories/${category._id}`,formData)
             console.log('mnbvcxz',response.data);  
             toast.success(response.data.message || 'Category updated successfully');
            
       } else{

         const response = await axioInstence.post('/admin/categories',formData);
         setFormData({ name: '', description: '' });
           toast.success(response.data.message)       
       }

       onSuccess(response.data)
       onClose()
    } catch(error) {
      console.error(error.response);
      toast.error(error.response.data.message)
    }
  };


  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <Toaster position="top-right" reverseOrder={false}/>
    <div className="bg-white bg-opacity-20 rounded-xl shadow-lg w-full max-w-md p-6 relative">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
      >
        <X className="w-6 h-6" />
      </button>
      <h2 className="text-2xl font-bold text-gray-100 mb-6">{category?._id ? "Edit Category": "Add New Category"}</h2>
      <form onSubmit={handleSubmit}  className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
            Category Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 bg-white bg-opacity-10 border border-gray-600 rounded-lg text-gray-100 focus:outline-none focus:border-purple-500"
            placeholder="Enter category name"
          />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={3}
            className="w-full px-3 py-2 bg-white bg-opacity-10 border border-gray-600 rounded-lg text-gray-100 focus:outline-none focus:border-purple-500"
            placeholder="Enter category description"
          ></textarea>
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            {category?._id ? "Update" : "Create"}
          </button>
          <button type='button' onClick={onClose}>Cancel</button>
        </div>
      </form>
    </div>
  </div>
  )
}

export default AddCategory
