import React from 'react';
import '../index.css'

const OutOfStockSign = () => {
  return (
    <div className="relative h-64 bg-[#f5f3f0] ">

      <div className="absolute left-1/2 -translate-x-1/2  w-6 h-6 left-[40px] rounded-full bg-gradient-to-b from-gray-300 to-gray-400 shadow-md">
        <div className="absolute left-1/2 -translate-x-1/2 top-4 w-[2px] h-8 bg-gradient-to-b from-gray-400 to-gray-500"></div>
      </div>
      <div className="absolute left-1/2 -translate-x-1/2 top w-6 h-6 left-[130px] rounded-full bg-gradient-to-b from-gray-300 to-gray-400 shadow-md">
        <div className="absolute left-1/2 -translate-x-1/2 top-4 w-[2px] h-8 bg-gradient-to-b from-gray-400 to-gray-500"></div>
      </div>
     


      <div className="animate-sway absolute left-1/2 -translate-x-1/2 left-[10px] top-[30px]">
        <div className="relative">

          <div className="w-[150px] h-32 bg-red-700 rounded-lg shadow-lg border-4 border-white flex flex-col items-center justify-center transform perspective-1000">
            {/* Inner Border */}
            <div className="absolute inset-2 border-2 border-red-800 rounded-md"></div>
            

            <div className="text-white text-center">
              <div className="text-lg font-medium mb-1">Temporarily</div>
              <div className="text-2xl font-bold">Out of</div>
              <div className="text-2xl font-bold">Stock</div>
            </div>
          </div>


          <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 w-48 h-4 bg-black/10 blur-md rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default OutOfStockSign;