import React, { useState, } from 'react'
import { Mail, Lock, Coffee } from 'lucide-react'
import Carousel from '../../Components/Carousel'
import axioInstence from '../../utils/axioInstence'
import { useNavigate } from 'react-router-dom' 
import { useDispatch } from 'react-redux'
import {GoogleLogin} from '@react-oauth/google'
// import { loginSuccess } from '../../redux/slices/authSlice'
import { userLoginSuccess } from '../../redux/slices/authSlice'
import toast, { Toaster } from "react-hot-toast";
import { LottieAnimation } from '../../Components/cakeAnimation'




function LoginPage() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [email, setEmail] = useState('')
  const [password, setPassword]= useState()
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

     const handleSubmit = async(e)=>{
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

        try{
          setIsLoading(true)
           const response = await axioInstence.post('/auth/login',
            {email,password},
            {withCredentials:true}
           )
           console.log('resposne',response);
 
            const {user, role} = response.data
            if(role === 'user'){
              toast.success("SignIn successful!.")
              setTimeout(() => {
                dispatch(userLoginSuccess({ user })); // Dispatch the user login success action
                navigate( '/user/home')
              },3000);
            } else{
              setIsLoading(false)
              console.log('login user role not same');
              
            }
            
          }catch(error){
            setIsLoading(false)
             console.log('herthe error',error.response.data);
            toast.error(error.response.data.message || 'An error occurred. Please try again.');
        }finally {
          // setIsLoading(false)
        }    
     }

     const handleShowForgot = async()=>{
        navigate('/user/forgot-pass')
     }

     const handleGoogleSuccess = async (response) => {

       try {
       console.log('the rspons',response)
       const {credential} = response
       
                  
 const res = await axioInstence.post('/auth/google/signup', { tokenId:credential });
 console.log('Google SignUp Successful:', res);
       if (res.data) {
          toast.success(res.data.message);
          const{user, role} = res.data
          if(role === 'user'){
            setTimeout(() => {
              dispatch(userLoginSuccess({user}))
            },2000);
          }else{
            toast.error("SignUp failed!.")
          }
        }
      } catch (error) {
        console.error("Google Sign-In Error:", error);
        toast.error(error.response.data.message);
      }
    };

    const handleGoogleFailure = (error) => {
      console.error("Google Sign-In Error:", error);
      toast.error("Google Sign-In failed. Please try again.");
    };


  return (
    <>
    <div className="min-h-screen bg-[#d8cbc4] flex items-center justify-center p-4">
    {isLoading && <LottieAnimation />}
      <div className="w-full max-w-7xl h-[750px] bg-white/80 backdrop-blur-sm rounded-[2rem] shadow-xl flex overflow-hidden">
      <Toaster position="top-right" reverseOrder={false}/>
        {/* Left Side - Form */}
        <div className="w-full lg:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-gradient-to-br from-white/80 to-[#765341]">
          <div className="max-w-md mx-auto w-full">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-[#5b3e31] flex items-center justify-center gap-2">
                <span>KBS</span>
                <span className="text-[#FFFFFF]">BAKES</span>
              </h2>
              <p className="text-[#5b3e31] mt-3">Welcome back! Please sign in to continue.</p>
            </div>
            
            <form  onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <div className="relative rounded-lg shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e)=>setEmail(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg bg-white/70 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4a9d5e] focus:border-transparent transition-all duration-200"
                    placeholder="john@example.com"
                  />
                </div>
              </div>
              {emailError && <div className="text-red-500 text-sm mt-2">{emailError}</div>}
              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="relative rounded-lg shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e)=>setPassword(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg bg-white/70 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4a9d5e] focus:border-transparent transition-all duration-200"
                    placeholder="••••••••"
                  />
                </div>
              </div>
              {passwordError && <div className="text-red-500 text-sm mt-2">{passwordError}</div>}

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-[#4a9d5e] focus:ring-[#4a9d5e] border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                    Remember me
                  </label>
                </div>
                <button 
                type="button"
                onClick={handleShowForgot} 
                className="text-sm font-medium text-[#FFFFFF] hover:text-[#3d8b4f]">
                  Forgot password?
                </button>
              </div>

              <button
                type="submit"
                className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 font-medium hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-200"
              >
                Sign in
              </button>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">or continue with</span>
                </div>
              </div>

              <GoogleLogin
                buttonText="Sign in with Google"
                onSuccess={handleGoogleSuccess}
                onFailure={handleGoogleFailure}
                className="w-full flex items-center justify-center gap-3 bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-gray-700 font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4a9d5e] transition-all duration-200"
              />

              <p className="text-center text-sm text-gray-600">
                Don't have an account?{' '}
                <a href="/user/signup" className="text-[#FFFFFF] hover:text-[#3d8b4f] font-medium">
                  Sign up
                </a>
              </p>
            </form>
          </div>
        </div>

        {/* Right Side - Illustration */}
        <div className="hidden lg:flex lg:w-1/2 bg-[#d8cbc4] p-12 flex-col items-center justify-center">
          <div className="max-w-md text-center">
            <div className=" flex justify-center">
              <Coffee className="w-16 h-16 text-[#FFFFFF]" />
            </div>
            <h1 className="text-2xl font-bold text-[#5b3e31] mb-0">Welcome back to KBS Bakes!</h1>
            <p className="text-lg text-gray-600 ">
              Sign in to explore our delicious treats and place your order. Your next sweet adventure awaits!
            </p>
          </div>
          <Carousel/>
        </div>
      </div>
    </div>
    </>
  )
}

export default LoginPage
