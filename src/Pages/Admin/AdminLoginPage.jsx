import React, { useState } from 'react'
import { ShieldCheck, Mail, Lock } from 'lucide-react'

import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { adminLoginSuccess } from '../../redux/slices/adminSlice'
import toast, { Toaster } from "react-hot-toast";
import axioInstence from '../../utils/axioInstence'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()
  const dispatch = useDispatch()


  const handleSubmit =  async(e) => {
    e.preventDefault()


    setEmailError('')
    setPasswordError('')

    if (!email || !password) {
      if (!email) setEmailError('Email is required')
      if (!password) setPasswordError('Password is required')
      return
    }

    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email address')
      return
    }



    try {
      const response = await axioInstence.post('/auth/admin/login',{
        email,
        password
      })
      console.log(response.data);
      const {admin} = response.data
      toast.success("SignUp Successfully!.")

           setTimeout(() => {
             dispatch(adminLoginSuccess({admin}))
             navigate('/admin/dashboard')
            }, 2000);
         
      } catch (error) {
        if (error.response && error.response.data) {
           console.log('abcded',error.response);
           
          toast.error(error.response.data.message);
        } else {
          toast.error("An unexpected error occurred. Please try again.");
        }
        console.error('Error during login:', error);
      }
    
  }

  return (
    <div className="flex h-screen bg-gray-100">

      <Toaster position="top-right" reverseOrder={false}/>
      <div className="hidden lg:block lg:w-1/2">
        <img
          src="/src/assets/images/adminimg.png"
          alt="Admin dashboard illustration"
          className="object-cover w-full h-full"
        />
      </div>


      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          <div className="bg-white shadow-md rounded-lg px-8 pt-6 pb-8 mb-4">
            <div className="text-center mb-8">
              <ShieldCheck className="mx-auto h-12 w-12 text-teal-500" />
              <h2 className="mt-2 text-2xl font-bold text-gray-900">
                Admin Login
              </h2>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              {emailError && <div className="text-red-500 text-sm mt-2">{emailError}</div>}
              </div>

              <div className="mb-6">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              {passwordError && <div className="text-red-500 text-sm mt-2">{passwordError}</div>}
              </div>
              <div>
                <button
                  type="submit"
                  className="w-full bg-teal-500 text-white py-2 px-4 rounded-md hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition duration-150 ease-in-out"
                >
                  Sign in
                </button>
              </div>
            </form>
          </div>
          <p className="text-center text-sm text-gray-600">
            Forgot your password?{" "}
            <a href="#" className="font-medium text-teal-600 hover:text-teal-500">
              Reset it here
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

