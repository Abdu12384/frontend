import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axioInstence from "../../utils/axioInstence";
import uploadImageToCloudinary from "../../services/uploadServise";
import {  EyeIcon, EyeOffIcon, UserCircle, Mail, Phone, Lock, Save, X, Camera  } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import NavBar from "../Navbar";
import ConfirmationPopup from "../ConformButton";
import { BreadcrumbUserDhbrd } from "../BrudCrums";



function UserDetailsForm() {

  const [showConfirmation, setShowConfirmation] = useState(false);
  const [formDataToSubmit, setFormDataToSubmit] = useState(null);


  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    mobile: "",
    profileImage:"",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [imageFile, setImageFile] = useState(null)




  const togglePasswordVisibility = (field) => {
    setShowPassword(prevState => ({
      ...prevState,
      [field]: !prevState[field]
    }));
  };

console.log(formData);

  useEffect(() => {
    const fetchAddress = async () => {
      try {
        const response = await axioInstence.get("/user/profile-update");
        console.log(response);
        setFormData(response.data)
      } catch (error) {
        console.error("Error fetching address details:", error);
      }
    };

    fetchAddress();
  }, []);




   const handleChange = (e) =>{
     const {name, value} = e.target
      setFormData((prevData) => ({
         ...prevData,
         [name]: value,
      }))
   }
    const handleImageChange = (e) =>{
       const file = e.target.files[0]
       setImageFile(file)
    }

    const validate = () => {
      const newErrors = {};
    
      const fullNameRegex=/^[a-zA-Z\s]+$/
      const mobileRegex=/^[1-9][0-9]{9}$/
      const emailRegex = /^[a-zA-Z0-9][a-zA-Z0-9._%+-]*@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
 

      if (!formData.fullName.trim() || !fullNameRegex.test(formData.fullName)) {
        newErrors.fullName = "Full name is not proper.";
      }
    

      if (!formData.email.trim() || !emailRegex.test(formData.email)) {
        newErrors.email = "A valid email is required.";
      }
    
      
      if (!formData.mobile.trim() || !mobileRegex.test(formData.mobile)) {
        newErrors.mobile = "Mobile number must be 10 digits.";
      }

      if (formData.newPassword) {
        if (formData.newPassword.length < 8) {
          newErrors.newPassword = "Password must be at least 8 characters.";
        } else if (!/[A-Z]/.test(formData.newPassword)) {
          newErrors.newPassword = "Password must contain at least one uppercase letter.";
        } else if (!/[a-z]/.test(formData.newPassword)) {
          newErrors.newPassword = "Password must contain at least one lowercase letter.";
        } else if (!/[0-9]/.test(formData.newPassword)) {
          newErrors.newPassword = "Password must contain at least one number.";
        } else if (!/[!@#$%^&*]/.test(formData.newPassword)) {
          newErrors.newPassword = "Password must contain at least one special character.";
        }
      }
    

      if (formData.newPassword !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match.";
      }
    
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };



    const handleFormSubmit = async (e) => {
      e.preventDefault();
      if (!validate()) return;
      setFormDataToSubmit(formData);
      setShowConfirmation(true);
    };



  const handleConfirm = async (e) =>{
     try {
       if(imageFile){
         const uploadedUrls = await uploadImageToCloudinary([imageFile])
         if(uploadedUrls && uploadedUrls.length>0){
          formDataToSubmit.profileImage = uploadedUrls[0]
         }
       }

      const response = await axioInstence.post('/user/profile-update',formDataToSubmit)
      console.log("Response:", response.data);
      toast.success(response.data.message)
      
    } catch (error) {
      console.error('dsfsdfsf',error.response.data);
      toast.error(error.response.data.message)

     }
  }

  const breadcrumbItems = [
    { label: 'Home', url: '/' },
    { label: 'Dashboard', url: '/user/dashboard' },
    { label: 'account-details', url: null }, 
  ];
  


  return (
    <>
      <NavBar/>
     <div className="min-h-screen bg-gradient-to-br from-[#f3e7e1] to-[#e7d5c9] py-12 px-4 sm:px-6 lg:px-8">
       <BreadcrumbUserDhbrd items={breadcrumbItems}/>
            <Toaster position="top-right" reverseOrder={false}/>
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-amber-500 to-teal-500 p-8">
          <h1 className="text-3xl font-bold text-white">Account Details</h1>
          <p className="mt-2 text-amber-100">Manage your personal information and security</p>
        </div>
        
        <form onSubmit={handleFormSubmit} className="p-8">
          <div className="mb-8 flex flex-col items-center">
            <div className="relative w-32 h-32 mb-4">
            {imageFile ? (
          <img
            src={URL.createObjectURL(imageFile)} // Show the preview image if a file is selected
            alt="Profile"
            className="w-full h-full rounded-full object-cover border-4 border-black shadow-lg"
          />
        ) : formData.profileImage ? (
              <img
                src={formData.profileImage}
                alt="Profile"
                className="w-full h-full rounded-full object-cover border-2 shadow-lg"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-200">
              <UserCircle className="w-16 h-16 text-gray-400" />
            </div>
          )}
              <label htmlFor="profile-image" className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-md cursor-pointer">
                <Camera className="w-5 h-5 text-gray-600" />
                <input
                  type="file"
                  id="profile-image"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            </div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-1">{formData.fullName}</h2>
            <p className="text-sm text-gray-500">{formData.email}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Personal Information */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-800">Personal Information</h2>
              
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="fullName">Full Name</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <UserCircle className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="fullName"
                    id="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 sm:text-sm"
                  />
                </div>
             {errors.fullName && <span className="text-sm text-red-500">{errors.fullName}</span>}
              </div>

              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1" >Email Address</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 sm:text-sm"
                  />
                </div>
              </div>
                  {errors.email && <span className="text-sm text-red-500">{errors.email}</span>}

              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1" >Phone Number</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="tel"
                    name="mobile"
                    id="phone"
                    value={formData.mobile}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 sm:text-sm"
                  />
                </div>
              </div>
           {errors.mobile && <span className="text-sm text-red-500">{errors.mobile}</span>}
            </div>

            {/* Change Password */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-800">Change Password</h2>
              
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1" >Current Password</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type={showPassword.current ? "text" : "password"}
                    name="currentPassword"
                    id="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 sm:text-sm"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('current')}
                      className="focus:outline-none focus:text-amber-400 text-gray-400 hover:text-gray-500"
                    >
                      {showPassword.current ? (
                        <EyeOffIcon className="h-5 w-5" />
                      ) : (
                        <EyeIcon className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1" >New Password</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type={showPassword.new ? "text" : "password"}
                    name="newPassword"
                    id="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 sm:text-sm"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility('new')}
                      className="focus:outline-none focus:text-amber-400 text-gray-400 hover:text-gray-500"
                    >
                      {showPassword.new ? (
                        <EyeOffIcon className="h-5 w-5" />
                      ) : (
                        <EyeIcon className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>
                {errors.newPassword && <p className="mt-1 text-sm text-red-600">{errors.newPassword}</p>}
              </div>

              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1" >Confirm New Password</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type={showPassword.confirm ? "text" : "password"}
                    name="confirmPassword"
                    id="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 sm:text-sm"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <button
                      type="button"
                      onClick={()=>togglePasswordVisibility('confirm')}
                      className="focus:outline-none focus:text-amber-400 text-gray-400 hover:text-gray-500"
                    >
                      {showPassword.confirm ? (
                        <EyeOffIcon className="h-5 w-5" />
                      ) : (
                        <EyeIcon className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>
                {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>}
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="mt-8 flex justify-end space-x-4">
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-400"
            >
              <X className="mr-2 h-5 w-5 text-gray-400" />
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-amber-500 hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-400"
            >
              <Save className="mr-2 h-5 w-5" />
              Save Changes
            </button>
          </div>
        </form>
      </div>

      {showConfirmation && (
          <ConfirmationPopup
            message="Are you sure you want to save these changes?"
            onConfirm={() => {
              handleConfirm();
              setShowConfirmation(false);
            }}
            onCancel={() => setShowConfirmation(false)}
          />
        )}

    </div>
    </>

  );
}

export default UserDetailsForm;

