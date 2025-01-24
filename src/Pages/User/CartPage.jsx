import React, { useState,useEffect } from 'react';
import { Truck, Phone, MessageCircle, GiftIcon, Minus, Plus, ShoppingCart, Trash2 } from 'lucide-react';
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from 'react-router-dom';
import NavBar from '../../Components/Navbar';
import { fetchCartItems, removeCartItem, updateCartItemQuantity } from '../../services/authService';
import { BreadcrumbUserDhbrd } from '../../Components/BrudCrums';
import { useDispatch } from 'react-redux';
import { userLogout } from '../../redux/slices/authSlice';

const CartPage = () => {
  const [cartsummury, setCartSummury]= useState()
  const [items, setItems] = useState([]);
  const navigate = useNavigate()

  const dispatch = useDispatch()

    const loadCartItems = async () => {
        try {
            const data = await fetchCartItems(); 
            console.log('Fetched cart items', data);
            setItems(Array.isArray(data.cartItems) ? data.cartItems : []); 
            setCartSummury(data.summary || {}); 
        } catch (error) {
            console.error('Error loading cart items', error);
            if (error.response?.data?.message === 'Please login to continue') {
              dispatch(userLogout())
         } 
        }
    };

 useEffect(() => {
    loadCartItems();
}, []); 



 console.log(items);
 

 
 const handleRemoveItem = async (productId, variantId) => {
  try {
      const response = await removeCartItem(productId, variantId); 
      toast.success(response.message); 
      setItems((prevItems) => 
          prevItems.filter((item) => 
              !(item.product._id === productId && item.variantDetails._id === variantId)
          )
      ); 
      console.log(`Item with ID ${productId} removed successfully`);
      loadCartItems()
  } catch (error) {
      toast.error(error.response?.data?.message ); 
      console.error('Error while removing item:', error.message);
  }
};



const handleUpdateQuantity = async (id, change) => {
  try {
      const updatedItem = items.find(item => item._id === id);
      const newQuantity = Math.max(1, updatedItem.quantity + change); 

      const response = await updateCartItemQuantity(updatedItem.product._id, updatedItem.variantDetails._id, newQuantity); // Call the API service function
      toast.success(response.message); 

      setItems((prevItems) =>
          prevItems.map((item) =>
              item._id === id ? { ...item, quantity: newQuantity } : item
          )
      ); 
      await loadCartItems();
  } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update quantity. Please try again.'); // Show error message
      console.error('Error updating quantity:', error.message);
  }
};


const breadcrumbItems = [
  { label: 'Home', url: '/' },
  { label: 'Dashboard', url: '/user/dashboard' },
  { label: 'cart', url: null }, 
];


  return (
    <>
      <NavBar/>
    <div className="min-h-screen bg-white">
            <Toaster position="top-right" reverseOrder={false}/>
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
        .animate-pulse {
          animation: pulse 2s infinite;
        }
      `}</style>
      <div className="max-w-7xl mx-auto p-8">
      <BreadcrumbUserDhbrd  items={breadcrumbItems}/>
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Cart Section */}
          <div className="flex-grow">
            <h1 className="text-3xl font-bold mb-6 text-[#3d251e] flex items-center gap-2">
              <ShoppingCart className="w-8 h-8" />
              Shopping Bag
            </h1>
            <p className="text-gray-600 mb-6">{items.length} items in your bag.</p>

            {/* Product List */}
            <div className="space-y-6">
              {items.map((item, index) => (
                <div key={item._id} className="bg-white relative rounded-lg p-6 shadow-md border-2 border-[#d8cbc4] animate-fadeIn" style={{animationDelay: `${index * 0.1}s`}}>
                  <div className="grid   md:grid-cols-4 gap-6 items-center">
                    <div className="flex gap-4 ">
                      <img
                        src={item.images[0]}
                        alt={item.productName}
                        className="w-24 h-24 object-cover  rounded-md"
                      />
                         {item?.product?.offer?.offerPercentage && (
                          <div className="absolute top-0 left-0  bg-gradient-to-r from-red-600 to-pink-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg transform -rotate-12">
                            <div className="relative">
                              <span className="block text-center text-sm">
                                {item?.product?.offer?.offerPercentage}%
                              </span>
                              <span className="block text-center text-[10px] font-normal">OFF</span>
                              <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white"></div>
                            </div>
                          </div>
                        )}
                      <div>
                        <p className="text-[#a08679] font-medium">{item.category}</p>
                        <h3 className="font-semibold text-gray-800">{item.productName}</h3>
                        <div className="text-gray-600 mt-1">
                          {/* <p>Color • {item.}</p> */}
                          <p>Size • {item.variantDetails.weight}</p>
                        </div>
                      </div>
                    </div>
                    <div className="text-gray-800 font-medium">₹{item.variantDetails.salePrice ?item.variantDetails?.salePrice?.toFixed(2): item.variantDetails.regularPrice}</div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleUpdateQuantity(item._id, -1)}
                        className="p-2 rounded-full border border-gray-300 hover:bg-gray-100 transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-8 text-center font-medium">{item.quantity}</span>
                      <button
                        onClick={() => handleUpdateQuantity(item._id, 1)}
                        className="p-2 rounded-full border border-gray-300 hover:bg-gray-100 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-[#3d251e] text-lg">
                        ₹{(item.variantDetails.salePrice * item.quantity || item.variantDetails.regularPrice * item.quantity).toFixed(2)}
                      </span>
                      <button
                        onClick={() => handleRemoveItem(item.product._id, item.variantDetails._id)}
                        className="p-2 text-red-500 hover:bg-red-100 rounded-full transition-colors"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-6 h-6" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cart Total */}
          <div className="lg:w-96">
            <div className="bg-[#a08679] rounded-lg p-6 shadow-lg animate-pulse">
              <h2 className="text-2xl font-semibold mb-6 text-white flex items-center gap-2">
                <ShoppingCart className="w-6 h-6" />
                Cart Total
              </h2>
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-white">
                  <span>Cart Subtotal</span>
                  <span>₹{cartsummury?.totalPrice}</span>
                </div>
                <div className="flex justify-between text-white">
                  <span>Quantity</span>
                  <span>₹{cartsummury?.totalItems}</span>
                </div>
               
                <div className="flex justify-between font-bold text-xl pt-4 border-t border-[#8b6c5c] text-white">
                  <span>Cart Total</span>
                  <span>₹{cartsummury?.totalPrice}</span>
                </div>
              </div>
              {cartsummury?.totalItems > 0 ? ( <button 
               onClick={()=>navigate('/user/checkout')}
                className="w-full py-3 rounded-md font-medium transition-all hover:bg-[#2a1a15] bg-[#3d251e] text-white text-lg shadow-md"
              >
                Proceed to Checkout
              </button>
              ):(
                <div className="text-center text-xl font-medium">
                <p>Your cart is empty.</p>
              </div>
              )}
            </div>
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
          <div className="bg-white p-6 rounded-lg shadow-md border border-[#d8cbc4] animate-fadeIn" style={{animationDelay: '0.3s'}}>
            <div className="bg-[#d8cbc4] p-3 rounded-full inline-block mb-4">
              <Truck className="w-8 h-8 text-[#3d251e]" />
            </div>
            <h3 className="font-semibold text-gray-800 text-lg mb-2">Free Shipping</h3>
            <p className="text-gray-600">When you spend ₹500+</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md border border-[#d8cbc4] animate-fadeIn" style={{animationDelay: '0.4s'}}>
            <div className="bg-[#d8cbc4] p-3 rounded-full inline-block mb-4">
              <Phone className="w-8 h-8 text-[#3d251e]" />
            </div>
            <h3 className="font-semibold text-gray-800 text-lg mb-2">Call Us Anytime</h3>
            <p className="text-gray-600">+34 555 5555</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md border border-[#d8cbc4] animate-fadeIn" style={{animationDelay: '0.5s'}}>
            <div className="bg-[#d8cbc4] p-3 rounded-full inline-block mb-4">
              <MessageCircle className="w-8 h-8 text-[#3d251e]" />
            </div>
            <h3 className="font-semibold text-gray-800 text-lg mb-2">Chat With Us</h3>
            <p className="text-gray-600">We offer 24-hour chat support</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md border border-[#d8cbc4] animate-fadeIn" style={{animationDelay: '0.6s'}}>
            <div className="bg-[#d8cbc4] p-3 rounded-full inline-block mb-4">
              <GiftIcon className="w-8 h-8 text-[#3d251e]" />
            </div>
            <h3 className="font-semibold text-gray-800 text-lg mb-2">Gift Cards</h3>
            <p className="text-gray-600">For your loved one, in any amount</p>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default CartPage;

