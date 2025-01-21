import React, { useState, useEffect } from 'react';
import axioInstence from '../../utils/axioInstence';
import toast, { Toaster } from "react-hot-toast";

const AddressForm = ({ onSubmit, initialAddress }) => {
  const [addressData, setAddressData] = useState({
    fullName: "",
    mobile:"",
    address: "",
    country: "",
    state: "",
    city: "",
    pincode: "",
  });

  const [errors, setErrors] = useState({}); 


  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddressData((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
        if (initialAddress) {
          setAddressData(initialAddress);
        }
      }, [initialAddress]);


      const validate = () => {
        const newErrors = {};
    
        if (!addressData.fullName.trim()) {
          newErrors.fullName = "Full name is required.";
        }
        if (!addressData.mobile.trim() || !/^\d{10}$/.test(addressData.mobile)) {
          newErrors.mobile = "Mobile number must be 10 digits.";
        }

        if (!addressData.address.trim()) {
          newErrors.address = "Address is required.";
        }

        if (!addressData.country.trim()) {
          newErrors.country = "Country is required.";
        }

        if (!addressData.state.trim()) {
          newErrors.state = "State is required.";
        }

        if (!addressData.city.trim()) {
          newErrors.city = "City is required.";
        }
        if (!addressData.pincode.trim() || !/^\d{6}$/.test(addressData.pincode)) {
          newErrors.pincode = "Pincode must be 6 digits.";
        }
    
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0; 
      };

      const handleSubmit = async(e) => {
            e.preventDefault();
            if (!validate()) return; 

            try {
          
              const response = await axioInstence.post('/user/add-address',addressData) 
                console.log(response.data);
                toast.success(response.data.message);
                
              } catch (error) {
                toast.error(error.response.data.message);
                console.log(error);
              }
            onSubmit(addressData);
          };

  return (
    <div className="min-h-screen  flex items-center justify-center p-4">
      
      <Toaster position="top-right" reverseOrder={false}/>
      <div className="max-w-6xl w-full grid md:grid-cols-2 gap- items-center">
        <div className="hidden md:block">
          <img
            src="/src/assets/images/location-img.jpg"
            alt="Address Form"
            className="w-full h-auto rounded-lg shadow-lg"
          />
        </div>
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-6">Edit Address</h2>

          <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">fullName</label>
                <input
                  id="name"
                  name="fullName"
                  type="text"
                  value={addressData.fullName}
                  onChange={handleChange}
                  className="mt-1 block w-full h-8 rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-300 focus:ring-opacity-50"
                />
               {errors.fullName && <p className="text-sm text-red-500">{errors.fullName}</p>}
              </div>
              <div className="space-y-2">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Mobile</label>
                <input
                  id="mobile"
                  name="mobile"
                  type="number"
                  value={addressData.mobile}
                  onChange={handleChange}
                  className="mt-1 block w-full h-8 rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-300 focus:ring-opacity-50"
                  />
                {errors.mobile && <p className="text-sm text-red-500">{errors.mobile}</p>}
              </div>
            <div className="space-y-2">
              <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
              <input
                id="address"
                name="address"
                type="text"
                value={addressData.address}
                onChange={handleChange}
                className="mt-1 block w-full h-8 rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-300 focus:ring-opacity-50"
              />
             {errors.address && <p className="text-sm text-red-500">{errors.address}</p>}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="country" className="block text-sm font-medium text-gray-700">Country</label>
                <select
                  id="country"
                  name="country"
                  value={addressData.country}
                  onChange={handleChange}
                  className="mt-1 block w-full h-8 rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-300 focus:ring-opacity-50"
                >            

                  <option value="">Select country</option>
                  <option value="united States">United States</option>
                  <option value="united Kingdom">United Kingdom</option>
                  <option value="india">India</option>
                </select>
                 {errors.country && <p className="text-sm text-red-500">{errors.country}</p>}
              </div>
              <div className="space-y-2">
                <label htmlFor="state" className="block text-sm font-medium text-gray-700">State</label>
                <select
                  id="state"
                  name="state"
                  value={addressData.state}
                  onChange={handleChange}
                  className="mt-1 block w-full h-8 rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-300 focus:ring-opacity-50"
                >
                  <option value="">Select state</option>
                  <option value="kerla">Kerla</option>
                  <option value="delhi">Delhi</option>
                  <option value="mumbai">Mumbai</option>
                </select>
                {errors.state && <p className="text-sm text-red-500">{errors.state}</p>}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="city" className="block text-sm font-medium text-gray-700">City</label>
                <input
                  id="city"
                  name="city"
                  type="text"
                  value={addressData.city}
                  onChange={handleChange}
                  className="mt-1 block w-full h-8 rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-300 focus:ring-opacity-50"
                />
              {errors.city && <p className="text-sm text-red-500">{errors.city}</p>}
              </div>
              <div className="space-y-2">
                <label htmlFor="pincode" className="block text-sm font-medium text-gray-700">Pincode</label>
                <input
                  id="pincode"
                  name="pincode"
                  type="text"
                  value={addressData.pincode}
                  onChange={handleChange}
                  className="mt-1 block w-full h-8 rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-300 focus:ring-opacity-50"
                />
             {errors.pincode && <p className="text-sm text-red-500">{errors.pincode}</p>}
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
          {initialAddress ? 'Update Address' : 'Add Address'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddressForm;


