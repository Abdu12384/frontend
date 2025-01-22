import React, { useState, useEffect } from 'react';
import { Menu, X,User, ShoppingCart,CakeSlice, User2, LogOut, LogIn, Heart } from 'lucide-react';
import { useDispatch } from 'react-redux';
// import { logout } from '../redux/slices/authSlice';
import { userLogout } from '../redux/slices/authSlice';
import { useNavigate } from 'react-router-dom';
import axioInstence from '../utils/axioInstence';
import { useSelector } from 'react-redux';
import toast, { Toaster } from "react-hot-toast";
import ConfirmationPopup from './ConformButton';
import bannerImg1 from '../assets/images/banner1.jpg'
import bannerImg2 from '../assets/images/banner2.jpg'
import bannerImg3 from '../assets/images/banner3.jpg'
import bannerImg4 from '../assets/images/banner4.jpg'


const Header = () => {
  
  const {isAuthenticated, user} = useSelector((state)=>state.user)
  const [isLogoutConfirmationOpen, setIsLogoutConfirmationOpen] = useState(false); 
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const navigate = useNavigate()
 const dispatch = useDispatch()
  const images = [
    bannerImg1,
    bannerImg2,
    bannerImg3,
    bannerImg4,
    
  ]; 

 
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prevImage) => (prevImage + 1) % images.length);
    }, 4000); ``

    return () => clearInterval(interval); 
  }, [images.length]);

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };
  
  
  
  const handleLogout = async()=>{
    try {
      toast.success("Logout Successfully")

      await axioInstence.post('/user/logout')
      setTimeout(() => {
        dispatch(userLogout())
      }, 2000);

    } catch (error) {
      console.log("Logout failed",error);
      
    }
  }




  return (
    <header className="relative">
      <Toaster position="top-right" reverseOrder={false}/>
     
      <div className="absolute inset-0 z-0 overflow-hidden">

        {images.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`Banner ${index + 1}`}
            className={`absolute w-full h-full object-cover transition-opacity duration-[4s] ease-in-out ${
              index === currentImage ? 'opacity-100 z-10' : 'opacity-0'
            }`}
          />
        ))}
      </div>
      <div className={`relative z-10 transition-all duration-300`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-24">
            <div className="flex items-center">
              <a href="/" className="text-white text-3xl font-bold drop-shadow-lg">
                KBS BAKES
              </a>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <NavLink href="/">Home</NavLink>
                <NavLink href="/user/about">About</NavLink>
                <NavLink href="/user/cakes">Cakes</NavLink>
                <NavLink href="/user/contact">Contact</NavLink>
              </div>
            </div>

            <div className="flex items-center space-x-6">
            <div className="relative">
              <button
                  onClick={toggleUserMenu}
                  className=" relative text-white hover:text-[#d8cbc4] focus:outline-none transition-colors duration-200"
                >
                  <User className="h-6 w-6" />
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 w-56 bg-white  rounded-lg shadow-xl py-2 z-50 transform  scale-95 transition-all duration-200 ease-out origin-top-right animate-fade-in-up">
                      {isAuthenticated ? (     
                        <div className="px-4 py-2 border-b border-gray-200">
                        <p className="text-sm font-medium text-gray-900">Welcome,{user.fullName}!</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                      ):(
                        <div className="px-4 py-2 border-b ">
                      <p className="text-sm font-medium text-gray-900">Welcome to KBS Bakes! Please log in to place your order.</p>
                      </div>

                      )}
                   {isAuthenticated && <a
                      href="/user/dashboard"
                      className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-200 flex items-center"
                    >
                      <User2 className="mr-3 h-5 w-5 text-[#8b6c5c]" />
                      your Account 
                    </a>
                      }                  
                    <div className="border-t border-gray-200 mt-2">
                      {isAuthenticated ?(
                        <button
                        onClick={()=>setIsLogoutConfirmationOpen(true)} 
                        className="block px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200 flex items-center w-full text-left"
                      >
                        <LogOut className="mr-3 h-5 w-5" />
                        Logout
                      </button>
                      ):(
                        <button
                        onClick={() => navigate('/user/login')}
                        className="block px-4 py-3 text-sm text-blue-600 hover:bg-blue-50 transition-colors duration-200 flex items-center w-full text-left"
                      >
                        <LogIn className="mr-3 h-5 w-5" /> 
                        Login
                      </button>
                      )}
                    </div>
                  </div>
                )}
                   {isLogoutConfirmationOpen && (
                  <ConfirmationPopup
                    message = 'Are you sure you want to logout?' 
                    onConfirm={() => {
                      handleLogout();
                      setIsLogoutConfirmationOpen(false); 
                    }}
                    onCancel={() => setIsLogoutConfirmationOpen(false)} 
                  />
                )}
              </div>
              <a href="/user/cart" className="text-white hover:text-[#d8cbc4]">
                <ShoppingCart className="h-6 w-6" />
              </a>
              <a href="/user/wishlist" className="text-white hover:text-[#d8cbc4]">
                <Heart className="h-6 w-6" />
              </a>

            
            
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-[#d8cbc4] hover:bg-[#5b3e31] focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              >
                <span className="sr-only">Open main menu</span>
                {isMenuOpen ? (
                  <X className="block h-6 w-6" aria-hidden="true" />
                ) : (
                  <Menu className="block h-6 w-6" aria-hidden="true" />
                )}
              </button>
             </div>
           </div>
          </div>
        </div>
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-[#3d2516] bg-opacity-90">
              <NavLink href="/" mobile>Home</NavLink>
              <NavLink href="/user/about" mobile>About</NavLink>
              <NavLink href="/user/cakes" mobile>Cakes</NavLink>
              <NavLink href="/user/contact" mobile>Contact</NavLink>
            </div>
          </div>
        )}
      </div>
      <div className="relative  flex items-center justify-center h-[calc(100vh-6rem)] text-center px-4">
        <div className="max-w-3xl">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg animate-fade-in-up">
            Indulge in Sweet Perfection
          </h1>
          <p className="text-xl md:text-2xl text-white mb-8 drop-shadow-lg animate-fade-in-up animation-delay-300">
            Handcrafted cakes for every occasion
          </p>
          <button 
          onClick={()=>navigate('/user/cakes')}
          className="bg-[#8b6c5c] text-white py-3 px-6 rounded-full text-lg font-semibold hover:bg-[#765341] transition duration-300 shadow-lg animate-fade-in-up animation-delay-600">
            Explore Our Cakes
          </button>
        </div>
      </div>
    </header>
  );
};

const NavLink = ({ href, children, mobile = false }) => (
  <a
    href={href}
    className={`${
      mobile
        ? 'block px-3 py-2 rounded-md text-base font-medium'
        : 'px-3 py-2 rounded-md text-sm font-medium'
    } text-white hover:bg-[#5b3e31] hover:text-[#d8cbc4] transition duration-300 drop-shadow-lg`}
  >
    {children}
  </a>
);

export default Header;

