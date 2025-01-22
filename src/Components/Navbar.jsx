import React, { useState } from 'react'
import { User, ShoppingCart, LogOut, LogIn, Menu, X, Cake,Heart } from 'lucide-react'

const NavLink = ({ href, children }) => (
  <a
    href={href}
    className="text-white hover:text-[#d8cbc4] px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
  >
    {children}
  </a>
)

export default function NavBar() {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const toggleUserMenu = () => setIsUserMenuOpen(!isUserMenuOpen)
  const toggleAuth = () => setIsAuthenticated(!isAuthenticated)

  return (
    
      <nav className=" bg-[#3d2516] bg-opacity-80 backdrop-blur-md shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-24">
            <div className="flex items-center">
              <a href="/" className="flex items-center text-white text-3xl font-bold drop-shadow-lg">
                <Cake className="h-8 w-8 mr-2" />
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
            
              <a href="/user/cart" className="text-white hover:text-[#d8cbc4]">
                <ShoppingCart className="h-6 w-6" />
              </a>
              <a href="/user/wishlist" className="text-white hover:text-[#d8cbc4]">
                <Heart className="h-6 w-6" />
              </a>
            
              <div className="md:hidden">
                <button
                  className="inline-flex items-center justify-center p-2 rounded-md text-white hover:text-[#d8cbc4] hover:bg-[#5b3e31] focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                >
                  <Menu className="block h-6 w-6" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>
    
  )
}