import React, { useState ,useEffect} from 'react'
import { User, Mail, Phone, Lock, EyeIcon, EyeClosed } from 'lucide-react'
import axios from 'axios';
import Carousel from '../../Components/Carousel';
import OTPInput from '../../Components/OTPvarify';
import {GoogleLogin} from '@react-oauth/google'
import toast, { Toaster } from "react-hot-toast";
import { useDispatch } from 'react-redux';
import axioInstence from '../../utils/axioInstence';
import { userLoginSuccess } from '../../redux/slices/authSlice';


function SignupPage() {

const dispatch = useDispatch()
  const [isOtpModalVisible, setOtpModalVisible]= useState(false)
  const [loading, setLoading] = useState(false)
  const [passwordVisible, setPasswordVisible] = useState(false);

     const [formData, setFormData] = useState({
       fullName:"",
       email:"",
       mobile:"",
       password:"",
       confirmPassword:""
      })
      const [errors, setErrors] = useState({});
      useEffect(() => {}, []);
      
      
      
      const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({...formData,[name]:value});
        
        setErrors({...errors,[name]:''})
      };
      
      const validateForm = () => {
        const newErrors = {};
        const nameRegex = /^[a-zA-Z\s]+$/;
        const numberRegex = /^[1-9][0-9]$/;

        if (!formData.fullName||!nameRegex.test(formData.fullName)){
          newErrors.fullName = 'Full name is not proper.';
       }        
        if (!formData.email) newErrors.email = 'Email is required.';
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid.';

        if (!formData.mobile || !numberRegex.test(formData.mobile)){ 
          newErrors.mobile = 'Mobile number must be 10 digits.';
        }        
        else if (formData.mobile.length < 10) newErrors.mobile = 'Phone Number is invalid.';
        if (!formData.password) {
          newErrors.password = 'Password is required.';
        } else if (formData.password.length < 8) {
          newErrors.password = 'Password must be at least 8 characters.';
        } else if (!/[A-Z]/.test(formData.password)) {
          newErrors.password = 'Password must contain at least one uppercase letter.';
        } else if (!/[a-z]/.test(formData.password)) {
          newErrors.password = 'Password must contain at least one lowercase letter.';
        } else if (!/[0-9]/.test(formData.password)) {
          newErrors.password = 'Password must contain at least one number.';
        } else if (!/[!@#$%^&*]/.test(formData.password)) {
          newErrors.password = 'Password must contain at least one special character.';
        }
      
        if (!formData.confirmPassword) newErrors.confirmPassword = 'Confirm Password is required.';
        else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match.';
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
      };
      



      const handleSubmit = async (e)=>{
        e.preventDefault()
        if(!validateForm()) return
        
        setLoading(true)
        console.log("Form Data Updated:", formData);
        try {
          const response = await axioInstence.post('/auth/signup',formData)
          console.log("Respose:",response.data);
          setOtpModalVisible(true)
        } catch (error) {
          console.error("Error:",error.response)
          toast.error(error.response.data.message)
        }finally{
          setLoading(false)
        }
      }
      


      
      const closeOtpModal = () =>{
        setOtpModalVisible(false)
      }


      
      const handleGoogleSuccess = async (response) => {
        try {
          console.log(response);
          
          const {credential} = response
          
          const res = await axioInstence.post('/auth/google/signup', { tokenId:credential });
          console.log('Google SignU', res.data);
          if(res.data){
            toast.success("Signup successful! Welcome KBSBakes.")
            const{user, role} = res.data
            if(role === 'user'){
              setTimeout(() => {
                dispatch(userLoginSuccess({user, role}))
              },2000);
            }else{
              toast.error("SignUp failed!.")
            }
          }
        } catch (error) {
          console.error("Google Sign-Up Error:",error.response);
          toast.error(error.response.data.message)
          
        }finally{
          setLoading(false)
        }
        
      };
      
      const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
      };
      
      const handleGoogleFailure = (error) => {
        console.error("Google Login Error Details:", error);
      };
      
      
      return (
        <div className="min-h-screen bg-[#d8cbc4] flex items-center justify-center p-4">
      <Toaster position="top-right" reverseOrder={false}/>
      <div className="w-full max-w-7xl h-[750px] bg-white/80 backdrop-blur-sm rounded-[2rem] shadow-xl flex overflow-hidden">
        {/* Left Side - Illustration */}
        <div className="hidden lg:flex lg:w-1/2 bg-[#d8cbc4] p-12 flex flex-col items-center justify-center">
          <div className="text-center ">
            <h1 className="text-2xl font-bold text-[#5b3e31] ">Welcome to KBS Bakes Where every bite feels like home!</h1>
            <p className="text-lg text-[#5b3e31]">
            Join us today, indulge in sweet creations, and experience the magic of freshly baked delights. Let’s make memories!
            </p>
          </div>
          <Carousel/>
        </div>

        {/* Right Side - Form */}
        <div className="w-full lg:w-1/2 p-8 md:p-12 bg-gradient-to-br from-white/80 to-[#765341]">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 flex items-center justify-center gap-2">
              <span>KBS</span>
              <span className="text-[#FFFFFF]">BAKES</span>
            </h2>
            <p className="text-[#5b3e31] ">Create your account and start your journey with us!</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 max-w-sm mx-auto">
            <div className="relative">
              <label htmlFor="fullName" className="block text-xs font-medium text-gray-700">
                Full Name
              </label>
              <div className="relative rounded-lg shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id='fullName'
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg bg-white/70 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4a9d5e] focus:border-transparent transition-all duration-200"
                  placeholder="John Smith"
                />
              </div>
              {errors.fullName && <p className="text-red-500 text-sm ">{errors.fullName}</p>}
            </div>

            <div className="relative">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 ">
                Email Address
              </label>
              <div className="relative rounded-lg shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg bg-white/70 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4a9d5e] focus:border-transparent transition-all duration-200"
                  placeholder="john@example.com"
                />
              </div>
              {errors.email && <p className="text-red-500 text-sm ">{errors.email}</p>}
            </div>

            <div className="relative">
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 ">
                Phone Number
              </label>
              <div className="relative rounded-lg shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="number"
                  id='mobile'
                  name="mobile"
                  onChange={handleChange}
                  value={formData.mobile}
                  className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg bg-white/70 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4a9d5e] focus:border-transparent transition-all duration-200"
                  placeholder="+1 (555) 000-0000"
                />
              </div>
              {errors.mobile && <p className="text-red-500 text-sm ">{errors.mobile}</p>}

            </div>

            <div className="relative">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative rounded-lg shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={passwordVisible ? 'text' : 'password'}
                  id='password'
                  name="password"
                  onChange={handleChange}
                  value={formData.password}
                  className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg bg-white/70 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4a9d5e] focus:border-transparent transition-all duration-200"
                  placeholder="••••••••"
                />
                   <div
                    className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                    onClick={togglePasswordVisibility}
                    >
                    {passwordVisible ? (
                      <EyeClosed className="h-5 w-5 text-gray-400" />
                    ) : (
                      <EyeIcon className="h-5 w-5 text-gray-400" />
                    )}
                 </div>
              </div>
              {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
            </div>
            <div className="relative">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <div className="relative rounded-lg shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={passwordVisible ? 'text' : 'password'}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg bg-white/70 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4a9d5e] focus:border-transparent transition-all duration-200"
                  placeholder="••••••••"
                />
                   <div
                    className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                    onClick={togglePasswordVisibility}
                  >
                    {passwordVisible ? (
                      <EyeClosed className="h-5 w-5 text-gray-400" />
                    ) : (
                      <EyeIcon className="h-5 w-5 text-gray-400" />
                    )}
                   </div>
              </div>
              {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword}</p>}
            </div>

            <button
              type="submit"
              className="w-full bg-[#5b3e31] text-white rounded-lg px-4 py-2.5 font-medium hover:bg-[#765341] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-200 mt-6"
            >
               {loading ? "Loading...":"Sign Up"}
             
            </button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">or</span>
              </div>
            </div>
            <GoogleLogin
              buttonText="Sign up with Google"
              onSuccess={handleGoogleSuccess}
              onFailure={handleGoogleFailure}
              className="w-full flex items-center justify-center gap-3 bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-gray-700 font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4a9d5e] transition-all duration-200"
            />

            <p className="text-center text-sm text-gray-600 ">
              Already have an account?{' '}
              <a href="/user/login" className="text-[#FFFFFF] hover:text-[#3d8b4f] font-medium">
               Sign In
              </a>
            </p>
          </form>
        </div>
        {isOtpModalVisible && (
           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
           <div className="relative">
             <button
               onClick={closeOtpModal}
               className="absolute bottom-40  left-40 bg-gray-300 p-3 rounded-full focus:outline-none z-10"
             >
               x
             </button>
             <OTPInput email={formData.email}/>
           </div>
         </div>
        )}
      </div>
    </div>
  )
}

export default SignupPage
