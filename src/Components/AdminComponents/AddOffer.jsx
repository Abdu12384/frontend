import React, { useState } from 'react'
import { Calendar, Percent, Tag } from 'lucide-react'
import axioInstence from '../../utils/axioInstence'
import toast, { Toaster } from "react-hot-toast";

export default function OfferCategoryForm({onClose, categoryId}) {
  const [offerName, setOfferName] = useState('')
  const [offerPercentage, setOfferPercentage] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [errors, setErrors] = useState({});


  const validateForm = () => {
    const newErrors = {};
    

    if (!offerName.trim()) {
      newErrors.offerName = "Offer name is required";
    }


    const percentage = parseFloat(offerPercentage);
    if (isNaN(percentage) || percentage < 0 || percentage > 100) {
      newErrors.offerPercentage = "Offer percentage must be a number between 0 and 100";
    }


    if (!startDate) {
      newErrors.startDate = "Start date is required";
    }


    if (!endDate) {
      newErrors.endDate = "End date is required";
    } else if (new Date(endDate) <= new Date(startDate)) {
      newErrors.endDate = "End date must be after start date";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return; 
    try {
      const response = await axioInstence.post(`/admin/categories/${categoryId}/offer`, {
        offerName,
        offerPercentage,
        startDate,
        endDate,
      });
      toast.success(response.data.message)
      console.log('Offer applied:', response);
      onSuccess(response.data); 
      onClose(); 
    } catch (error) {
      toast.error(error.response.data.message)
      console.error('Error applying offer:', error);
    }
  };

  

  return (
    <>
    
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center">
            <Toaster position="top-right" reverseOrder={false}/>
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full m-4">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Add Offer Category</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="offerName" className="block text-sm font-medium text-gray-700 mb-1">
              Offer Name
            </label>
            <div className="relative">
              <Tag className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                id="offerName"
                type="text"
                value={offerName}
                onChange={(e) => setOfferName(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter offer name"

              />
            </div>
            {errors.offerName && <p className="text-red-500 text-xs mt-1">{errors.offerName}</p>}

          </div>

          <div>
            <label htmlFor="offerPercentage" className="block text-sm font-medium text-gray-700 mb-1">
              Offer Percentage
            </label>
            <div className="relative">
              <Percent className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                id="offerPercentage"
                type="number"
                min="0"
                max="100"
                value={offerPercentage}
                onChange={(e) => setOfferPercentage(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter offer percentage"

              />
            </div>
            {errors.offerPercentage && <p className="text-red-500 text-xs mt-1">{errors.offerPercentage}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                Start Date
              </label>
              <div className="relative">
                <Calendar className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"

                />
              </div>
              {errors.startDate && <p className="text-red-500 text-xs mt-1">{errors.startDate}</p>}
            </div>
            <div>
              <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
                End Date
              </label>
              <div className="relative">
                <Calendar className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  id="endDate"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"

                />
              </div>
            {errors.endDate && <p className="text-red-500 text-xs mt-1">{errors.endDate}</p>}
            </div>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              Add Offer Category
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
            >
              Close
            </button>
          </div>
        </form>
      </div>
    </div> 
    </>
  )
}

