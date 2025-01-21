import React from 'react';
import '../index.css';
import { useNavigate } from 'react-router-dom';

const OrderConfirmation = () => {
  const decorations = [
    { type: 'star', color: 'bg-[#8B7355]', delay: '0s', top: '20%', left: '20%' },
    { type: 'diamond', color: 'bg-[#7E6B4A]', delay: '0.2s', top: '30%', right: '25%' },
    { type: 'circle', color: 'bg-[#6B5B3D]', delay: '0.4s', bottom: '35%', left: '30%' },
    { type: 'star', color: 'bg-[#8B7355]', delay: '0.6s', bottom: '30%', right: '30%' },
    { type: 'diamond', color: 'bg-[#7E6B4A]', delay: '0.8s', top: '40%', left: '25%' },
    { type: 'circle', color: 'bg-[#6B5B3D]', delay: '1s', bottom: '40%', right: '25%' },
    { type: 'star', color: 'bg-[#8B7355]', delay: '1.2s', top: '35%', right: '35%' },
    { type: 'diamond', color: 'bg-[#7E6B4A]', delay: '1.4s', bottom: '25%', left: '35%' }
  ];
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-[#4A3728] flex items-center justify-center p-4">
      <div className="text-center relative">
        {/* Decorative Elements */}
        {decorations.map((dec, index) => (
          <div
            key={index}
            className={`absolute w-5 h-5 ${dec.color} opacity-60 animate-float`}
            style={{
              top: dec.top,
              left: dec.left,
              right: dec.right,
              bottom: dec.bottom,
              animationDelay: dec.delay,
              clipPath: dec.type === 'star' 
                ? 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)'
                : dec.type === 'diamond'
                ? 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)'
                : undefined,
              borderRadius: dec.type === 'circle' ? '50%' : undefined
            }}
          />
        ))}
        
        {/* Check Mark Circle */}
        <div className="relative mb-8">
          <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto relative">
            <svg 
              className="w-12 h-12 text-[#4A3728]" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="3" 
                d="M5 13l4 4L19 7" 
              />
            </svg>
            {/* Spreading circles */}
            {[0.2, 0.4].map((delay, i) => (
              <div 
                key={i}
                className="absolute inset-0 border-4 border-white rounded-full opacity-50 animate-spread"
                style={{ animationDelay: `${delay}s` }}
              />
            ))}
          </div>
        </div>

        {/* Text Content */}
        <h1 className="text-white text-2xl font-bold mb-2">
          THANK YOU
        </h1>
        <h2 className="text-white text-3xl font-bold mb-4">
          YOUR ORDER IS CONFIRMED
        </h2>

        {/* Back to Shopping Button */}
        <button 
        onClick={()=>navigate('/user/cakes')}
        className="bg-white text-[#4A3728] font-bold py-2 px-6 rounded-full animate-pulse-scale hover:bg-opacity-90 transition-all duration-300">
          Back to Shopping
        </button>
      </div>
    </div>
  );
};

export default OrderConfirmation;

