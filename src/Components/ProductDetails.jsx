
import React, { useState,useRef, useEffect } from 'react';
import { Star, ShoppingCart, Heart, ChevronLeft, ChevronRight, Cake, AlertTriangle, Ruler, Plus, Minus } from 'lucide-react';
import 'react-medium-image-zoom/dist/styles.css';
import { useParams } from 'react-router-dom';
import axiosInstence from '../utils/axioInstence';
import toast, { Toaster } from "react-hot-toast";
import ProductList from './ProductList';
import UserBreadcrumb from './UserBrudCrums';
import NavBar from './Navbar';
import Footer from './Footer';
import { userLogout } from '../redux/slices/authSlice';
import { useDispatch } from 'react-redux';



const ProductDetails = () => {
  const {id} = useParams()
  const [product, setProduct] = useState(null)
  const [quantity, setQuantity] = useState(1);
  const [currentImage, setCurrentImage] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [selectedVariant, setSelectedVariant] = useState(product?.variants[0]||null); 
  const [selectedWeight, setSelectedWeight] = useState(null);

  const dispatch = useDispatch()




  const imageRef = useRef(null);

  
  const handleVariantChange = (variant) => {
    setSelectedVariant(variant);
    setSelectedWeight(variant.weight);
  };




  const fetchProductDetails = async () => {
    try {
      const response = await axiosInstence.get(`/user/productshow/${id}`);
      console.log('details',response);
      
      const productData = response.data;
      
      const defaultVariant = productData.variants.find(
        (variant) => variant.weight === "1 kg"
      );
      setProduct(productData);
      setSelectedVariant(defaultVariant || productData.variants[0]); 

    } catch (error) {
      console.error("Error fetching product details:", error);
    }
  };
  console.log(product);
  
  useEffect(() => {
    console.log('useEffect is running');
    if (id) {
      fetchProductDetails();
    } else {
      console.log('Product ID is missing');
    }
  }, [id]);

  if (!product) {
    return <div>Loading...</div>;
  }

  const nextImage = () => {
    setCurrentImage((currentImage + 1) % product.images.length);
  };

  const prevImage = () => {
    setCurrentImage((currentImage - 1 + product.images.length) % product.images.length);
  };

  const addToWishlist = async(productId) => {
    setIsWishlisted(!isWishlisted);
    console.log('insideid',productId);
    
    try {
      const response = await axiosInstence.post('/user/wishlist/add',{productId})
      console.log(response);
      toast.success(response.data.message)
      
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message)
    }

  };



  //Cart Handling 

  const handleCart = async()=>{
       
    try {
      const response = await axiosInstence.post('/user/cart-add',{
        productId: product._id,
        variantId: selectedVariant._id,
        quantity
      })
        toast.success(response.data.message)
        setProduct((prevProduct) => ({
          ...prevProduct,
          variants: prevProduct.variants.map((variant) =>
            variant._id === selectedVariant._id
              ? { ...variant, stock: variant.stock - quantity }
              : variant
          ),
        }));
        
        setSelectedVariant(prev => ({
          ...prev,
          stock: prev.stock - quantity
        }));

      
    } catch (error) {
      console.error(error.response.data);
      toast.error(error.response.data.message);
      if (error.response?.data?.message === 'Please login to continue') {
        dispatch(userLogout())
      } 
    }
     
  }



  const handleMouseMove = (e) => {
    if (!imageRef.current || !isZoomed) return;

    const rect = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setMousePosition({ x, y });
  };

  const toggleZoom = () => {
    setIsZoomed(!isZoomed);
  };
  





  return (
    <div className="bg-gradient-to-br from-[#f3e7e0] to-[#d8cbc4] min-h-screen font-sans">
      <NavBar/>
     <Toaster position="top-right" reverseOrder={false}/>
    <div className="container mx-auto px-4 py-8">
    <UserBreadcrumb productName={product?.productName || "Product"} />
      <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex flex-col lg:flex-row">
          <div className="lg:w-2/3 p-6">
            <div className="relative rounded-xl overflow-hidden shadow-lg aspect-w-16 aspect-h-9">
            <div 
            className="relative rounded-xl overflow-hidden shadow-lg aspect-w-16 aspect-h-9"
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setIsZoomed(false)}
          >
            <div 
              ref={imageRef}
              className="relative w-full h-full overflow-hidden cursor-zoom-in"
              onClick={toggleZoom}
            >
              <img
                className={`w-full h-full object-cover transition-transform duration-300 ${
                  isZoomed ? 'scale-[2.5]' : 'scale-100'
                }`}
                src={product.images[currentImage]}
                alt={`${product.name} - Image ${currentImage + 1}`}
                style={{
                  transformOrigin: `${mousePosition.x}% ${mousePosition.y}%`,
                  ...(isZoomed ? {
                    transform: `scale(2.5) translate(${
                      (50 - mousePosition.x) / 2.5
                    }%, ${(50 - mousePosition.y) / 2.5}%)`,
                  } : {})
                }}
              />
              
              {isZoomed && (
                <div 
                  className="absolute top-2 right-2 bg-white bg-opacity-75 px-3 py-1 rounded-md text-sm text-gray-700"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsZoomed(false);
                  }}
                >
                  Close Zoom
                </div>
              )}
            </div>
          </div>
          
              <button
                className="absolute top-4 right-4 p-2 bg-white bg-opacity-75 rounded-full text-[#8b6c5c] hover:text-[#3d2516] transition duration-300 shadow-md"
                onClick={()=>addToWishlist(product?._id)}
              >
                <Heart className={`h-6 w-6 ${isWishlisted ? 'fill-current text-red-500' : ''}`} />
              </button>
              <button
                className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 bg-white bg-opacity-75 rounded-full text-[#8b6c5c] hover:text-[#3d2516] transition duration-300 shadow-md"
                onClick={prevImage}
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 bg-white bg-opacity-75 rounded-full text-[#8b6c5c] hover:text-[#3d2516] transition duration-300 shadow-md"
                onClick={nextImage}
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </div>

           {/* Stock Details Section */}
      

        
        <div className="mt-6 flex justify-center space-x-4 overflow-x-auto pb-4">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    className={`flex-shrink-0 h-20 w-20 rounded-lg overflow-hidden border-2 ${
                      currentImage === index ? 'border-[#8b6c5c] ring-2 ring-[#8b6c5c] ring-opacity-50' : 'border-transparent'
                    } focus:outline-none focus:ring-2 focus:ring-[#8b6c5c] transition duration-300 shadow-md`}
                    onClick={() => setCurrentImage(index)}
                  >
                    <img src={image} alt={`${product.name} - Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
            <div className="lg:w-1/3 p-6 lg:p-8 space-y-6">
              <h1 className="text-4xl font-extrabold text-[#3d2516] leading-tight">{product.productName}</h1>
              
              <div className="flex items-center">
                <div className="flex mr-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`h-5 w-5 ${i < Math.floor(4) ? 'text-yellow-500' : 'text-gray-300'}`} />
                  ))}
                </div>
                <span className="text-[#5b3e31] font-medium">{product.rating} out of 5 stars</span>
              </div>
              

              <div className="flex items-center space-x-4 mt-2">
               <p className="text-2xl font-bold text-[#8b6c5c]">₹{selectedVariant?.salePrice ? selectedVariant?.salePrice : selectedVariant?.regularPrice}</p>
               <p className="text-2xl font-bold text-[#d8d8d8] line-through">{!selectedVariant?.salePrice || selectedVariant?.salePrice!==selectedVariant?.regularPrice && `₹${selectedVariant?.regularPrice}`}</p>
               {product?.offer?.offerPercentage&& (
                    <span className="bg-red-600 text-white text-sm font-bold px-3 py-1 rounded-full shadow-md">
                      {product?.offer?.offerPercentage}
                      % OFF
                    </span>
                  )}
              </div>
              <p className="text-lg text-[#5b3e31] leading-relaxed">{product.description}</p>
              
              
              <div>
                <h3 className="text-xl font-semibold text-[#3d2516] mb-3 flex items-center">
                  <Ruler className="mr-2" size={24} />
                  Available Sizes
                </h3>
                <div className="flex flex-wrap gap-3">
                  {product.variants.map((variant, index) => (
                    <button 
                      key={index}  
                      onClick={()=> handleVariantChange(variant)}
                      className={`px-4 py-2 border-2 border-[#8b6c5c] rounded-md text-[#5b3e31] font-bold transition duration-300 transform shadow-md ${
                        selectedWeight === variant.weight
                          ? "bg-[#8b6c5c] text-white" // Selected weight style
                          : "hover:bg-[#8b6c5c] hover:text-white hover:scale-105" // Default hover style
                      }`}
                    >
                      {variant.weight}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
                <div className="flex items-center border-2 border-[#8b6c5c] rounded-md shadow-md">
                  <button 
                    className="px-3 py-2 text-[#5b3e31] hover:bg-[#8b6c5c] hover:text-white transition duration-300 text-xl font-bold"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    <Minus size={20} />
                  </button>
                  <span className="px-4 py-2 text-[#3d2516] font-bold text-xl">{quantity}</span>
                  <button 
                    className="px-3 py-2 text-[#5b3e31] hover:bg-[#8b6c5c] hover:text-white transition duration-300 text-xl font-bold"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    <Plus size={20} />
                  </button>
                </div>
              </div>

                    <div className="availability mt-4">
                    {selectedVariant?.stock <= 0 ? (
                        <p className="text-red-500 font-bold text-xl">Out of Stock</p>
                      ) : (
                        <>
                        <p className="text-green-500 font-bold text-xl">Available Now</p>
                        <p className="text-[#3d2516] text-lg font-medium">
                          Stock left: {selectedVariant?.stock}
                        </p>
                      </>                      )}

                  </div>

                     <div className="flex-shrink-0 flex gap-3">
                     <button 
                     onClick={handleCart}
                    className={`sm:w-auto px-1 py-3 rounded-md transition duration-300 flex items-center justify-center text-lg font-bold uppercase tracking-wide transform shadow-md ${
                      selectedVariant?.stock <= 0
                        ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                        : 'bg-[#8b6c5c] text-white hover:bg-[#765341]'
                    }`}                     
                     disabled={selectedVariant?.stock <=0}
                     >
                    <ShoppingCart className="mr-2" size={20} />
                    Add to Cart
                 </button>    
               </div>
            </div>
          </div>
        </div>
      </div>
      <ProductList/>
      <Footer/>
    </div>
  )
};

export default ProductDetails;

