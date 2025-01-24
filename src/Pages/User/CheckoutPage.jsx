import React, { useEffect, useState } from 'react';
import { Home, MapPin, Truck, ChevronRight, CreditCard, Wallet, Building, Tag, ShieldCheck, Lock, DollarSign,X  } from 'lucide-react';
import toast, { Toaster } from "react-hot-toast";
import { OrderAnimation } from '../../Components/cakeAnimation';
import CouponCard from '../../Components/Coupon';
import NavBar from '../../Components/Navbar';
import { useDispatch } from 'react-redux';
import { userLogout } from '../../redux/slices/authSlice';
import { useNavigate } from 'react-router-dom';
import { fetchCartItems, deductFromWallet, initiatePayment, verifyPayment, PaymentFailed } from '../../services/authService';
import { fetchAddressDetails, fetchWalletBalance, placeOrder, applyCoupon } from '../../services/authService';
import AddressForm from '../../Components/UserComponents/AddressForm';




const paymentMethods = [
  { id: 'wallet', name: 'Wallet Pay', icon: Wallet },
  { id: 'razorpay', name: 'Pay Online (Card/UPI/Wallet)', icon: CreditCard },
  { id: 'COD', name: 'Cash on Delivery', icon: DollarSign },
];

const CheckoutPage = () => {


  const [savedAddress, setSavedAddress] = useState([])
  const [selectedAddress, setSelectedAddress] = useState(savedAddress[0]);
  const [selectedPayment, setSelectedPayment] = useState(paymentMethods[0].id);
  const [loading, setLoading] = useState(false)
   const [cartItems , setCartItems] = useState([])
   const [showAddressForm, setShowAddressForm] = useState(false); 
   const [cartSummary, setCartSummary] = useState({
    subtotal: 0,
    shippingCharge: 0,
    totalGST:0,
    totalPriceWithGST:0,
    gstInfo:0,
    coupon:0,
    discount: 0,
    total: 0
  });

  const [walletBalance, setWalletBalance] = useState(0);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  const dispatch = useDispatch()
  const navigate = useNavigate()

  console.log('summ',cartSummary);
  
  const loadRazorpayScript = () => {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => reject(false);
      document.body.appendChild(script);
    });
  };

  const loadCartItems = async () => {
    try {
        const data = await fetchCartItems(); 
        console.log('Fetched cart items:', data);
        
            setCartItems(data.cartItems); 

        if (data.summary) {
            const subtotal = data.summary.totalPrice;
            const shippingCharge = subtotal < 1000 ? 50 : 0; 
            const total = data.summary.totalPriceWithGST + shippingCharge;

            setCartSummary({
                subtotal,
                totalGST:data.summary.totalGST,
                gstRate:data.summary.gstRate,
                shippingCharge,
                total,
            });
        }
    } catch (error) {
        console.error('Cart fetch error:', error);
        if (error.response?.data?.message === 'Please login to continue') {
          dispatch(userLogout())
      } 
    }
};
   




   const fetchAddresses = async () => {
    try {
        const data = await fetchAddressDetails(); 
        if (data && data.length > 0) {
            setSavedAddress(data);


            setSelectedAddress(data.find(addr => addr.isDefault) || data[0]);
        }
    } catch (error) {
        console.error('Error fetching addresses:', error);
    }
};



   
   




  const loadWalletBalance = async () => {
    try {
        const data = await fetchWalletBalance();
        if (data) {
            setWalletBalance(data); 
        }
    } catch (error) {
        console.error('Error loading wallet balance:', error);
    }
};



  const handleWalletPayment = async () => {

    if (walletBalance.balance < cartSummary.total) {
        toast.error('Insufficient wallet balance. Please choose another payment method.');
        return;
    }

    if (!selectedAddress) {
        toast.error('Please select a shipping address');
        return;
    }

    try {

        const orderDetails = {
            address: selectedAddress,
            paymentMethods: selectedPayment,
            cartItems,
            cartSummary,
        };

        const response = await deductFromWallet(orderDetails);
        console.log(response);

        if (response.success) {
          toast.success(response.message);
    
          setTimeout(() => {
            setLoading(true);
            setTimeout(() => {
              setLoading(false); 
              navigate('/user/order-success')
              setWalletBalance(walletBalance.balance - cartSummary.total); 
            }, 2000);
          }, 1000);
      } else {
          setLoading(false);
          toast.error(response.data.message || 'Payment failed');
        }  
    } catch (error) {
        toast.error(error.response?.data?.message || 'Payment failed');
        console.error('Error during wallet payment:', error);
    } finally {
        setLoading(false); 
    }
};

   

   useEffect(()=>{
    loadCartItems()
     fetchAddresses()
     loadWalletBalance()
   },[])

   
   const handleSaveAddress = () => {
    setShowAddressForm(false); 
    fetchAddresses()
  };




   const handleRazorpayPayment = async () => {

    if (!selectedAddress) {
        toast.error('Please select a shipping address');
        return;
    }

    try {
        const totalPrice = cartSummary.total;
        const paymentResponse = await initiatePayment(totalPrice); 
        const { id, amount, currency, key_id } = paymentResponse;

        console.log('Backend Response:', paymentResponse);


        const scriptLoaded = await loadRazorpayScript();
        if (!scriptLoaded) {
            toast.error('Payment Initialization Error: Razorpay library not loaded');
            return;
        }


        const options = {
            key: key_id,
            amount: amount,
            currency: currency,
            name: 'KBS Bakes',
            description: 'Order Payment',
            order_id: id,
            retry:{
              enabled: false
            },
            handler: async function (response) {
                const paymentData = {
                    razorpay_payment_id: response.razorpay_payment_id,
                    razorpay_order_id: response.razorpay_order_id,
                    razorpay_signature: response.razorpay_signature,
                    orderDetails: {
                        address: selectedAddress,
                        paymentMethods: selectedPayment,
                        cartItems,
                        cartSummary,
                    },
                };

                try {
                    const verifyResponse = await verifyPayment(paymentData); 
                      console.log('varifyreq',verifyResponse);
                      
                    if (verifyResponse.success) {
                        toast.success(verifyResponse.message);
                        setTimeout(() => {
                            setLoading(true);
                            setTimeout(() => {
                                setLoading(false);
                                navigate('/user/order-success');
                            }, 2000);
                        }, 1000);
                    } else {
                        toast.error(verifyResponse.message || 'Payment verification failed');
                    }
                } catch (error) {
                    toast.error(error.response.data.message);
                    console.error('Verification Error:', error);
                }
            },
            prefill: {
                name: selectedAddress.fullName,
                email: selectedAddress.email || '',
                contact: selectedAddress.phone,
            },
            theme: {
                color: '#6C63FF',
            },
        };

        const rzp = new window.Razorpay(options);

        rzp.on('payment.failed',async function (response){
          console.error('Payment Failed:',response.error)
          try {
            rzp.close();
            console.log('Razorpay modal closed');
        } catch (closeError) {
            console.error('Error closing Razorpay modal:', closeError);
        }


            const failedPaymentData = {
              orderDetails:{
                 address: selectedAddress,
                 paymentMethods: selectedPayment,
                 cartItems,
                 cartSummary
              },
              paymentFailure:{
                reason: response.error.reason,
                description:  response.error.description,
                order_id: response.error.metadata.order_id,
                payment_id: response.error.metadata.payment_id,

              }
            }
            try {
              const failureResponse = await PaymentFailed(failedPaymentData); 
                console.log('graint',failureResponse);
                
              if (failureResponse.success) {
                  toast.success(failureResponse.message);
                  setTimeout(() => {
                    setLoading(true);
                    setTimeout(() => {
                        setLoading(false);
                        navigate('/user/order-failed');
                    }, 2000);
                }, 1000);
                 
              } else {
                  toast.error(failureResponse.message || 'Failed to create order for failed payment.');
              }
          } catch (error) {
              toast.error('Error handling failed payment.');
              console.error('Failed Payment Error:', error);
          }

        })


        rzp.open();
        
    } catch (error) {
        toast.error(error.response?.data?.message || 'Payment Initialization Error');
        console.error('Payment Initialization Error:', error);
    }
};

   

   

   const handlePlaceOrder = async () => {
    if (!selectedAddress) {
        toast.error('Please select a shipping address');
        return;
    }
    if (!selectedPayment) {
        toast.error('Please select a payment method');
        return;
    }

    const orderData = {
        address: selectedAddress,
        paymentMethods: selectedPayment,
        cartItems,
        cartSummary,
    };
    console.log('Order data:', orderData);

    try {
        const response = await placeOrder(orderData); 
        
        if (response.success) {
          toast.success(response.message);
    
          setTimeout(() => {
            setLoading(true);
            setTimeout(() => {
              setLoading(false); 
              navigate('/user/order-success')
            }, 2000);
          }, 1000);
      } else {
          setLoading(false);
          toast.error(response.data.message || 'Payment failed');
        }  
    } catch (error) {
        setLoading(false);
        toast.error(error.response?.data?.message || 'Failed to place order');
        console.error('Error placing order:', error.response?.data?.message);
    }
};


   
const handleApplyCoupon = async () => {
  try {
      const response = await applyCoupon(couponCode, cartSummary.total); 
       console.log('copuon ',response);
       
      if (response) {
          setAppliedCoupon(couponCode);
          setCartSummary(prevSummary => ({
              ...prevSummary,
              coupon:response.coupon.discount,
              discount: response.discount,
              total:response.discountedTotal 
          }));
          toast.success('Coupon applied successfully!');
      } else {
          toast.error(response.message || 'Failed to apply coupon');
      }
  } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to apply coupon');
      console.error('Error applying coupon:', error.response?.data?.message);
  }
  setCouponCode(''); 
};


  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCartSummary(prevSummary => ({
      ...prevSummary,
      discount: 0,
      total: prevSummary.subtotal + prevSummary.shippingCharge
    }));
    toast.success('Coupon removed');
  };


  
  
  
  return (
    <>
      <NavBar/>
    <div className="min-h-screen bg-gray-50 p-6">
      {loading && <OrderAnimation/>}
            <Toaster position="top-right" reverseOrder={false}/>
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">
          <Home className="w-4 h-4" />
          <span>Home</span>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900">Checkout</span>
        </div>

        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Shipping Info & Payment */}
          <div className="lg:col-span-2 space-y-8">
            {/* Shipping Info */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-purple-600" />
                Shipping info
              </h2>

              <div className="space-y-4">
                <h3 className="font-medium">Select delivery address</h3>
                <div className="space-y-4">
                  {savedAddress.map(address => (
                    <div
                      key={address._id}
                      className={`border rounded-lg p-4 cursor-pointer transition-all ${
                        savedAddress._id === address._id
                          ? 'border-purple-500 bg-purple-50'
                          : 'hover:border-gray-400'
                      }`}
                      onClick={() => setSelectedAddress(address)}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium">{`${address.fullName} `}</p>
                          <p className="text-gray-600">{address.address}</p>
                          
                          <p className="text-gray-600">{`${address.city}, ${address.state} ${address.pincode}`}</p>
                          <p className="text-gray-600">{address.country}</p>
                        </div>
                        <div className="w-4 h-4 rounded-full border-2 border-purple-500 flex-shrink-0">
                          {selectedAddress._id === address._id && (
                            <div className="w-2 h-2 m-0.5 rounded-full bg-purple-500" />
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <button
                onClick={() => setShowAddressForm(true)}
                className="bg-purple-600 text-white px-4 py-2 rounded mt-4"
              >
                Add New Address
              </button>
              </div>
                  {showAddressForm && (
                  <div className="bg-gray-50 rounded-xl shadow-sm p-6 mt-4">
                    <button
                     onClick={()=>setShowAddressForm(false)}
                    >
                    <X/>
                    </button>
                    <AddressForm onSubmit={handleSaveAddress}/>
                  </div>
                )}
            </div>

            {/* Delivery Options */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <Truck className="w-5 h-5 text-purple-600" />
                Delivery options
              </h2>

              <div className="border rounded-lg p-4 cursor-pointer bg-purple-50 border-purple-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Standard</p>
                    <p className="text-gray-600">7-14 business days</p>
                  </div>
                  <p className="font-medium">₹50.00</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <Tag className="w-5 h-5 text-purple-600" />
                Coupons
              </h2>
              
              {appliedCoupon ? (
                <div className="bg-purple-100 rounded-lg p-4 mb-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-medium text-purple-700">{appliedCoupon}</span>
                      <span className="ml-2 text-sm text-purple-600">applied</span>
                    </div>
                    <button
                      onClick={handleRemoveCoupon}
                      className="text-purple-700 hover:text-purple-900"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <p className="text-sm text-purple-600 mt-2">
                    Discount of ₹{cartSummary?.discount?.toFixed(2)} applied to your order
                  </p>
                </div>
              ) : (
                <div className="flex gap-2 mb-6">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Enter coupon code"
                    className="flex-grow p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <button
                    onClick={() => handleApplyCoupon(couponCode)}
                    className="bg-purple-600 text-white rounded-md px-4 py-2 font-medium hover:bg-purple-700 transition-colors"
                  >
                    Apply
                  </button>
                </div>
              )}

             <CouponCard/>
            </div>



            {/* Payment Options */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-purple-600" />
                Payment method
              </h2>

              <div className="space-y-4">
                {paymentMethods.map(method => (
                  <div
                    key={method.id}
                    className={`border rounded-lg p-4 cursor-pointer transition-all ${
                      selectedPayment === method.id
                        ? 'border-purple-500 bg-purple-50'
                        : 'hover:border-gray-400'
                    }`}
                    onClick={() => setSelectedPayment(method.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <method.icon className="w-6 h-6 text-purple-600" />
                        <p className="font-medium">{method.name}</p>
                      </div>
                      <div className="w-4 h-4 rounded-full border-2 border-purple-500 flex-shrink-0">
                        {selectedPayment === method.id && (
                          <div className="w-2 h-2 m-0.5 rounded-full bg-purple-500" />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {selectedPayment === 'wallet' && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">
                    You will pay for your order using your wallet balance.₹{walletBalance.balance}
                  </p>
                </div>
              )}
              {selectedPayment === 'COD' && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">
                    You will pay for your order when it is delivered. Please have the exact amount ready.
                  </p>
                </div>
              )}

              <div className="mt-4 flex items-center text-sm text-gray-500">
                <Lock className="w-4 h-4 mr-2" />
                <span>Your payment info is stored securely</span>
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-6">
              <h2 className="text-xl font-semibold mb-6">Order summary</h2>

              <div className="space-y-4">
                {cartItems?.map(item => (
                  <div key={item?._id} className="flex gap-4">
                    <img
                      src={item?.images[0]}
                      alt={item?.productName}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <h3 className="font-medium">{item?.productName}</h3>
                        <p className="text-sm text-gray-600">{`x${item?.quantity}`}</p>
                        <p className="font-medium">₹{item?.variantDetails?.salePrice?.toFixed(2)||item.variantDetails.regularPrice.toFixed(2)}</p>
                      </div>
                      <div className="text-sm text-gray-500">
                         <p>Size: {item?.variantDetails?.weight}</p>

                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t mt-6 pt-6 space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">
                    ₹{cartSummary?.subtotal}
                  </span>
                </div>
                {appliedCoupon && (
                  <div className="flex justify-between items-center">
                    <p className="font-medium text-purple-600">Discount({cartSummary.coupon}%)</p>
                    <p className="font-medium text-purple-600">{`-₹${cartSummary?.discount.toFixed(
                      2
                    )}`}</p>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className={`font-medium ${cartSummary?.subtotal < 1000 ? 'text-red-600' : 'text-green-600'}`}>
                    {cartSummary?.subtotal < 1000  
                      ? '₹50.00' 
                      : 'FREE'}
                  </span>               
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-600">GST ({cartSummary?.gstRate}%)</span>
                <span className="font-medium text-blue-600">{`₹${(cartSummary?.totalGST).toFixed(2)}`}</span> 
              </div>
                

                <div className="flex justify-between text-lg font-bold">
                  <span>Order total</span>
                  <span>₹{cartSummary?.total.toFixed(2)}</span>
                </div>
              </div>

              
              <button
                onClick={selectedPayment === 'wallet' 
                ? handleWalletPayment
                : selectedPayment === 'razorpay' 
                ? handleRazorpayPayment 
                : handlePlaceOrder}
                className="w-full bg-purple-600 text-white rounded-lg py-4 mt-6 font-medium hover:bg-purple-700 transition-colors flex items-center justify-center"
                >
                <ShieldCheck className="w-5 h-5 mr-2" />
                {selectedPayment === 'wallet'
                ? 'Pay With Wallet'
                : selectedPayment === 'razorpay' 
                ? 'Pay with Razorpay' 
                : 'Place Order'}
              </button>
            

              <p className="text-xs text-gray-500 text-center mt-4">
                By placing your order, you agree to our Terms of Service and Privacy Policy
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default CheckoutPage;

