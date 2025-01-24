import React, { useEffect, useState } from 'react'
import { Calendar, Filter, ChevronLeft, ChevronRight, Plus, Trash2 } from 'lucide-react'
import axioInstence from '../../utils/axioInstence'
import toast, { Toaster } from "react-hot-toast";
import dayjs from 'dayjs'; 
import { fetchCoupons, deleteCoupon } from '../../services/authService';


export default function CouponManagement() {
  const [coupons, setCoupons] = useState([])
  const [activeTab, setActiveTab] = useState('all')
  const [newCoupon, setNewCoupon] = useState({ code: '', discount: '', minAmount: '', maxAmount: '', expiryDate: '' })
  const [errors, setErrors] = useState({});

  const validateCoupon = () => {
    const newErrors = {};
    
    const couponRegex=/^[a-zA-Z0-9\s]+$/
    if (!couponRegex.test(newCoupon.code)) {
      newErrors.code = "Coupon code is not valid";
    }

    const discount = parseFloat(newCoupon.discount);
    if (isNaN(discount) || discount < 0 || discount > 100) {
      newErrors.discount = "Discount must be a number between 0 and 100";
    }

    const minAmount = parseFloat(newCoupon.minAmount);
    if (isNaN(minAmount) || minAmount <= 0) {
      newErrors.minAmount = "Minimum amount must be a positive number";
    }

    const maxAmount = parseFloat(newCoupon.maxAmount);
    if (isNaN(maxAmount) || maxAmount <= 0) {
      newErrors.maxAmount = "Maximum amount must be a positive number";
    } else if (maxAmount < minAmount) {
      newErrors.maxAmount = "Maximum amount must be greater than or equal to minimum amount";
    }

    if (!newCoupon.expiryDate) {
      newErrors.expiryDate = "Expiry date is required";
    } else if (new Date(newCoupon.expiryDate) <= new Date()) {
      newErrors.expiryDate = "Expiry date must be in the future";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  const handleAddCoupon = async(e) => {
    e.preventDefault()
    if (!validateCoupon()) return;    
    const couponData ={
      code:newCoupon.code,
      discount:newCoupon.discount,
      minAmount:newCoupon.minAmount,
      maxAmount:newCoupon.maxAmount,
      expiryDate:newCoupon.expiryDate
    }

    try {
      const response = await axioInstence.post('/admin/add-coupon',couponData)
      console.log(response);
      toast.success(response.data.message)
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message)
      
    }
    
  }
  
  
 
  useEffect(() => {
    const loadCoupons = async () => {
        try {
            const data = await fetchCoupons(); 
            console.log('Fetched coupons', data);
            setCoupons(data); 
        } catch (error) {
            console.error('Error loading coupons', error);
        }
    };

    loadCoupons();
}, []); 


const handleDelete = async (couponId) => {
  try {
      const response = await deleteCoupon(couponId); 
      toast.success(response.message); 

      setCoupons((prevCoupons) => prevCoupons.filter(coupon => coupon._id !== couponId));
  } catch (error) {
      console.error('Error deleting coupon:', error);
      toast.error('Failed to delete coupon. Please try again.');
  }
};

  
  console.log(coupons);
  

  return (
    <div className="p-6 max-w-7xl mx-auto">
     <Toaster position="top-right" reverseOrder={false}/>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Coupon</h1>
        <div className="flex items-center text-sm text-gray-500">
          <a href="#" className="text-blue-600 hover:underline">Dashboard</a>
          <span className="mx-2">›</span>
          <span>Coupon List</span>
        </div>
      </div>

      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-2">
          {['all', 'active', 'expired'].map((tab) => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-md ${activeTab === tab ? 'bg-gray-900 text-white' : 'bg-gray-100'}`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
        <div className="flex items-center space-x-3">
          <button className="flex items-center px-4 py-2 border rounded-md hover:bg-gray-50">
            <Calendar className="w-4 h-4 mr-2" />
            Select Date
          </button>
          <button className="flex items-center px-4 py-2 border rounded-md hover:bg-gray-50">
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden mb-8">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {['Coupon Code', 'Discount', 'Min', 'Max', 'Start', 'Expiry', 'Status', 'Created', 'Action'].map((header) => (
                <th key={header} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {coupons.map((coupon, index) => (
              <tr key={index}>
                <td className="px-6 py-4 whitespace-nowrap">{coupon.code}</td>
                <td className="px-6 py-4 whitespace-nowrap">{coupon.discount}%</td>
                <td className="px-6 py-4 whitespace-nowrap">{coupon.minAmount}</td>
                <td className="px-6 py-4 whitespace-nowrap">{coupon.maxAmount}</td>
                <td className="px-6 py-4 whitespace-nowrap">{dayjs(coupon.start).format('DD/MM/YYYY')}</td>
                <td className="px-6 py-4 whitespace-nowrap">{dayjs(coupon.expiryDate).format('DD/MM/YYYY')}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    {coupon.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{dayjs(coupon.created).format('DD/MM/YYYY')}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button 
                  onClick={()=>handleDelete(coupon._id)}
                  className="text-gray-400 hover:text-red-500">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="px-6 py-3 flex items-center justify-between border-t border-gray-200">
          <div className="text-sm text-gray-500">
            Showing 1-{coupons.length} from {coupons.length}
          </div>
          <div className="flex items-center space-x-2">
            <button className="p-2 rounded-full hover:bg-gray-100">
              <ChevronLeft className="w-5 h-5" />
            </button>
            {[1].map((page) => (
              <button
                key={page}
                className={`w-8 h-8 flex items-center justify-center rounded-full ${
                  page === 1 ? 'bg-gray-900 text-white' : 'hover:bg-gray-100'
                }`}
              >
                {page.toString().padStart(2, '0')}
              </button>
            ))}
            <button className="p-2 rounded-full hover:bg-gray-100">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Add Coupon</h2>
        <form onSubmit={handleAddCoupon} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Coupon Code
              </label>
              <input
                type="text"
                value={newCoupon.code}
                onChange={(e) => setNewCoupon({...newCoupon, code: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"

              />
            {errors.code && <p className="text-red-500 text-xs mt-1">{errors.code}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Discount
              </label>
              <input
                type="number"
                value={newCoupon.discount}
                onChange={(e) => setNewCoupon({...newCoupon, discount: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            {errors.discount && <p className="text-red-500 text-xs mt-1">{errors.discount}</p>}
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Min Amount
              </label>
              <input
                type="number"
                value={newCoupon.minAmount}
                onChange={(e) => setNewCoupon({...newCoupon, minAmount: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            {errors.minAmount && <p className="text-red-500 text-xs mt-1">{errors.minAmount}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Max Amount
              </label>
              <input
                type="number"
                value={newCoupon.maxAmount}
                onChange={(e) => setNewCoupon({...newCoupon, maxAmount: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            {errors.maxAmount && <p className="text-red-500 text-xs mt-1">{errors.maxAmount}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Expiry Date
              </label>
              <input
                type="date"
                value={newCoupon.expiryDate}
                onChange={(e) => setNewCoupon({...newCoupon, expiryDate: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            {errors.expiryDate && <p className="text-red-500 text-xs mt-1">{errors.expiryDate}</p>}
            </div>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              <Plus className="w-5 h-5 inline-block mr-2" />
              Add Coupon
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

