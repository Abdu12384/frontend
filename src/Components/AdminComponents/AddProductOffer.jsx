import React, { useState } from 'react';
import { Calendar } from 'lucide-react';
import { toast, Toaster } from 'react-hot-toast';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css'; // Import CSS
import axioInstence from '../../utils/axioInstence';


const AddProductOffer = ({ product, onCancel }) => {
  const [offerName, setOfferName] = useState('');
  const [offerPercentage, setOfferPercentage] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const handleSubmit = async(e) => {
    e.preventDefault();
try {
  

    const offerData = {
      offerName,
      offerPercentage: Number(offerPercentage),
      startDate,
      endDate
    };

 const response = await axioInstence.post(`/admin/product/${product._id}/offer`,
  {offerData:offerData}
 )
 toast.success(response.data.message) 

    setOfferName('');
    setOfferPercentage('');
    setStartDate(null);
    setEndDate(null);

} catch (error) {
  
}
}



  return (
    <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-2xl p-6 max-w-md mx-auto">

      <h2 className="text-2xl font-bold text-white mb-6">Add New Offer to : {product.productName}</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="offerName" className="block text-sm font-medium text-gray-200 mb-1">
            Offer Name
          </label>
          <input
            type="text"
            id="offerName"
            value={offerName}
            onChange={(e) => setOfferName(e.target.value)}
            className="w-full rounded-md bg-gray-800 border-gray-700 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-3 py-2"
            placeholder="Summer Sale"
          />
        </div>
        <div>
          <label htmlFor="offerPercentage" className="block text-sm font-medium text-gray-200 mb-1">
            Offer Percentage
          </label>
          <input
            type="number"
            id="offerPercentage"
            value={offerPercentage}
            onChange={(e) => setOfferPercentage(e.target.value)}
            min="0"
            max="100"
            className="w-full rounded-md bg-gray-800 border-gray-700 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-3 py-2"
            placeholder="%"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-200 mb-1">
              Start Date
            </label>
            <div className="relative">
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                className="w-full rounded-md bg-gray-800 border-gray-700 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-3 py-2"
                placeholderText="Select date"
              />
              <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            </div>
          </div>
          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-200 mb-1">
              End Date
            </label>
            <div className="relative">
              <DatePicker
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                className="w-full rounded-md bg-gray-800 border-gray-700 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 px-3 py-2"
                placeholderText="Select date"
              />
              <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            </div>
          </div>
        </div>
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-300 ease-in-out"
        >
          Add Offer
        </button>
      </form>
    </div>
  );
};

export default AddProductOffer;

