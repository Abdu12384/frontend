import { Heart, Trash2, ShoppingCart, Package, Calendar, DollarSign } from 'lucide-react'
import axioInstence from '../../utils/axioInstence'
import React,{useEffect, useState} from 'react'
import toast, { Toaster } from "react-hot-toast";
import NavBar from '../../Components/Navbar';
import { BreadcrumbUserDhbrd } from '../../Components/BrudCrums';



export default function Wishlist() {

const [wishlistItems, setWishlistItems]=useState([])
const [selectedVariants, setSelectedVariants] = useState({})


  const fetchWishlist = async() =>{
    try {
      const response = await axioInstence.get('/user/mywishlist')
      console.log('responshere',response);
      setWishlistItems(response.data.wishlist.products );
    } catch (error) {
     console.log(error);
     
    }
 }
 

 
 useEffect(()=>{
 fetchWishlist()
 },[])


 const removeProduct = async (productId)=>{
   try {
     const response = await axioInstence.delete(`/user/mywishlist/${productId}`)
      
     setWishlistItems(wishlistItems.filter((item)=> item.productId._id !== productId))
     toast.success(response.data.message)
   } catch (error) {
    console.log('Error removing product:', error);

   }
 }

console.log(wishlistItems);


const handleAddToCart = async(productId,variantId)=>{

       const quantity = 1

  try {
    const response = await axioInstence.post('/user/cart-add',{
      productId: productId,
      variantId: variantId,
      quantity
    })

    if(response.status === 200){
       try {

        await axioInstence.delete(`/user/mywishlist/${productId}`)

        setWishlistItems(prevItems => 
          prevItems.filter(item => item.productId._id !== productId)
        );

        
       } catch (removeError) {
        
        toast.success(response.data.message);
        toast.warning('Added to cart but could not remove from wishlist');
        console.error('Error removing from wishlist:', removeError);
       }
    }
    
  } catch (error) {
    console.error(error.response.data);
    toast.error(error.response.data.message);
  }
   
}

const handleVariantChange = (productId, variantId) => {
  setSelectedVariants(prev => ({
    ...prev,
    [productId]: variantId
  }))
}

const breadcrumbItems = [
  { label: 'Home', url: '/' },
  { label: 'Dashboard', url: '/user/dashboard' },
  { label: 'wishlist', url: null }, 
];
  return (
    <>
      <NavBar/>
    <div className="max-w-6xl mx-auto px-4 py-8 bg-gray-50">
   <BreadcrumbUserDhbrd items={breadcrumbItems}/>
            <Toaster position="top-right" reverseOrder={false}/>

      {/* Title */}
      <div className="text-center mb-12">
        <div className="inline-block p-4 bg-white rounded-full shadow-md mb-4">
          <Heart className="w-12 h-12 text-red-500" />
        </div>
        <h1 className="text-4xl font-medium text-gray-800">My Wishlist</h1>
      </div>

      {/* Table Header */}
      <div className="bg-white rounded-t-lg shadow-sm">
        <div className="grid grid-cols-12 gap-4 py-4 px-6 border-b text-gray-600 font-medium">
          <div className="col-span-5 flex items-center">
            <Package className="w-5 h-5 mr-2" />
            Product name
          </div>
          <div className="col-span-3 flex items-center">
            <DollarSign className="w-5 h-5 mr-2" />
            Unit price
          </div>
          <div className="col-span-2 flex items-center">
            <Package className="w-5 h-5 mr-2" />
            Stock status
          </div>
          <div className="col-span-2"></div>
        </div>


        {wishlistItems.map((item) => (
          <div key={item?.productId._id} className="grid  relative grid-cols-12 gap-4 py-6 px-6 border-b items-center hover:bg-gray-50 transition-colors">

            <div className="col-span-5 flex items-center gap-4">
              <button 
              onClick={()=>removeProduct(item?.productId._id)}
              className="text-gray-400  hover:text-red-500 transition-colors">
                <Trash2 className="w-5 h-5" />
              </button>
              <img 
                src={item?.productId.images?.[0]} 
                alt={item?.proudctName} 
                className="w-15 h-20 object-cover  rounded-md shadow-sm"
              />
                {item?.productId?.offer?.offerPercentage && (
                    <div className="absolute  top-0 bg-gradient-to-r from-red-600 to-pink-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg transform -rotate-12">
                    <div className="relative">
                      <span className="block text-center text-sm">
                            {item?.productId?.offer?.offerPercentage}%
                       </span>
                     <span className="block text-center text-[10px] font-normal">OFF</span>
                     <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white"></div>
                          </div>
                          </div>
                        )}
              
              <span className="font-medium text-gray-800">{item?.productId.productName}</span>
              <select
                  className="mt-2 p-1 text-sm border rounded-md"
                  value={selectedVariants[item?.productId?._id] || ''}
                  onChange={(e) => handleVariantChange(item?.productId?._id, e.target.value)}
                >
                  {item.productId.variants.map((variant) => (
                    <option key={variant._id} value={variant._id}>
                      {variant.weight} -  ({variant.stock} available)
                    </option>
                  ))}
                </select>
            </div>

            {/* Price */}
            <div className="col-span-3">
              
                <span className="text-gray-400 line-through mr-2">₹{item?.productId.variants?.[0]?.regularPrice}</span>
            
              <span className="text-gray-900 font-semibold">₹{item?.productId.variants?.[0]?.salePrice}</span>
            </div>

            {/* Stock Status */}
            <div 
              className={`col-span-2 font-medium ${
                item?.productId.variants?.[0]?.stock > 0
                  ? 'text-green-600'
                  : 'text-red-600'
              }`}           
               >
            {item?.productId.variants?.[0]?.stock > 0 ? 'In Stock' : 'Out of Stock'}
            </div>

            {/* Add to Cart and Date */}
            <div className="col-span-2">
              <div className="flex flex-col items-end gap-2">
              <button 
                  onClick={() => handleAddToCart(
                    item.productId._id,
                    selectedVariants[item.productId._id]
                  )}
                  disabled={!item.productId.variants.find(v => 
                    v._id === selectedVariants[item.productId._id] && v.stock > 0
                  )}
                  className={`px-4 py-2 rounded-full flex items-center ${
                    item.productId.variants.find(v => 
                      v._id === selectedVariants[item.productId._id] && v.stock > 0
                    )
                      ? 'bg-teal-600 hover:bg-teal-700 text-white'
                      : 'bg-gray-300 cursor-not-allowed text-gray-500'
                  }`}
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Add to cart
                </button>
                <span className="text-sm text-gray-500 flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  Added: {item?.createdAt?.split('T')[0]}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
    </>
  )
}

