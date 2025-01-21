import React,{useEffect, useState} from 'react';
import { Cake, Copy, Gift } from 'lucide-react';
import toast from 'react-hot-toast';
import axioInstence from '../utils/axioInstence';


const CouponCard = () => {

  const [availableCoupons, setAvailableCoupons] = useState([]);
  const copyToClipboard = (code) => {
    navigator.clipboard.writeText(code)
      .then(() => {
        toast.success('Coupon code copied!');
      })
      .catch((err) => {
        toast.error('Failed to copy coupon code!');
        console.error(err);
      });
  };


  const fetchCoupons = async () => {
    try {
      const response = await axioInstence.get('/user/coupons');
      if (Array.isArray(response.data)) {
        setAvailableCoupons(response.data);
      } else if (response.data && Array.isArray(response.data.data)) {
        setAvailableCoupons(response.data.data);
      } else {
        throw new Error('Invalid coupon data format');
      }
    } catch (error) {
      console.error('Failed to fetch coupons:', error);
      toast.error('Failed to load available coupons');
    }
  };

  useEffect(()=>{
    fetchCoupons()
  },[])

  console.log('coupob',availableCoupons);
  


  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {availableCoupons?.map((coupon) => (
          <div key={coupon?.id} className="w-full transform scale-100 sm:scale-90">
            <div className="relative flex flex-row h-full">
              {/* Left side - Main card */}
              <div className="relative flex-1 bg-[#E5C7BC] text-white min-h-[120px] sm:min-h-[180px]
                          [clip-path:polygon(0_10%,5%_0,95%_0,100%_10%,100%_90%,95%_100%,5%_100%,0_90%,0_80%,2%_75%,0_70%,0_60%,2%_55%,0_50%,2%_45%,0_40%,0_30%,2%_25%,0_20%)]">
                <div className="relative z-10 p-4 sm:p-6">
                  <div className="flex items-baseline gap-1 mb-2">
                    <span className="text-3xl sm:text-5xl font-bold text-white">{coupon?.discount}</span>
                    <span className="text-lg sm:text-xl text-white">%</span>
                  </div>
                  <p className="text-base sm:text-lg font-semibold text-white">CASHBACK</p>
                </div>
                <div className="absolute bottom-2 right-2 sm:bottom-4 sm:right-4 w-16 h-16 sm:w-24 sm:h-24">
                  <Cake className="w-full h-full text-white opacity-20" />
                </div>
              </div>

              {/* Right side - Voucher */}
              <div className="bg-[#F2DCD6] w-[140px] sm:w-[180px] flex flex-col justify-between
                          [clip-path:polygon(0_10%,5%_0,95%_0,100%_10%,100%_90%,95%_100%,5%_100%,0_90%,0_80%,2%_75%,0_70%,0_60%,2%_55%,0_50%,2%_45%,0_40%,0_30%,2%_25%,0_20%)]">
                <div className="p-3 sm:p-6">
                  <div className="border-2 border-dashed border-gray-400 p-2 sm:p-3 mb-2 sm:mb-4">
                    <p className="text-xs sm:text-sm text-gray-500 mb-1">VOUCHER CODE</p>
                    <div className="flex items-center justify-between">
                      <span className="text-base sm:text-lg font-bold text-gray-800">{coupon?.code}</span>
                      <button 
                        onClick={() => copyToClipboard(coupon.code)}
                        className="text-[#C7A69B] hover:text-[#E5C7BC] transition-colors"
                      >
                        <Copy className="w-4 h-4 sm:w-5 sm:h-5" />
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center text-[10px] sm:text-xs text-gray-500 mt-2 sm:mt-4">
                    <Gift className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                    <span>Special offer</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

  );
};

export default CouponCard;