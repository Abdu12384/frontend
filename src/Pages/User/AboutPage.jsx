import React, { useState } from "react"
import "../../index.css"
import { PlayCircle, User, ShoppingCart, Heart, Menu, X } from "lucide-react"
import "../../index.css"
import { useNavigate } from 'react-router-dom';
import { Link } from "react-router-dom"
import aboutImg1 from '../../../src/assets/images/AboutPageImg.jpg'
import aboutImg2 from '../../../src/assets/images/AboutPageImg2.jpg'



export default function AboutPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
 
  return (
    <div className="min-h-screen bg-[#f0e6e0] overflow-x-hidden">
      
      <nav className="bg-transparent absolute w-full z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-24">
            <div className="flex items-center">
              <Link to="/" className="text-[#5b3e31] text-3xl font-bold drop-shadow-lg">
                KBS BAKES
              </Link>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <NavLink href="/user/home">Home</NavLink>
                <NavLink href="/user/about">About</NavLink>
                <NavLink href="/user/cakes">Cakes</NavLink>
                <NavLink href="/user/contact">Contact</NavLink>
              </div>
            </div>

            <div className="flex items-center space-x-6">
              <button className="text-[#5b3e31] hover:text-[#8b6c5c] transition-colors duration-200">
                <User className="h-6 w-6" />
              </button>
              <Link to="/user/cart" className="text-[#5b3e31] hover:text-[#8b6c5c] transition-colors duration-200">
                <ShoppingCart className="h-6 w-6" />
              </Link>
              <Link to="/user/wishlist" className="text-[#5b3e31] hover:text-[#8b6c5c] transition-colors duration-200">
                <Heart className="h-6 w-6" />
              </Link>

              <div className="md:hidden">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="inline-flex items-center justify-center p-2 rounded-md text-[#5b3e31] hover:text-[#8b6c5c] hover:bg-[#d8cbc4] focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#5b3e31]"
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

        {/* Mobile menu, show/hide based on menu state */}
        {isMenuOpen && (
           <div className="md:hidden">
           <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-[#3d2516] bg-opacity-90">
             <NavLink href="/" mobile>Home</NavLink>
             <NavLink href="/about" mobile>About</NavLink>
             <NavLink href="/user/cakes" mobile>Cakes</NavLink>
             <NavLink href="/user/contact" mobile>Contact</NavLink>
           </div>
         </div>
        )}
      </nav>
      {/* Hero Section */}
      <div className="relative h-[60vh] bg-[#d8cbc4]">
        <div className="absolute inset-0">
          <video className="w-full h-full object-cover opacity-50" autoPlay muted loop playsInline>
            <source src="https://res.cloudinary.com/dujuwqvz5/video/upload/v1737365857/tnoavdfiqeyk9yz5heow.mp4" type="video/mp4" />
          </video>
        </div>
        <div className="relative h-full flex items-center justify-center text-center">
          <div className="max-w-3xl px-4">
            <h1 className="text-4xl md:text-6xl font-bold text-[#5b3e31] mb-6 animate-text-shimmer">Our Story</h1>
            <p className="text-xl text-[#8b6c5c] animate-typewriter">Baking moments of joy, one slice at a time since 2025.</p>
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <section className="py-20 px-4 bg-[#f0e6e0]">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 animate-rotate-in">
              <h2 className="text-3xl md:text-4xl font-bold text-[#5b3e31]">Our Mission & Vision</h2>
              <p className="text-lg text-[#8b6c5c] animate-fade-in animation-delay-300">
              At <strong>Sugar Bliss Creations</strong>, our mission is to spread joy through the art of baking. We strive
              to craft cakes that not only taste divine but also create unforgettable moments for your celebrations.
              </p>
              <p className="text-lg text-[#8b6c5c] animate-fade-in animation-delay-600">
              Our vision is to be the most loved destination for custom cakes and desserts, inspiring creativity and
              delight with every slice. From birthdays to weddings, we aim to make your special occasions truly
                extraordinary.

              </p>
            </div>
            <div className="relative aspect-square rounded-2xl overflow-hidden animate-bounce-in">
              <img
                src={aboutImg1}
                alt="Team collaboration"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>
    

      {/* Values Section */}
      <section className="bg-[#e5d8d0] py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-[#5b3e31] mb-12 animate-flip-in-x">
            Our Core Values
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Innovation",
                description: "Pushing boundaries and exploring new possibilities to create better solutions.",
              },
              {
                title: "Excellence",
                description: "Striving for the highest quality in everything we do, no compromises.",
              },
              {
                title: "Integrity",
                description: "Building trust through honest and ethical business practices.",
              },
            ].map((value, index) => (
              <div
                key={index}
                className="bg-[#f0e6e0] rounded-xl p-6 text-center shadow-lg animate-jello"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-[#a08679] flex items-center justify-center animate-wave">
                  <span className="text-[#f0e6e0] text-4xl">★</span>
                </div>
                <h3 className="text-xl font-semibold text-[#5b3e31] mb-4">{value.title}</h3>
                <p className="text-[#8b6c5c]">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>


      <section className="py-20 px-4 bg-[#f0e6e0]">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative aspect-square rounded-2xl overflow-hidden animate-bounce-in">
              <img
                src={aboutImg2}
                alt="Team collaboration"
                className="w-full h-full object-cover"
              />
             </div>

            <div className="space-y-6 animate-rotate-in">
              <h2 className="text-3xl md:text-4xl font-bold text-[#5b3e31]"> “Baking happiness, one slice at a time.”</h2>
              <p className="text-lg text-[#8b6c5c] animate-fade-in animation-delay-300">
              At <strong>KBS Bakery</strong>, our mission is to bring smiles through every bake. From
              handcrafted cakes to innovative designs, we aim to make every celebration sweeter.
              </p>
              <p className="text-lg text-[#8b6c5c] animate-fade-in animation-delay-600">
              Our vision is to be the ultimate destination for custom cakes and desserts, inspiring joy and creativity in
              every creation we deliver.
              </p>
            </div>
          </div>
        </div>
      </section>

     
      {/* Contact CTA */}
      <section className="bg-[#e5d8d0] py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-[#5b3e31] mb-6 animate-text-shimmer">
          Craving Something Sweet?
          </h2>
          <p className="text-xl text-[#8b6c5c] mb-8 animate-typewriter">
          Let us make your celebrations unforgettable with our custom cakes and desserts. Connect with us today to bring your vision to life!
          </p>
          <button className="bg-[#a08679] text-[#f0e6e0] px-8 py-3 rounded-full text-lg font-semibold hover:bg-[#8b6c5c] transition-colors animate-jello">
          Contact Us Now
          </button>
        </div>
      </section>
    </div>
  )
}

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

