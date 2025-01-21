import React from 'react';
import Lottie from 'lottie-react';
import cakeAnimation from '../animation/cakeLoading.json';
import OrderPlaceAnimation from '../animation/orderplace.json'

const LottieAnimation = () => {
  console.log('Rendering Lottie Animation');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/20 backdrop-blur-lg">
    <div style={{  maxWidth: '300px', width: '300px', height: '300px' }}>
      <Lottie
        animationData={cakeAnimation}
        loop={true}
        autoplay={true}
        style={{ width: '100%', height: '100%' }}
      />
      <p className="text-center text-[#5b3e31] mt-4">Signing in...</p>
    </div>
  </div>

  );
};
const OrderAnimation = () => {
  console.log('Rendering Lottie Animation');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/20 backdrop-blur-lg">
    <div style={{  maxWidth: '350px', width: '350px', height: '350px' }}>
      <Lottie
        animationData={OrderPlaceAnimation}
        loop={true}
        autoplay={true}
        style={{ width: '100%', height: '100%' }}
      />
      <p className="text-center text-[#5b3e31] mt-4">Oreder Placed...</p>
    </div>
  </div>

  );
};





export {LottieAnimation,OrderAnimation} 