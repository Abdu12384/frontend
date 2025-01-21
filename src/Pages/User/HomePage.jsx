import React from 'react';
import {  Clock, Award, Gift } from 'lucide-react';
import Header from '../../Components/Header'
import Footer from '../../Components/Footer'
import ProductList from '../../Components/ProductList';
import backeryImage from '../../assets/images/bakery.png'

const Home = () => {
  return (
    <>
      <Header/>
      <ProductList/>
      <section className="py-16 bg-[#bca89f]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-[#3d2516] mb-8 text-center">Why Choose KBS BAKES?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Clock className="w-12 h-12 text-[#5b3e31]" />}
              title="Fresh Daily"
              description="Our cakes are baked fresh every day, ensuring the best quality and taste."
            />
            <FeatureCard 
              icon={<Award className="w-12 h-12 text-[#5b3e31]" />}
              title="Award-Winning"
              description="Recognized for our exceptional flavors and designs by culinary experts."
            />
            <FeatureCard 
              icon={<Gift className="w-12 h-12 text-[#5b3e31]" />}
              title="Custom Orders"
              description="Create your dream cake with our personalized design service."
            />
          </div>
        </div>
      </section>

      <section className="py-16 bg-[#d8cbc4]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <h2 className="text-3xl font-bold text-[#3d2516] mb-4">About KBS BAKES</h2>
              <p className="text-[#5b3e31] mb-6">
                At Cake Delights, we believe that every occasion deserves a perfect cake. Our master bakers combine
                traditional techniques with innovative flavors to create unforgettable desserts that will make your
                celebrations truly special.
              </p>
              <button className="bg-[#8b6c5c] text-white py-2 px-6 rounded-full hover:bg-[#765341] transition duration-300">
                Our Story
              </button>
            </div>
            <div className="md:w-1/2 md:pl-8">
              <div className="relative h-72 md:h-96 rounded-lg overflow-hidden shadow-lg">
                <img
                  src={backeryImage}
                  alt="Our Bakery"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-[#8b6c5c] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-8">Ready to Order?</h2>
          <p className="text-xl mb-8">Indulge in our delicious cakes for your next celebration!</p>
          <button className="bg-white text-[#5b3e31] py-3 px-8 rounded-full text-lg font-semibold hover:bg-[#d8cbc4] transition duration-300">
            Order Now
          </button>
        </div>
      </section>
      <Footer/>
    </>
  );
};

const FeatureCard = ({ icon, title, description }) => (
  <div className="bg-white rounded-lg shadow-lg p-6 text-center transform transition duration-300 hover:scale-105">
    <div className="flex justify-center mb-4">
      {icon}
    </div>
    <h3 className="text-xl font-semibold text-[#5b3e31] mb-2">{title}</h3>
    <p className="text-[#8b6c5c]">{description}</p>
  </div>
);

export default Home;

