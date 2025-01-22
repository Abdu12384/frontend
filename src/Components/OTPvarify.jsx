


import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LockKeyhole, ArrowRight } from 'lucide-react';
import axios from 'axios'; // Import Axios
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from 'react-router-dom';
import axioInstence from '../utils/axioInstence';
<Toaster position="top-right" reverseOrder={false}/>

export default function OTPInput({email,otpLength = 6}) {
  const navigate = useNavigate()
  const [otp, setOtp] = useState(Array(otpLength).fill(''));
  const [timer, setTimer]= useState(60)
  const [isResending, setIsResending]= useState(false)
  const inputRefs = useRef([]);

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }

     const handlePaste = async (e) => {
      e.preventDefault();
      try {
        const pastetext = await navigator.clipboard.readText();
        const numericText = pastetext.replace(/\D/g, '');
        const otpDigits = numericText.slice(0, otpLength).split('');
        

         const paddedOtp = otpDigits
          .concat(Array(otpLength).fill(''))
          .slice(0, otpLength);    

        setOtp(paddedOtp);

        if (inputRefs.current[0]) {
          inputRefs.current[0].focus();
        }
      } catch (error) {
        console.error("Failed to read clipboard:", error);
        toast.error("Unable to paste code. Please copy it manually.");
      }    
    };

    document.addEventListener('paste', handlePaste);

    return () => {
      document.removeEventListener('paste', handlePaste);
    };

  }, [otpLength]);

  useEffect(()=>{
     if(timer >0){
      const interval = setInterval(()=>setTimer((prev)=>prev-1),1000)
      return ()=> clearInterval(interval)
     }
  },[timer])



  const handleChange = (element, index) => {
     const value =  element.value

     if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);


    if (value.length > 0 && index < otpLength - 1) {
      inputRefs.current[index + 1].focus();
    }
  };


  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace') {
      if (!otp[index] && index > 0) {
        inputRefs.current[index - 1].focus();
      } else {
         const newValues = [...otp]
          newValues[index]
          setOtp(newValues)
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpCode = otp.join(''); 
    console.log('Submitted OTP:', email,  otpCode);
    console.log('Email and OTP being sent:', {  otp: otpCode });

    try {

      const response = await axioInstence.post('/auth/verifyotp', { email, otp: otpCode });
      console.log('Backend Response:', response.data);
      if (response.data) {
        toast.success("Signup successful! Welcome KBSBakes.")
        } else {
        toast.error('Invalid OTP. Please try again.')
      }
      navigate('/user/login')
    } catch (error) {
      console.error('Error verifying OTP:', error);
      toast.error(error.response.data.message)

    }
  };

  const handleResend = async () => {
    if (!email) {
      toast.success('Email is missing. Please try again.')
      return;
    }
    setIsResending(true);
    setTimer(60); // Reset the timer to 2 minutes

    try {
      const response = await axioInstence.post('/auth/resendotp',{ email });
      if (response.data.success) {
        toast.success('OTP resent successfully!')
      } else {
        toast.error('Failed to resend OTP. Please try again.')
      }
    } catch (error) {
      console.error('Error resending OTP:', error);
      toast.error('An error occurred while resending the OTP.')
    } finally {
      setIsResending(false);
    }
  };





  return (
    <div className="fixed inset-0 bg-gradient-to-br  to-indigo-600 flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md"
      >
        <div className="flex items-center justify-center mb-8">
          <div className="bg-indigo-100 p-4 rounded-full">
            <LockKeyhole className="w-8 h-8 text-indigo-600" />
          </div>
        </div>
        <h2 className="text-3xl font-bold mb-2 text-center text-gray-800">
          Verify Your Account
        </h2>
        <p className="mb-8 text-center text-gray-600">
          We've sent a {otpLength}-digit verification code to your device.
        </p>
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="flex justify-between space-x-2">
            {otp.map((digit, index) => (
              <motion.input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(e.target, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                inputMode='numeric'
                pattern="\d*"
                className="w-12 h-16 text-center text-2xl font-bold bg-gray-100 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
                whileFocus={{ scale: 1.05 }}
                transition={{ type: 'spring', stiffness: 300, damping: 10 }}
              />
            ))}
          </div>
          <motion.button
            type="submit"
            className="w-full bg-indigo-600 text-white font-semibold py-4 px-6 rounded-xl hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all flex items-center justify-center text-lg"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="mr-2">Verify Code</span>
            <ArrowRight className="w-6 h-6" />
          </motion.button>
        </form>
        <p className="mt-8 text-center text-sm text-gray-600">
          {timer > 0 ? (
            <>
              Didn't receive the code?{' '}
              <span className="text-indigo-600 font-semibold">{Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}</span>
            </>
          ) : (
            <button
              onClick={handleResend}
              disabled={isResending}
              className="text-indigo-600 font-semibold hover:underline focus:outline-none"
            >
              {isResending ? 'Resending...' : 'Resend Code'}
            </button>
          )}
        </p>
      </motion.div>
    </div>
  );
}

